import { Coords } from "@/types/coords";

export const QUERY_KEYS = {
  weather: ({ lat, lon }: Coords) => ["weather", lat, lon] as const,
  hangang: ({ lat, lon }: Coords) => ["hangang", lat, lon] as const,
} as const;
