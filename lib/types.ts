export type Prayers = {
  date_for: string;
  fajr: string;
  shurooq: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
};

export type PrayerTimesResponse = {
  status_valid: number;
  status_description: string;
  items: Prayers[];
  country: string;
  country_code: string;
  location_label?: string;
};

export type SleepTimeKey =
  | "oneCycle"
  | "twoCycles"
  | "threeCycles"
  | "fourCycles"
  | "fiveCycles"
  | "sixCycles";

export type SleepTimes = Record<SleepTimeKey, string>;
