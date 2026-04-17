import { kakaoApi } from "@/lib/api";
import { Coords } from "@/types/coords";
import {
  KakaoPlace,
  KakaoSearchParams,
  KakaoSearchResponse,
} from "@/types/kakaoLocal";

export interface GetNearbyPlacesOptions {
  radius?: number; // 기본값 20000m (20km)
  size?: number; // 기본값 15
  sort?: "accuracy" | "distance"; // 기본값 accuracy
}

/**
 * 카카오 로컬 검색 API를 통해 키워드 기반으로 근처 장소 검색
 * @param query - 검색 키워드 (예: "한강 수영장", "카페")
 * @param coords - 사용자 좌표
 * @param options - 검색 옵션 (반경, 결과 개수, 정렬)
 * @returns 검색된 장소 배열
 */
export async function getNearbyPlaces(
  query: string,
  { lat, lon }: Coords,
  options?: GetNearbyPlacesOptions,
): Promise<KakaoPlace[]> {
  const params: KakaoSearchParams = {
    query,
    y: lat.toString(),
    x: lon.toString(),
    radius: options?.radius,
    size: options?.size,
    sort: options?.sort ?? "distance",
  };

  const data = (await kakaoApi
    .get("", { searchParams: params })
    .json()) as KakaoSearchResponse;
  return data.documents;
}

/**
 * 검색 결과 중 첫 번째 장소를 반환
 */
export async function getNearbyPlace(
  query: string,
  coords: Coords,
  options?: GetNearbyPlacesOptions,
): Promise<KakaoPlace | null> {
  const places = await getNearbyPlaces(query, coords, options);
  return places.length > 0 ? places[0] : null;
}
