// ky searchParams 옵션과 호환되는 공통 쿼리 파라미터 타입
export type SearchParams = Record<
  string,
  string | number | boolean | undefined
>;
