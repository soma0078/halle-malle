import { format } from "date-fns";
import { hangangApi } from "@/lib/api";
import { HangangResponse } from "@/types/hangang";
import { getNearestStation } from "@/constants/hangangStations";
import { Coords } from "@/types/coords";

export interface HangangTempResult {
  temp: number;
  stationName: string;
}

export async function getHangangTemp({
  lat,
  lon,
}: Coords): Promise<HangangTempResult> {
  const ymd = format(new Date(), "yyyyMMdd");

  const data = await hangangApi.get(ymd).json<HangangResponse>();

  const rows = data.WPOSInformationTime?.row ?? [];
  if (rows.length === 0) throw new Error("한강 수온 데이터 없음");

  const nearest = getNearestStation(lat, lon);
  const target = rows.find((r) => r.MSRSTN_NM === nearest.name) ?? rows[0];

  const temp = parseFloat(target.WATT);
  if (isNaN(temp)) throw new Error("수온 파싱 실패");
  return { temp, stationName: target.MSRSTN_NM };
}
