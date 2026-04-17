import { Coords } from "@/types/coords";

export const QUERY_KEYS = {
  weather: ({ lat, lon }: Coords) => ["weather", lat, lon] as const,
  hangang: ({ lat, lon }: Coords) => ["hangang", lat, lon] as const,
  nearbyPlaces: (query: string, { lat, lon }: Coords) =>
    [
      "nearbyPlaces",
      query,
      Math.round(lat * 100) / 100,
      Math.round(lon * 100) / 100,
    ] as const,
} as const;
