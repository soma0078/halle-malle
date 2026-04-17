export interface HangangItem {
  YMD: string;
  HR: string;
  MSRSTN_NM: string;
  WATT: string;
}

export interface HangangResponse {
  WPOSInformationTime: {
    list_total_count: number;
    RESULT: { CODE: string; MESSAGE: string };
    row: HangangItem[];
  };
}
