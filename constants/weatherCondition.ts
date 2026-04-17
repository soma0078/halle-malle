import { WeatherCondition, WeatherResponse } from "@/types/weather";

// 날씨 조건별 활동을 구성하기 위한 상수
export const WEATHER_CONDITIONS = {
  HOT_SUNNY: "hot_sunny",
  WARM_SUNNY: "warm_sunny",
  COOL_SUNNY: "cool_sunny",
  CLOUDY: "cloudy",
  RAINY: "rainy",
} as const;

export function getWeatherCondition(
  weather: WeatherResponse,
): WeatherCondition {
  const { sky, pty, temp } = weather;
  if (pty !== 0) return WEATHER_CONDITIONS.RAINY;
  if (sky === 3 || sky === 4) return WEATHER_CONDITIONS.CLOUDY;
  if (temp >= 28) return WEATHER_CONDITIONS.HOT_SUNNY;
  if (temp >= 20) return WEATHER_CONDITIONS.WARM_SUNNY;
  return WEATHER_CONDITIONS.COOL_SUNNY;
}

export function getMoodMessage(condition: WeatherCondition): string {
  const map: Record<WeatherCondition, string> = {
    [WEATHER_CONDITIONS.HOT_SUNNY]: "밖이 뜨거워요! 시원한 활동 어때요?",
    [WEATHER_CONDITIONS.WARM_SUNNY]: "나들이 딱 좋은 날씨예요!",
    [WEATHER_CONDITIONS.COOL_SUNNY]: "선선해요. 가볍게 산책해 볼까요?",
    [WEATHER_CONDITIONS.CLOUDY]: "흐린 날엔 실내가 최고죠.",
    [WEATHER_CONDITIONS.RAINY]: "비가 와요. 집에서 할 수 있는 활동 어때요?",
  };
  return map[condition];
}

export function getWeatherLabel(sky: number, pty: number): string {
  if (pty === 1 || pty === 4) return "비";
  if (pty === 2) return "비/눈";
  if (pty === 3) return "눈";
  if (sky === 1) return "맑음";
  if (sky === 3) return "구름많음";
  return "흐림";
}

// 날씨 조건별 배경 그라데이션 색상
export const GRADIENT_COLORS: Record<WeatherCondition, [string, string]> = {
  [WEATHER_CONDITIONS.HOT_SUNNY]: ["#FF6B35", "#FF8E53"],
  [WEATHER_CONDITIONS.WARM_SUNNY]: ["#2196F3", "#64B5F6"],
  [WEATHER_CONDITIONS.COOL_SUNNY]: ["#1565C0", "#42A5F5"],
  [WEATHER_CONDITIONS.CLOUDY]: ["#546E7A", "#90A4AE"],
  [WEATHER_CONDITIONS.RAINY]: ["#263238", "#455A64"],
};

export function getWindDescription(windSpeed: number): string {
  if (windSpeed < 1) return "고요";
  if (windSpeed < 3) return "실바람";
  if (windSpeed < 5) return "산들바람";
  if (windSpeed < 8) return "건들바람";
  if (windSpeed < 11) return "흔들바람";
  return "강풍";
}

export function getWeatherErrorMessage(error: unknown): string {
  if (error instanceof TypeError) return "네트워크 연결을 확인해 주세요";
  if (error instanceof Error && error.name === "TimeoutError")
    return "요청 시간이 초과됐어요";
  return "날씨 정보를 불러오지 못했어요";
}

// 날씨 조건별 아이콘 (Ionicons)
export const WEATHER_ICON: Record<WeatherCondition, string> = {
  [WEATHER_CONDITIONS.HOT_SUNNY]: "sunny",
  [WEATHER_CONDITIONS.WARM_SUNNY]: "partly-sunny",
  [WEATHER_CONDITIONS.COOL_SUNNY]: "partly-sunny",
  [WEATHER_CONDITIONS.CLOUDY]: "cloudy",
  [WEATHER_CONDITIONS.RAINY]: "rainy",
};
