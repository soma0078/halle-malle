# CLAUDE.md

날씨 + 한강 수온 확인 및 날씨 기반 활동 추천 앱

**기술 스택:** Expo SDK 54, expo-router, TanStack Query, ky, Reanimated 4, expo-location

## 폴더 구조

```
app/           # expo-router 스크린. UI 조합만. 비즈니스 로직 금지
components/    # 재사용 UI 컴포넌트
hooks/         # useQuery 래핑 커스텀 훅
services/      # API 호출 함수. ky 인스턴스 사용
lib/           # ky 인스턴스 등 공통 설정
constants/     # 정적 데이터, 조건 매핑, 유틸 함수 포함 가능
types/         # 타입 정의 (raw API 타입 + 도메인 타입)
```

- 컨벤션 → [`.claude/conventions.md`](.claude/conventions.md)
- 아키텍처 → [`.claude/architecture.md`](.claude/architecture.md)
