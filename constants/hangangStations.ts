export interface HangangStation {
  name: string;
  lat: number;
  lon: number;
}

// 서울 열린데이터광장 WPOSInformationTime API 측정소 좌표
export const HANGANG_STATIONS: HangangStation[] = [
  { name: "노량진", lat: 37.5172, lon: 126.9399 },
  { name: "한강대교", lat: 37.5166, lon: 126.9728 },
  { name: "잠수교", lat: 37.512, lon: 127.005 },
  { name: "성수대교", lat: 37.5358, lon: 127.0539 },
  { name: "뚝섬", lat: 37.5323, lon: 127.0672 },
];

function toRad(deg: number) {
  return (deg * Math.PI) / 180;
}

// 두 지점 간의 거리 계산 (단위: km)
export function getDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// 주어진 좌표에서 가장 가까운 한강 측정소 찾기
export function getNearestStation(lat: number, lon: number): HangangStation {
  return HANGANG_STATIONS.reduce((nearest, station) => {
    const d = getDistanceKm(lat, lon, station.lat, station.lon);
    const dNearest = getDistanceKm(lat, lon, nearest.lat, nearest.lon);
    return d < dNearest ? station : nearest;
  });
}
