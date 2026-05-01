"use client";

import { ArrowRight, BellRing, MapPin, MoonStar, Sunrise } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Countdown } from "@/components/countdown";
import { calculateOptimalBedTimes } from "@/lib/sleep";
import type { PrayerTimesResponse, Prayers, SleepTimes } from "@/lib/types";

const initialSleepTimes: SleepTimes = {
  oneCycle: "",
  twoCycles: "",
  threeCycles: "",
  fourCycles: "",
  fiveCycles: "",
  sixCycles: "",
};

function isPrayerTimesResponse(
  payload: PrayerTimesResponse | { error?: string },
): payload is PrayerTimesResponse {
  return "items" in payload;
}

export function Sleep4FajrApp() {
  const [location, setLocation] = useState("");
  const [submittedLocation, setSubmittedLocation] = useState("");
  const [prayers, setPrayers] = useState<Prayers | null>(null);
  const [sleepTimes, setSleepTimes] = useState<SleepTimes>(initialSleepTimes);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [locationLabel, setLocationLabel] = useState("");

  useEffect(() => {
    if (!prayers?.fajr) {
      setSleepTimes(initialSleepTimes);
      return;
    }

    setSleepTimes(calculateOptimalBedTimes(prayers.fajr));
  }, [prayers]);

  const handleApply = async () => {
    const normalizedLocation = location.trim();

    if (!normalizedLocation) {
      setErrorMessage("Enter a city or place name first.");
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage("");

      const response = await fetch(
        `/api/prayer-times?location=${encodeURIComponent(normalizedLocation)}`,
        { headers: { Accept: "application/json" } },
      );

      const payload = (await response.json()) as PrayerTimesResponse | { error?: string };

      if (!response.ok || !isPrayerTimesResponse(payload)) {
        throw new Error(
          !isPrayerTimesResponse(payload)
            ? payload.error || "Failed to fetch prayer times."
            : "Failed to fetch prayer times.",
        );
      }

      const prayerData = payload.items?.[0];

      if (!prayerData) {
        throw new Error("Prayer time data is missing from the response.");
      }

      setSubmittedLocation(normalizedLocation);
      setLocationLabel(payload.location_label || normalizedLocation);
      setPrayers(prayerData);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to fetch prayer times.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      void handleApply();
    }
  };

  const prayerEntries = prayers
    ? [
        ["Fajr", prayers.fajr],
        ["Shurooq", prayers.shurooq],
        ["Dhuhr", prayers.dhuhr],
        ["Asr", prayers.asr],
        ["Maghrib", prayers.maghrib],
        ["Isha", prayers.isha],
      ]
    : [];
  const showApiEndpoints = process.env.NODE_ENV === "development";

  return (
    <main className="min-h-screen px-6 py-10 sm:px-8">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="overflow-hidden rounded-[32px] border border-border bg-card shadow-panel">
          <div className="border-b border-border bg-accent px-8 py-10 text-white">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/12 ring-1 ring-white/15">
                <Image
                  src="/icon192x192.png"
                  alt="Sleep4Fajr logo"
                  width={40}
                  height={40}
                  className="h-10 w-10"
                  priority
                />
              </div>
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-white/72">
                  Sleep4Fajr
                </p>
                <p className="text-sm text-white/72">
                  Prayer times and sleep-cycle planning
                </p>
              </div>
            </div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-sm">
              <MoonStar className="h-4 w-4" />
              Sleep on time for Fajr
            </div>
            <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
              Bedtime guidance built around your next Fajr prayer.
            </h1>
            <p className="mt-4 max-w-2xl text-base text-white/82 sm:text-lg">
              Use the same prayer-time API for the website and extension, then
              plan your sleep around complete 90-minute cycles.
            </p>
          </div>

          <div className="p-8">
            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="sr-only" htmlFor="location">
                Location
              </label>
              <div className="relative flex-1">
                <MapPin className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
                <input
                  id="location"
                  type="text"
                  placeholder="Enter a city like Montreal or Algiers"
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  onKeyDown={handleKeyDown}
                  className="h-14 w-full rounded-2xl border border-border bg-white pl-12 pr-4 text-base outline-none transition focus:border-accent"
                />
              </div>
              <button
                type="button"
                onClick={() => void handleApply()}
                disabled={isLoading}
                className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-accent px-6 font-medium text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoading ? "Loading..." : "Apply"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {errorMessage ? (
              <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {errorMessage}
              </p>
            ) : null}

            {prayers ? (
              <div className="mt-8 space-y-8">
                <div className="rounded-[28px] bg-background p-8">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted">
                    <Sunrise className="h-4 w-4 text-sunrise" />
                    {locationLabel || submittedLocation}
                  </div>
                  <p className="mt-3 text-sm text-muted">
                    Time until Fajr prayer ({prayers.fajr})
                  </p>
                  <div className="mt-4">
                    <Countdown fajrTime={prayers.fajr} />
                  </div>
                </div>

                <div>
                  <div className="mb-4 flex items-end justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-semibold">Optimal bedtimes</h2>
                      <p className="mt-1 text-sm text-muted">
                        Calculated from 90-minute sleep cycles and a 15-minute
                        fall-asleep buffer.
                      </p>
                    </div>
                    <p className="text-sm text-muted">Best range: 5-6 cycles</p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {Object.entries(sleepTimes)
                      .reverse()
                      .map(([key, value]) => {
                        const recommended =
                          key === "fiveCycles" || key === "sixCycles";

                        return (
                          <div
                            key={key}
                            className={`rounded-3xl border p-5 ${
                              recommended
                                ? "border-accent bg-accentSoft"
                                : "border-border bg-white"
                            }`}
                          >
                            <p className="text-sm text-muted">
                              {key.replace("Cycles", " cycles").replace("one", "1").replace("two", "2").replace("three", "3").replace("four", "4").replace("five", "5").replace("six", "6")}
                            </p>
                            <p className="mt-2 text-2xl font-semibold">{value}</p>
                            <p className="mt-3 text-xs uppercase tracking-[0.18em] text-muted">
                              {recommended ? "Suggested" : "Optional"}
                            </p>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-8 rounded-[28px] border border-dashed border-border bg-background px-6 py-10 text-center text-muted">
                Search for a location to load prayer times and bedtime guidance.
              </div>
            )}
          </div>
        </section>

        <aside className="space-y-6">
          <section className="rounded-[32px] border border-border bg-card p-6 shadow-panel">
            <h2 className="text-lg font-semibold">Prayer times</h2>
            <p className="mt-1 text-sm text-muted">
              Daily timings come from the same API endpoint the browser extension
              can call.
            </p>
            <div className="mt-5 space-y-3">
              {prayerEntries.length ? (
                prayerEntries.map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between rounded-2xl border border-border bg-background px-4 py-3"
                  >
                    <span className="text-sm text-muted">{label}</span>
                    <span className="font-semibold">{value}</span>
                  </div>
                ))
              ) : (
                <p className="rounded-2xl bg-background px-4 py-5 text-sm text-muted">
                  Prayer times will appear here after a successful search.
                </p>
              )}
            </div>
          </section>

          <section className="rounded-[32px] border border-border bg-accent p-6 text-white shadow-panel">
            <div className="flex items-center gap-2 text-sm font-medium text-white/80">
              <BellRing className="h-4 w-4" />
              Firefox extension
            </div>
            <h2 className="mt-3 text-xl font-semibold">
              Also get the Firefox extension for bedtime reminders.
            </h2>
            <p className="mt-2 text-sm text-white/82">
              Use the extension if you want Sleep4Fajr notifications directly in
              your browser before the best time to sleep for Fajr.
            </p>
            <a
              href="https://addons.mozilla.org/en-US/firefox/addon/sleep4fajr/?utm_source=addons.mozilla.org&utm_medium=referral&utm_content=search"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-medium text-accent transition hover:opacity-95"
            >
              Get the Firefox extension
              <ArrowRight className="h-4 w-4" />
            </a>
          </section>

          {showApiEndpoints ? (
            <section className="rounded-[32px] border border-border bg-card p-6 shadow-panel">
              <h2 className="text-lg font-semibold">API endpoints</h2>
              <div className="mt-4 space-y-3 text-sm text-muted">
                <p>
                  <span className="font-medium text-foreground">Health:</span>{" "}
                  <code>/api/health</code>
                </p>
                <p>
                  <span className="font-medium text-foreground">Prayer times:</span>{" "}
                  <code>/api/prayer-times?location=Algiers</code>
                </p>
                <p>
                  Extension base URL should point at this deployed site domain.
                </p>
              </div>
            </section>
          ) : null}
        </aside>
      </div>
    </main>
  );
}
