# 카카오 로컬 API 설정 가이드

카카오 로컬 API 연동 시 발생하는 에러와 해결 방법 정리

---

## 에러 유형별 원인과 해결

### NotAuthorizedError — `OPEN_MAP_AND_LOCAL service disabled`

```json
{
  "errorType": "NotAuthorizedError",
  "message": "App(앱이름) disabled OPEN_MAP_AND_LOCAL service."
}
```

**원인:** 카카오맵 제품이 활성화되어 있지 않음

**해결:**

1. [Kakao Developers](https://developers.kakao.com) → 내 애플리케이션 → 앱 선택
2. **제품 설정 → 카카오맵** → 사용 설정 **활성화**

---

### AccessDeniedError — 플랫폼 미등록

**원인:** REST API 키를 사용하더라도 요청 출처 플랫폼이 등록되어 있지 않으면 거부됨

**해결:**

1. **앱 설정 → 플랫폼** → iOS/Android 플랫폼 추가
   - iOS: Bundle ID (`app.json`의 `ios.bundleIdentifier`)
   - Android: 패키지명 (`app.json`의 `android.package`) + 키 해시

## 체크리스트

- [ ] 카카오 개발자 콘솔에서 **카카오맵 활성화**
- [ ] **플랫폼 등록** (iOS Bundle ID / Android 패키지명 + 키 해시)
- [ ] `.env`에 `EXPO_PUBLIC_KAKAO_REST_API_KEY` 설정
- [ ] dev server 재시작 후 env 변수 로딩 확인

## 참고

- 카카오 로컬 API: https://developers.kakao.com/docs/ko/local/dev-guide
- 카카오 앱 설정: https://developers.kakao.com/console/app
