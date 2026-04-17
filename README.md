# "할래말래?"

React Native + Expo로 실시간 날씨·한강 수온을 확인하고 날씨 기반 활동을 추천하는 앱

## 기술 스택

- React Native 0.81.5 / React 19.1.0
- Expo SDK 54 / expo-router v6
- TypeScript 5.9.2
- TanStack Query v5 (서버 상태 캐싱·재시도)
- ky v2 (HTTP 클라이언트)
- React Native Reanimated v4 (고성능 애니메이션)
- @gorhom/bottom-sheet v5 (하단 시트 모달)
- expo-location (위치 권한 + 좌표 조회)

## 실행 방법

```bash
npm install
npx expo start
```

## 구현 화면

### 홈 화면 (단일 스크린)

- 현재 날씨 (기온, 체감온도, 습도, 풍속, 강수 여부) 표시
- 한강 수온 표시 (서울 열린데이터광장 API)
- 날씨 조건별 활동 카드 3~5개 추천
- 날씨 조건에 따른 배경 색상 전환 (Reanimated 색상 보간)
- 로딩 중 스켈레톤 UI
- 위치 권한 거부 시 서울 시청 좌표로 자동 폴백
- 에러 상태 → 흔들림(shake) 애니메이션 + 재시도 버튼

### 활동 상세 (Bottom Sheet)

- 활동 카드 탭 → 하단 시트 슬라이드 업
- 적합도(별점), 소요 시간, 준비물 체크리스트 표시
- 체크리스트 항목 순차 등장 애니메이션 (cascading fade + spring)

## 유저 플로우

```mermaid
flowchart TD
    A([앱 진입]) --> B[위치 권한 다이얼로그]

    B --> C{사용자 선택}
    C -->|허용| D[로딩 화면\n내 위치 기준]
    C -->|거부| E[로딩 화면\n서울 기준]

    D & E --> F{날씨 로드}
    F -->|실패| G[에러 화면\n재시도 버튼]
    G -->|재시도 탭| F
    F -->|성공| H[홈 화면\n날씨 정보 + 활동 카드]

    H --> I[활동 카드 탭]
    I --> J[활동 상세 시트\n별점 · 소요시간 · 체크리스트]

    J -->|위치 허용한 경우| K[근처 장소 표시\n이름 · 주소 · 거리]
    J -->|위치 거부한 경우| L[대표 장소 표시\n이름 · 주소]
    J -->|닫기| H
```

## 디렉토리 구조

```text
├── app/
│   ├── _layout.tsx          # 루트 레이아웃 (Provider 중첩)
│   └── index.tsx            # 홈 스크린 (날씨 + 활동 추천)
├── components/
│   ├── WeatherSection.tsx          # 날씨 수치 표시
│   ├── ActivityCard.tsx            # 활동 카드 (제스처 애니메이션)
│   ├── ActivityBottomSheet.tsx     # 활동 상세 하단 시트
│   ├── AnimatedGradientBackground.tsx  # 날씨별 배경 색상 전환
│   ├── ActivitySkeleton.tsx        # 활동 카드 스켈레톤
│   └── WeatherSkeleton.tsx         # 날씨 섹션 스켈레톤
├── hooks/
│   ├── useLocation.ts        # 위치 권한 + 좌표
│   ├── useGetWeather.ts      # 날씨 쿼리 (폴백 포함)
│   └── useGetHangangTemp.ts  # 한강 수온 쿼리
├── services/
│   ├── weather.ts            # KMA API 파싱 + 체감온도 계산
│   └── hangang.ts            # 서울 열린데이터 API 래핑
├── lib/
│   └── api.ts                # ky 인스턴스 (API별 baseURL + 인증)
├── constants/
│   ├── activities.ts         # 조건별 활동 정의 (15개)
│   ├── weatherCondition.ts   # 날씨 조건 판별 + 메시지
│   ├── queryKeys.ts          # Query Key Factory
│   └── status.ts             # LocationStatus 상수
└── types/
    ├── activity.ts           # Activity 인터페이스
    ├── weather.ts            # KMA 원시 타입 + 도메인 타입
    ├── hangang.ts            # 한강 API 응답 타입
    └── status.ts             # LocationStatus 타입
```

## 추가 구현

- [x] 활동별 장소/위치 정보 추가
- [ ] 날씨 정보 위젯화 (기온, 수온, 습도 등을 개별 위젯으로 분리해 사용자가 커스터마이징 가능)
- [x] 풍속 설명 헬퍼 추가
