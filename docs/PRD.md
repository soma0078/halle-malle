# PRD — "할래말래?" (날씨 기반 활동 추천앱)

## 앱 개요

현재 위치 기반 날씨와 한강 수온을 보여주고, 날씨 조건에 맞는 활동을 추천하는 React Native 앱.

---

## 스크린

### 스플래시 (`app/_layout.tsx`)

- `expo-splash-screen` 기본 fade 애니메이션 (duration: 1000ms)
- 앱 진입 시 `expo-location` 위치 권한 요청
- 권한 요청 완료(승인/거부 무관) 후 `SplashScreen.hideAsync()` 호출

### 홈 (`app/index.tsx`)

**상단 — 날씨 섹션**

| 항목                  | 설명                                                            |
| --------------------- | --------------------------------------------------------------- |
| 날씨 아이콘           | SKY + PTY 조건 기반 Ionicons 매핑                               |
| 현재 기온 / 체감 기온 | `TMP` / 체감온도 공식 계산 (Heat Index ≥10°C, Wind Chill <10°C) |
| 습도 / 풍속           | `REH` / `WSD`                                                   |
| 한강 수온             | 서울 열린데이터광장 API                                         |
| 위치 권한 거부 배너   | 권한 미동의 시 안내 메시지 + 서울시청 좌표 폴백                 |
| Mood 메시지           | 기온·날씨 조건별 텍스트                                         |
| 배경 그라데이션       | 날씨 상태별 동적 색상 전환 (800ms interpolation)                |
| 로딩 스켈레톤         | 데이터 페칭 중 표시                                             |
| 에러 상태             | 재시도 버튼 + shake 애니메이션                                  |

**하단 — 활동 추천 섹션**

| 항목                   | 설명                                                             |
| ---------------------- | ---------------------------------------------------------------- |
| 추천 카드 리스트       | 날씨 조건 기반 가로 스크롤 카드 (총 15개 활동, 조건별 3~5개)     |
| 카드 탭 피드백         | scale 0.95 애니메이션 + Light haptic 제스처                      |
| 활동 상세 Bottom Sheet | 활동명, 적합도(별점), 소요시간, 준비물 체크리스트 (50%·70% snap) |
| 체크리스트 애니메이션  | 준비물 항목 순차 등장 (80ms delay, 250ms spring)                 |

---

## 비즈니스 로직

### 날씨 상태 분류 (기상청 SKY / PTY 코드)

| 분류  | 조건                      |
| ----- | ------------------------- |
| 맑음  | SKY=1, PTY=0              |
| 구름  | SKY=3 또는 SKY=4, PTY=0   |
| 비    | PTY=1 또는 PTY=4 (소나기) |
| 비/눈 | PTY=2                     |
| 눈    | PTY=3                     |

### Mood 메시지

| 조건                     | 메시지                                      |
| ------------------------ | ------------------------------------------- |
| 기온 ≥ 28°C              | "밖이 뜨거워요! 시원한 활동 어때요?"        |
| 20°C ≤ 기온 < 28°C, 맑음 | "나들이 딱 좋은 날씨예요!"                  |
| 기온 < 20°C, 맑음        | "선선해요. 가볍게 산책해 볼까요?"           |
| SKY=3 또는 SKY=4, PTY=0  | "흐린 날엔 실내가 최고죠."                  |
| PTY≠0 (비 / 비눈 / 눈)   | "비가 와요. 집에서 할 수 있는 활동 어때요?" |

### 활동 추천 조건

클라이언트 사이드 룰 기반. 서버 불필요.

| 조건                           | 추천 활동                                       |
| ------------------------------ | ----------------------------------------------- |
| 맑음 + 기온 ≥ 28°C             | 한강 수영, 물놀이, 아이스크림 투어, 루프탑 카페 |
| 맑음 + 20°C ≤ 기온 < 28°C      | 한강 피크닉, 자전거 라이딩, 야외 러닝, 캠핑     |
| 맑음 + 기온 < 20°C             | 공원 산책, 야외 카페, 등산                      |
| SKY=3 또는 SKY=4, PTY=0 (흐림) | 전시회, 실내 스포츠, 보드게임 카페, 쇼핑몰 투어 |
| PTY≠0 (비 / 눈)                | 영화관, 실내 카페, 독서, 홈쿡                   |

---

## API 명세

### 날씨 — 기상청 오픈 API (동네예보)

