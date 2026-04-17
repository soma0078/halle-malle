import { LOCATION_STATUS } from "@/constants/status";
import { LocationStatus } from "@/types/status";
import * as Location from "expo-location";
import { useEffect, useState } from "react";

interface LocationState {
  coords: { latitude: number; longitude: number } | null;
  locationName: string | null;
  status: LocationStatus;
}

export function useLocation(): LocationState {
  const [state, setState] = useState<LocationState>({
    coords: null,
    locationName: null,
    status: LOCATION_STATUS.PENDING,
  });

  useEffect(() => {
    (async () => {
      console.log("[useLocation] 권한 요청 시작");
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        console.log("[useLocation] 권한 결과:", status);
        if (status !== "granted") {
          console.warn("[useLocation] 권한 거부됨 → DENIED");
          setState({
            coords: null,
            locationName: null,
            status: LOCATION_STATUS.DENIED,
          });
          return;
        }

        console.log("[useLocation] 현재 위치 조회 시작");
        const { coords } = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        console.log("[useLocation] coords:", coords.latitude, coords.longitude);

        console.log("[useLocation] 역지오코딩 시작");
        const [place] = await Location.reverseGeocodeAsync({
          latitude: coords.latitude,
          longitude: coords.longitude,
        });
        console.log("[useLocation] place:", JSON.stringify(place));

        const locationName = place?.district ?? place?.city ?? null;
        console.log("[useLocation] locationName:", locationName);

        setState({
          coords: { latitude: coords.latitude, longitude: coords.longitude },
          locationName,
          status: LOCATION_STATUS.GRANTED,
        });
      } catch (err) {
        console.error("[useLocation] 위치 조회 실패:", err);
        setState({
          coords: null,
          locationName: null,
          status: LOCATION_STATUS.ERROR,
        });
      }
    })();
  }, []);

  return state;
}
