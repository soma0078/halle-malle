# Constants와 Types 정의

## ✅ 권장: Type-Driven Constants

상수 객체에서 타입을 유도하여 **단일 source of truth**를 유지합니다.

```typescript
// constants/weatherCondition.ts
export const WEATHER_CONDITIONS = {
  HOT_SUNNY: "hot_sunny",
  WARM_SUNNY: "warm_sunny",
  COOL_SUNNY: "cool_sunny",
  CLOUDY: "cloudy",
  RAINY: "rainy",
} as const;

// 타입은 값에서 자동으로 유도됨
export type WeatherCondition =
  (typeof WEATHER_CONDITIONS)[keyof typeof WEATHER_CONDITIONS];
```

**장점:**

- ✅ 단일 source of truth (DRY 원칙)
- ✅ 상수 추가 시 type도 자동으로 업데이트
- ✅ 타입 안전성 유지
- ✅ 번들 사이즈 최적화 (tree-shaking 가능)

**사용처:**

- 문자열 열거형 상수 (weather conditions, activity types, status values 등)
- 여러 파일에서 참조되는 정적 값

---

## ❌ 피해야 할 패턴

### 패턴 1: Type과 값을 따로 정의 (DRY 위반)

```typescript
// ❌ 피하기
// types/weather.ts
export type WeatherCondition =
  | "hot_sunny"
  | "warm_sunny"
  | "cool_sunny"
  | "cloudy"
  | "rainy";

// constants/activities.ts
export const WEATHER_CONDITIONS = {
  HOT_SUNNY: "hot_sunny",
  WARM_SUNNY: "warm_sunny",
  // ... 같은 내용 반복
};
```

**문제점:**

- 같은 정보가 두 곳에 존재
- 상수 추가 시 type도 수동으로 업데이트해야 함
- 불일치 위험 (버그 원인)

---

### 패턴 2: Enum 사용

```typescript
// ❌ 피하기
export enum WeatherCondition {
  HOT_SUNNY = "hot_sunny",
  WARM_SUNNY = "warm_sunny",
  COOL_SUNNY = "cool_sunny",
  CLOUDY = "cloudy",
  RAINY = "rainy",
}
```

**문제점:**

- Runtime에 객체가 생성됨 (번들 사이즈 증가)
- Tree-shaking 불가능
- 타입 + 값 동시 관리는 편하지만 오버킬

---

### 패턴 3: 문자열 리터럴 직접 사용

```typescript
// ❌ 피하기
const ACTIVITIES: Activity[] = [
  {
    id: "swimming",
    condition: "hot_sunny", // 타입 안전 없음
  },
  {
    id: "picnic",
    condition: "warm_sunny", // 오타 위험
  },
];

// 사용처
if (condition === "hot_sunny") {
  // 오타 감지 불가
  // ...
}
```

**문제점:**

- 타입 검사 없음
- 오타 감지 불가 (런타임 버그)
- IDE 자동완성 없음
- 리팩토링 어려움

---

## 체크리스트

새로운 상수-타입 쌍을 만들 때:

- [ ] 상수를 `constants/` 에 `as const` 로 정의했나?
- [ ] 타입을 값에서 유도했나? (`typeof ... [keyof ...]`)
- [ ] types/에서 re-export 했나?
- [ ] 문자열 리터럴을 직접 사용하는 곳이 있나?
- [ ] 레거시 코드에서 상수로 마이그레이션했나?