| 항목     | 내용                                                                      |
| -------- | ------------------------------------------------------------------------- |
| Endpoint | `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst` |
| 인증     | `?serviceKey={EXPO_PUBLIC_WEATHER_API_KEY}`                               |
| 파라미터 | `pageNo`, `numOfRows`, `dataType`, `base_date`, `base_time`, `nx`, `ny`   |
| 좌표계   | 위경도 → 기상청 격자 좌표(nx, ny) 변환 필요                               |

사용 category 코드:

```
TMP   // 기온 (°C)
SKY   // 하늘상태 (1=맑음, 3=구름많음, 4=흐림)
PTY   // 강수형태 (0=없음, 1=비, 2=비/눈, 3=눈, 4=소나기)
REH   // 습도 (%)
WSD   // 풍속 (m/s)
```

> 체감기온: `TMP`, `WSD`, `REH` 기반 체감온도 공식으로 클라이언트 계산. (≥10°C: Heat Index, <10°C: Wind Chill)
> 위경도 → 격자 좌표 변환: `kma-grid` 라이브러리 사용.
> base_time: 기상청 발표 시각(02/05/08/11/14/17/20/23시) 기준 가장 가까운 이전 시각 선택.

### 한강 수온 — 서울 열린데이터광장

| 항목     | 내용                                                                     |
| -------- | ------------------------------------------------------------------------ |
| Endpoint | `http://openapi.seoul.go.kr:8088/(인증키)/json/WPOSInformationTime/1/5/` |
| 인증     | `EXPO_PUBLIC_SEOUL_API_KEY`                                              |
| 파라미터 | `KEY`, `TYPE`, `SERVICE`, `START_INDEX`, `END_INDEX`, `YMD`(optional)    |
| 응답필드 | `WATT` (수온), 첫 번째 측정소 데이터 사용                                |
| 위치거부 | 기본값으로 첫 번째 측정소 데이터 사용                                    |

### 위치 — expo-location

```ts
const { status } = await Location.requestForegroundPermissionsAsync();
const { coords } = await Location.getCurrentPositionAsync();
// coords.latitude, coords.longitude
```

---

## 환경변수

```
EXPO_PUBLIC_WEATHER_API_KEY=
EXPO_PUBLIC_SEOUL_API_KEY=
```

---

## 시스템 플로우

```mermaid
flowchart TD
    A([앱 시작]) --> B[expo-location\n권한 요청]

    B --> C{LocationStatus}
    C -->|GRANTED| D[getCurrentPositionAsync\n위경도 획득]
    C -->|DENIED| E[서울 시청 좌표 폴백\n37.5665° N, 126.9780° E]
    C -->|ERROR| E

    D & E --> F[위경도 → KMA 격자 변환\nkma-grid]
    F --> G[KMA 동네예보 API 호출\nTMP · SKY · PTY · REH · WSD]
    F --> H[서울 열린데이터 API 호출\n한강 수온]

    G --> I{날씨 응답}
    I -->|실패\n네트워크/타임아웃| J[getWeatherErrorMessage\n에러 메시지 분류]
    J --> K[shake 애니메이션\n재시도 버튼 노출]
    K -->|refetch| G
    I -->|성공| L[WeatherResponse 파싱\n체감온도 계산\nHeat Index or Wind Chill]

    H --> M{수온 응답}
    M -->|실패| N[waterTemp = null\n수온 위젯 숨김]
    M -->|성공| O[첫 번째 측정소 수온 사용]

    L --> P[getWeatherCondition\nhot_sunny / warm_sunny\ncool_sunny / cloudy / rainy]
    P --> Q[getActivitiesByCondition\n조건별 활동 3~5개 필터]
    P --> R[GRADIENT_COLORS 매핑\nReanimated 색상 보간 800ms]

    Q --> S[ActivityCard 목록 렌더링]
    S --> T{카드 탭}
    T --> U[ActivityBottomSheet present]

    U --> V{LocationStatus}
    V -->|DENIED / ERROR| W[activities.ts 정적 place\n대표 장소 표시]
    V -->|GRANTED| X[카카오 로컬 API 호출\n키워드 + 사용자 좌표\n반경 검색]
    X --> Y{장소 응답}
    Y -->|실패| W
    Y -->|성공| Z[가까운 장소 표시\n이름 · 주소 · 거리]
```
