import { useQuery } from "@tanstack/react-query";
import { getHangangTemp } from "@/services/hangang";
import { QUERY_KEYS } from "@/constants/queryKeys";

// 서울 한강대교 기본 좌표 (위치 권한 거부 시 fallback)
const DEFAULT_LAT = 37.5166;
const DEFAULT_LON = 126.9728;

interface UseGetHangangTempParams {
  lat?: number;
  lon?: number;
}

export function useGetHangangTemp({ lat, lon }: UseGetHangangTempParams = {}) {
  const latitude = lat ?? DEFAULT_LAT;
  const longitude = lon ?? DEFAULT_LON;

  return useQuery({
    queryKey: QUERY_KEYS.hangang({ lat: latitude, lon: longitude }),
    queryFn: () => getHangangTemp({ lat: latitude, lon: longitude }),
    staleTime: 1000 * 60 * 30,
    retry: 0,
  });
}
