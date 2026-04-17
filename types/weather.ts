import { WEATHER_CONDITIONS } from "@/constants/weatherCondition";

export interface KmaForecastItem {
  baseDate: string;
  baseTime: string;
  category: string;
  fcstDate: string;
  fcstTime: string;
  fcstValue: string;
  nx: number;
  ny: number;
}

export interface KmaResponse {
  response: {
    header: { resultCode: string; resultMsg: string };
    body: {
      dataType: string;
      items: { item: KmaForecastItem[] };
      pageNo: number;
      numOfRows: number;
      totalCount: number;
    };
  };
}

export interface WeatherResponse {
  temp: number; // 기온 (°C)
  feelsLike: number; // 체감기온 (°C, 계산값)
  humidity: number; // 습도 (%)
  windSpeed: number; // 풍속 (m/s)
  sky: number; // 1=맑음, 3=구름많음, 4=흐림
  pty: number; // 0=없음, 1=비, 2=비/눈, 3=눈, 4=소나기
}

export type WeatherCondition =
  (typeof WEATHER_CONDITIONS)[keyof typeof WEATHER_CONDITIONS];
