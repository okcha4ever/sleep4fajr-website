import type { PrayerTimesResponse } from "@/lib/types";

type GeocodeResult = {
  lat: string;
  lon: string;
  label: string;
  country: string;
  countryCode: string;
};

type IslamicApiDayResponse = {
  status?: string;
  message?: string;
  data?: {
    times?: Record<string, string>;
    date?: {
      gregorian?: {
        date?: string;
      };
    };
  };
};

function to12HourTime(value: string) {
  const trimmedValue = value.trim();
  const timeMatch = trimmedValue.match(/^(\d{1,2}):(\d{2})/);

  if (!timeMatch) {
    return trimmedValue.toLowerCase();
  }

  let hours = Number(timeMatch[1]);
  const minutes = timeMatch[2];
  const suffix = hours >= 12 ? "pm" : "am";

  if (hours === 0) {
    hours = 12;
  } else if (hours > 12) {
    hours -= 12;
  }

  return `${hours}:${minutes} ${suffix}`;
}

function normalizeTimes(times: Record<string, string> | undefined) {
  if (!times) {
    throw new Error("Prayer time API returned no times.");
  }

  const fajr = times.Fajr ?? times.fajr;
  const sunrise = times.Sunrise ?? times.sunrise ?? times.Shurooq;
  const dhuhr = times.Dhuhr ?? times.dhuhr;
  const asr = times.Asr ?? times.asr;
  const maghrib = times.Maghrib ?? times.maghrib;
  const isha = times.Isha ?? times.isha;

  if (!fajr || !sunrise || !dhuhr || !asr || !maghrib || !isha) {
    throw new Error("Prayer time API returned incomplete times.");
  }

  return {
    fajr: to12HourTime(String(fajr)),
    shurooq: to12HourTime(String(sunrise)),
    dhuhr: to12HourTime(String(dhuhr)),
    asr: to12HourTime(String(asr)),
    maghrib: to12HourTime(String(maghrib)),
    isha: to12HourTime(String(isha)),
  };
}

async function geocodeLocation(location: string): Promise<GeocodeResult> {
  const geocode = async (query: string): Promise<GeocodeResult | null> => {
    const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
    url.searchParams.set("name", query);
    url.searchParams.set("count", "1");
    url.searchParams.set("language", "en");
    url.searchParams.set("format", "json");

    const response = await fetch(url.toString(), {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Geocoding failed with status ${response.status}`);
    }

    const payload = (await response.json()) as {
      results?: Array<{
        latitude: number;
        longitude: number;
        name: string;
        country?: string;
        country_code?: string;
        admin1?: string;
      }>;
    };

    const match = payload.results?.[0];

    if (!match) {
      return null;
    }

    return {
      lat: String(match.latitude),
      lon: String(match.longitude),
      label: [match.name, match.admin1, match.country].filter(Boolean).join(", "),
      country: match.country ?? query,
      countryCode: match.country_code?.toUpperCase() ?? "",
    };
  };

  const segments = location
    .split(",")
    .map((segment) => segment.trim())
    .filter(Boolean);
  const attempts = [
    location.trim(),
    segments.join(", "),
    [...segments].reverse().join(", "),
    segments.at(-1),
    segments[0],
  ].filter(
    (value, index, array): value is string =>
      Boolean(value) && array.indexOf(value) === index,
  );

  for (const attempt of attempts) {
    const result = await geocode(attempt);
    if (result) {
      return result;
    }
  }

  throw new Error(`No coordinates found for "${location}".`);
}

export async function fetchPrayerTimes(
  location: string,
  date?: string,
): Promise<PrayerTimesResponse> {
  const apiKey = process.env.ISLAMIC_API_KEY || process.env.API_KEY;

  if (!apiKey) {
    throw new Error("Missing ISLAMIC_API_KEY on the server.");
  }

  const geocodedLocation = await geocodeLocation(location);
  const prayerUrl = new URL("https://islamicapi.com/api/v1/prayer-time/");
  prayerUrl.searchParams.set("lat", geocodedLocation.lat);
  prayerUrl.searchParams.set("lon", geocodedLocation.lon);
  prayerUrl.searchParams.set("method", "3");
  prayerUrl.searchParams.set("school", "19");
  prayerUrl.searchParams.set("api_key", apiKey);

  if (date) {
    prayerUrl.searchParams.set("date", date);
  }

  const response = await fetch(prayerUrl.toString(), {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  const payload = (await response.json()) as IslamicApiDayResponse;

  if (!response.ok || payload.status === "error") {
    throw new Error(
      payload.message || `Prayer time API failed with status ${response.status}`,
    );
  }

  return {
    status_valid: 1,
    status_description: "Prayer times fetched successfully",
    items: [
      {
        date_for:
          payload.data?.date?.gregorian?.date ??
          new Date().toISOString().slice(0, 10),
        ...normalizeTimes(payload.data?.times),
      },
    ],
    country: geocodedLocation.country,
    country_code: geocodedLocation.countryCode,
    location_label: geocodedLocation.label,
  };
}
