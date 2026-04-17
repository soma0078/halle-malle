# Architecture

## 데이터 흐름

```
screen (app/)
  └── hook (hooks/)
        └── service (services/)
              └── ky instance (lib/api.ts)
```

## ky 인스턴스

- `lib/api.ts`에서 API별로 인스턴스를 생성해 export
- prefix, 공통 searchParams, timeout 설정
  ```ts
  export const weatherApi = ky.create({ prefix: '...', searchParams: { ... } });
  ```

## 상수 & 조건 분기

- 조건 매핑은 `Record<타입, 값>` 형태로 상수화
  ```ts
  export const GRADIENT_COLORS: Record<WeatherCondition, [string, string]> = { ... };
  ```
- 스크린/컴포넌트에서 직접 if/switch 대신 상수 조회 사용
