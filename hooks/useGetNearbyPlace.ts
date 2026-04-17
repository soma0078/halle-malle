import { useQuery } from "@tanstack/react-query";
import { getNearbyPlaces, GetNearbyPlacesOptions } from "@/services/places";
import { Coords } from "@/types/coords";
import { QUERY_KEYS } from "@/constants/queryKeys";

interface UseGetNearbyPlacesParams {
  query: string;
  coords: Coords;
  options?: GetNearbyPlacesOptions;
}

export function useGetNearbyPlaces({ query, coords, options }: UseGetNearbyPlacesParams) {
  return useQuery({
    queryKey: QUERY_KEYS.nearbyPlaces(query, coords),
    queryFn: () => getNearbyPlaces(query, coords, options),
    staleTime: 1000 * 60 * 10,
    retry: 1,
  });
}
