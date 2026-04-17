# Conventions

## 네이밍

| HTTP        | 훅 (`hooks/`) | API 함수 (`services/`) |
| ----------- | ------------- | ---------------------- |
| GET         | `useGet**`    | `get**`                |
| POST        | `useCreate**` | `create**`             |
| PUT / PATCH | `useUpdate**` | `update**`             |
| DELETE      | `useDelete**` | `delete**`             |

예: `useGetWeather` → `getWeather`, `useCreateTodo` → `createTodo`

```ts
// GET
export function useGetWeather({ lat, lon }: Params) {
  return useQuery({
    queryKey: ['weather', lat, lon],
    queryFn: () => getWeather(lat, lon),
    staleTime: ...,
  });
}

// POST
export function useCreateTodo() {
  return useMutation({
    mutationFn: (body: CreateTodoBody) => createTodo(body),
  });
}

// PUT / PATCH
export function useUpdateTodo() {
  return useMutation({
    mutationFn: ({ id, body }: UpdateTodoParams) => updateTodo(id, body),
  });
}

// DELETE
export function useDeleteTodo() {
  return useMutation({
    mutationFn: (id: string) => deleteTodo(id),
  });
}
```

## 임포트

- 경로는 반드시 `@/*` alias 사용. 상대경로(`../`) 사용 금지
- 예: `import { useWeather } from '@/hooks/useWeather'`

## 환경 변수

- `.env`에 `EXPO_PUBLIC_*` 형식으로 저장
- 예: `EXPO_PUBLIC_WEATHER_API_KEY`

## TanStack Query

- `queryKey`는 `constants/queryKeys.ts`의 `QUERY_KEYS` 상수에서 관리
  ```ts
  // constants/queryKeys.ts
  export const QUERY_KEYS = {
    weather: ({ lat, lon }: Params) => ["weather", lat, lon] as const,
    hangang: () => ["hangang"] as const,
  } as const;
  ```
- 훅에서는 직접 배열 대신 상수 사용
  ```ts
  queryKey: QUERY_KEYS.weather(latitude, longitude);
  ```
- `staleTime`은 API 특성에 맞게 명시적으로 설정

## 상수 정의

- `as const` + 타입 자동 유도 패턴 사용
  ```ts
  export const FOO = { A: "a", B: "b" } as const;
  export type Foo = (typeof FOO)[keyof typeof FOO];
  ```
- 자세한 패턴과 안티패턴 → [`patterns/constants_and_types.md`](patterns/constants_and_types.md)

## 타입

- 함수 파라미터는 inline 타입 작성 금지. `types/`에 interface로 분리

  ```ts
  // ❌
  export async function getWeather(lat: number, lon: number) {}

  // ✅
  export async function getWeather({ lat, lon }: WeatherParams) {}
  ```

- API 응답 raw 타입과 앱에서 쓰는 도메인 타입을 분리
  - raw: `KmaResponse`, `KmaForecastItem`
  - 도메인: `WeatherData`
- re-export는 타입 파일에서 처리
  ```ts
  import type { WeatherCondition } from "@/constants/weatherCondition";
  export type { WeatherCondition };
  ```
