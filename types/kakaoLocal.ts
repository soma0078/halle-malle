// 카카오 로컬 검색 API 요청/응답 타입

import { SearchParams } from "./api";

export interface KakaoSearchParams extends SearchParams {
  query: string;
  x?: string; // 경도 (longitude)
  y?: string; // 위도 (latitude)
  radius?: number; // 반경 (미터), 기본값 20000
  rect?: string; // 사각형 좌표 (x1,y1,x2,y2)
  page?: number;
  size?: number;
  sort?: "accuracy" | "distance";
}

export interface KakaoPlace {
  id?: string;
  place_name: string;
  category_name: string;
  category_group_code: string;
  category_group_name: string;
  phone: string;
  address_name: string;
  road_address_name: string;
  x: string;
  y: string;
  place_url: string;
  distance?: string;
}

export interface KakaoMeta {
  total_count: number;
  pageable_count: number;
  is_end: boolean;
  same_name?: {
    region: string[];
    keyword: string;
    selected_region: string;
  };
}

export interface KakaoSearchResponse {
  meta: KakaoMeta;
  documents: KakaoPlace[];
}
