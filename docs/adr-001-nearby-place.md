# ADR-001: 위치 기반 근처 장소 추천

- **상태:** Proposed
- **날짜:** 2026-04-16

## 배경

현재 활동 상세 시트에는 각 활동의 대표 장소가 정적 데이터(`activities.ts`)로 하드코딩되어 있다. 위치 권한을 허용한 사용자에게도 동일한 고정 장소만 보여주는 것은 위치 정보를 활용하지 못하는 UX 낭비다.

위치 권한을 허용한 경우 사용자 좌표 기준으로 가까운 장소를 동적으로 추천하고, 거부한 경우에는 기존 정적 장소를 폴백으로 사용하는 구조가 필요하다.

## 결정

### 1. Places API — 카카오 로컬 API 채택

| API                 | 근거                                                      |
| ------------------- | --------------------------------------------------------- |
| **카카오 로컬 API** | 국내 POI 품질 우수, 키워드 검색 지원, 무료 (일 30만 건)   |
| Google Places API   | 유료 (월 $200 크레딧 초과 시 과금), 국내 데이터 밀도 낮음 |
| Naver Local API     | 일 1,000건으로 한도가 낮아 실사용 부적합                  |

### 2. 장소 데이터 출처 구분

`ActivityPlace`에 `source` 필드를 추가해 정적/동적 장소를 타입 레벨에서 구분한다.

```ts
export interface ActivityPlace {
  name: string;
  address: string;
  distance?: number; // 사용자로부터 몇 m (nearby일 때만)
  source: "static" | "nearby"; // 데이터 출처
}
```

### 3. 장소 조회 시점 — 단건 지연 로딩 (lazy)

활동 카드를 탭할 때 해당 활동 1건만 조회한다.

**기각된 대안: 홈 화면 로드 시 전체 prefetch**

- 활동 3~5개를 동시에 조회하므로 API 호출 수가 많아진다.
- 사용자가 카드를 탭하지 않으면 불필요한 호출이 발생한다.

**채택 이유:**

- 사용자 행동(탭) 이후에만 API를 호출하므로 낭비가 없다.
- BottomSheet 내에서 스켈레톤으로 로딩을 처리할 수 있어 UX 단절이 적다.

### 4. 활동 → 검색 키워드 매핑

카카오 키워드 검색에 사용할 쿼리를 `constants/activityKeywords.ts`로 분리 관리한다.

```ts
const ACTIVITY_KEYWORDS: Record<string, string> = {
  swimming: "한강 수영장",
  water_play: "물놀이장",
  icecream_tour: "아이스크림",
  picnic: "한강공원",
  cycling: "자전거 대여",
  running: "공원 러닝코스",
  park_walk: "공원",
  outdoor_cafe: "야외 카페",
  exhibition: "전시회",
  indoor_sports: "실내 스포츠센터",
  boardgame_cafe: "보드게임 카페",
  cinema: "영화관",
  indoor_cafe: "카페",
  reading: "도서관",
};
```

### 5. TanStack Query 캐시 키 — 좌표 반올림

좌표를 소수점 2자리로 반올림해 약 1km 격자로 묶는다. 수십 미터 이동마다 재요청하는 것을 방지한다.

```ts
// 37.1234, 126.5678 → 37.12, 126.57
function roundCoords(coords: Coords) {
  return {
    lat: Math.round(coords.latitude * 100) / 100,
    lon: Math.round(coords.longitude * 100) / 100,
  };
}

queryKeys.nearbyPlace(activityId, roundCoords(coords));
```

### 6. 데이터 흐름

```
LocationStatus (앱 시작 시 이미 확정)
├── PENDING  → 장소 섹션 스켈레톤
├── DENIED   → 정적 place 표시 (source: 'static')
└── GRANTED  → 카카오 로컬 API 호출
                ├── 성공 → 근처 장소 표시 (source: 'nearby')
                └── 실패 → 정적 place 폴백 (source: 'static')
```

BottomSheet에서 권한을 재확인하지 않는다. 앱 시작 시 확정된 `LocationStatus`를 그대로 내려받아 사용한다.

## 결과

### 영향 파일

| 파일                                 | 변경                                                  |
| ------------------------------------ | ----------------------------------------------------- |
| `types/activity.ts`                  | `ActivityPlace`에 `distance`, `source` 추가           |
| `constants/activityKeywords.ts`      | 신규                                                  |
| `services/places.ts`                 | 신규 — 카카오 로컬 API 호출                           |
| `lib/api.ts`                         | 카카오 API ky 인스턴스 추가                           |
| `hooks/useGetNearbyPlace.ts`         | 신규                                                  |
| `constants/queryKeys.ts`             | `nearbyPlace` 키 추가                                 |
| `components/ActivityBottomSheet.tsx` | `coords` + `locationStatus` props 수신, 스켈레톤 처리 |

### 트레이드오프

| 장점                                             | 단점                                              |
| ------------------------------------------------ | ------------------------------------------------- |
| 위치 허용 사용자에게 실질적으로 유용한 장소 제공 | 카카오 API 키 발급 및 환경변수 추가 필요          |
| 정적 폴백으로 권한 거부 시에도 UX 유지           | 카드 탭 시 짧은 로딩 발생                         |
| 1km 캐시 격자로 반복 요청 최소화                 | 키워드 매핑의 정확도가 활동명에 따라 다를 수 있음 |
