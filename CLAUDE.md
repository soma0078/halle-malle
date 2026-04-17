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

## 커밋 전 체인지로그 룰

커밋 전에 반드시 `CHANGELOG.md`를 먼저 업데이트한다.

- **[Unreleased]** 섹션에 작성한다. 릴리즈 시 날짜와 버전으로 확정한다.
- 변경 유형은 `Added` / `Changed` / `Fixed` / `Removed` 중 해당하는 것만 사용한다.
- ADR이 있으면 해당 ADR 번호와 제목을 섹션 헤더로 표기한다. (예: `### ADR-001: ...`)
- 항목은 파일 단위가 아니라 **사용자에게 보이는 변화** 중심으로 기술한다.
- 코드 리팩터링 / 타입 변경처럼 UX 변화가 없는 경우에도 `Changed`에 간략히 기록한다.
