# Changelog

모든 주목할 만한 변경 사항을 이 파일에 기록합니다.
형식은 [Keep a Changelog](https://keepachangelog.com/ko/1.0.0/)를 따릅니다.

---

## [Unreleased] — 2026-04-17

### ADR-001: 위치 기반 근처 장소 추천

활동 카드 탭 시 사용자 좌표 기준으로 가까운 장소를 카카오 로컬 API로 동적 조회하고,
위치 권한 거부 시에는 기존 정적 장소로 폴백하는 구조를 완성했습니다.

#### Added

- `types/activity.ts` — `ActivityPlace`에 `distance?: number`, `source: "static" | "nearby"` 필드 추가
- `constants/activityKeywords.ts` — 활동 ID → 카카오 키워드 매핑 상수 (14개 활동)
- `services/places.ts` — 카카오 로컬 키워드 검색 API 호출 함수 (`getNearbyPlaces`, `getNearbyPlace`)
- `lib/api.ts` — 카카오 REST API용 `ky` 인스턴스 (`kakaoApi`)
- `hooks/useGetNearbyPlace.ts` — TanStack Query 래핑 훅, `enabled` 옵션 지원

#### Changed

- `constants/queryKeys.ts` — `nearbyPlaces` 캐시 키에 좌표 소수점 2자리 반올림 적용 (약 1km 격자 캐싱)
- `constants/activities.ts` — 모든 정적 장소에 `source: "static"` 추가
- `components/ActivityBottomSheet.tsx`
  - `coords: Coords | null`, `locationStatus: string` props 수신
  - `GRANTED` 상태에서 카카오 API 호출, 로딩 중 장소 행 스켈레톤 표시
  - API 성공 시 근처 장소 표시 (`source: "nearby"`) + 거리 배지 (m / km)
  - API 실패 또는 결과 없음 시 정적 장소로 폴백 (`source: "static"`)
  - `DENIED` / `ERROR` 상태에서는 정적 장소 그대로 표시
- `app/index.tsx` — `ActivityBottomSheet`에 `coords`, `locationStatus` props 전달

#### 데이터 흐름

```
locationStatus
├── PENDING  → (활동 카드 비표시)
├── DENIED   → 정적 place 표시
└── GRANTED  → 카카오 로컬 API 호출
                ├── 로딩 중  → 장소 행 스켈레톤
                ├── 성공    → 근처 장소 + 거리 배지
                └── 실패    → 정적 place 폴백
```

---

## [0.1.0] — 2026-04-16

### Added

- 위치 권한 요청 및 좌표 획득 (`useLocation`)
- 기상청 날씨 API 연동 (`useGetWeather`)
- 한강 수온 API 연동 (`useGetHangangTemp`)
- 날씨 조건 → 추천 활동 매핑 (`constants/activities.ts`, `constants/weatherCondition.ts`)
- 활동 추천 카드 가로 스크롤 (`ActivityCard`)
- 활동 상세 Bottom Sheet (`ActivityBottomSheet`) — 체크리스트 순차 등장 애니메이션
- 날씨 조건별 배경 그라데이션 전환 (`AnimatedGradientBackground`)
- 로딩 스켈레톤 (`WeatherSkeleton`, `ActivitySkeleton`)
- 에러 shake 애니메이션
- expo-splash-screen 페이드 애니메이션 + 위치 권한 요청 후 홈 자동 전환
- 위치 권한 거부 / 네트워크 에러 엣지 케이스 처리
