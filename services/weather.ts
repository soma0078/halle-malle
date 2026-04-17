import { format, subDays, subMinutes } from "date-fns";
import { KmaGridConverter } from "kma-grid";
import { weatherApi } from "@/lib/api";
import { Coords } from "@/types/coords";
import {
  KmaForecastItem,
  KmaResponse,
  WeatherResponse,
} from "@/types/weather";

// 동네예보 발표 시각 (정시 기준, 10분 후 제공)

const BASE_TIMES = [
  "2300",
  "2000",
  "1700",
  "1400",
  "1100",
  "0800",
  "0500",
  "0200",
];

const gridConverter = new KmaGridConverter();

function getBaseDateTime(): { baseDate: string; baseTime: string } {
  const now = subMinutes(new Date(), 10);
  const currentHHMM = now.getHours() * 100 + now.getMinutes();

  let selectedTime = "2300";
  let date = now;

  for (const t of BASE_TIMES) {
    if (currentHHMM >= parseInt(t, 10)) {
      selectedTime = t;
      break;
    }
  }

  if (currentHHMM < 200) {
    date = subDays(now, 1);
    selectedTime = "2300";
  }

  return { baseDate: format(date, "yyyyMMdd"), baseTime: selectedTime };
}

function calcFeelsLike(
  temp: number,
  windSpeed: number,
  humidity: number,
): number {
  if (temp >= 10) {
    // 더위체감지수 (Heat Index 근사)
    const hi =
      -8.78469475556 +
      1.61139411 * temp +
      2.3385248916 * humidity -
      0.14611605 * temp * humidity -
      0.01230809 * temp ** 2 -
      0.01642482 * humidity ** 2 +
      0.00221173 * temp ** 2 * humidity +
      0.00072546 * temp * humidity ** 2 -
      0.00000358 * temp ** 2 * humidity ** 2;
    return Math.round(hi * 10) / 10;
  } else {
    // 체감온도 (Wind Chill)
    const v = windSpeed * 3.6; // m/s → km/h
    const wc =
      13.12 + 0.6215 * temp - 11.37 * v ** 0.16 + 0.3965 * v ** 0.16 * temp;
    return Math.round(wc * 10) / 10;
  }
}

function parseItems(items: KmaForecastItem[]): WeatherResponse {
  const now = new Date();
  const todayStr = format(now, "yyyyMMdd");

  // 현재 시각과 가장 가까운 예보 시각 필터
  const currentHHMM = now.getHours() * 100 + now.getMinutes();
  const todayItems = items.filter((i) => i.fcstDate === todayStr);

  // 가장 가까운 fcstTime 찾기
  const fcstTimes = [...new Set(todayItems.map((i) => i.fcstTime))].sort();
  let targetTime = fcstTimes[0];
  for (const t of fcstTimes) {
    if (parseInt(t, 10) <= currentHHMM) targetTime = t;
  }

  const get = (category: string) => {
    const found = todayItems.find(
      (i) => i.category === category && i.fcstTime === targetTime,
    );
    return found ? parseFloat(found.fcstValue) : 0;
  };

  const temp = get("TMP");
  const sky = get("SKY") || 1;
  const pty = get("PTY");
  const humidity = get("REH");
  const windSpeed = get("WSD");
  const feelsLike = calcFeelsLike(temp, windSpeed, humidity);

  return { temp, feelsLike, humidity, windSpeed, sky, pty };
}

export async function getWeather({
  lat,
  lon,
}: Coords): Promise<WeatherResponse> {
  const { x: nx, y: ny } = gridConverter.toGrid(lat, lon);
  const { baseDate, baseTime } = getBaseDateTime();

  const data = await weatherApi
    .get("getVilageFcst", {
      searchParams: {
        serviceKey: process.env.EXPO_PUBLIC_WEATHER_API_KEY!,
        dataType: "JSON",
        numOfRows: "60",
        base_date: baseDate,
        base_time: baseTime,
        nx,
        ny,
      },
    })
    .json<KmaResponse>();

  const items = data.response.body.items.item;
  return parseItems(items);
}
