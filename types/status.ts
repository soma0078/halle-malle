import { LOCATION_STATUS } from "@/constants/status";

export type LocationStatus =
  (typeof LOCATION_STATUS)[keyof typeof LOCATION_STATUS];
