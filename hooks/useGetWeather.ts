import { useQuery } from "@tanstack/react-query";
import { getWeather } from "@/services/weather";
import { QUERY_KEYS } from "@/constants/queryKeys";

// 서울 시청 기본 좌표 (위치 권한 거부 시 fallback)
const DEFAULT_LAT = 37.5665;
const DEFAULT_LON = 126.978;

interface UseGetWeatherParams {
  lat?: number;
  lon?: number;
}

export function useGetWeather({ lat, lon }: UseGetWeatherParams) {
  const latitude = lat ?? DEFAULT_LAT;
  const longitude = lon ?? DEFAULT_LON;
  const usingDefault = latitude === DEFAULT_LAT && longitude === DEFAULT_LON;

  const query = useQuery({
    queryKey: QUERY_KEYS.weather({ lat: latitude, lon: longitude }),
    queryFn: () => getWeather({ lat: latitude, lon: longitude }),
    staleTime: 1000 * 60 * 10,
    retry: 0,
  });

  const fallbackQuery = useQuery({
    queryKey: QUERY_KEYS.weather({ lat: DEFAULT_LAT, lon: DEFAULT_LON }),
    queryFn: () => getWeather({ lat: DEFAULT_LAT, lon: DEFAULT_LON }),
    staleTime: 1000 * 60 * 10,
    retry: 0,
    enabled: query.isError && !usingDefault,
  });

  if (query.isError && !usingDefault) {
    return fallbackQuery;
  }

  return query;
}
