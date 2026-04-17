import { WeatherCondition } from "./weather";

export interface ActivityPlace {
  name: string;
  address: string;
  distance?: number; // 사용자로부터 몇 m (nearby일 때만)
  source: "static" | "nearby";
}

export interface Activity {
  id: string;
  name: string;
  emoji: string;
  suitability: number; // 1~5
  duration: string;
  checklist: string[];
  condition: WeatherCondition;
  place?: ActivityPlace;
}
