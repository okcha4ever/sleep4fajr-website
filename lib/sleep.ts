import type { SleepTimes } from "@/lib/types";

function parseTimeStringToDate(timeString: string, baseDate = new Date()) {
  const [time, modifier] = timeString.split(" ");
  let [hours, minutes] = time.split(":");

  if (modifier === "pm" && hours !== "12") {
    hours = String(Number(hours) + 12);
  } else if (modifier === "am" && hours === "12") {
    hours = "00";
  }

  const parsedDate = new Date(baseDate);
  parsedDate.setHours(Number(hours), Number(minutes), 0, 0);

  return parsedDate;
}

export function calculateOptimalBedTimes(fajrTimeString: string): SleepTimes {
  const now = new Date();
  const fajrTime = parseTimeStringToDate(fajrTimeString, now);

  if (now > fajrTime) {
    fajrTime.setDate(fajrTime.getDate() + 1);
  }

  const calculateBedTime = (cycles: number) => {
    const totalSleepTime = cycles * 90 + 15;
    return new Date(
      fajrTime.getTime() - totalSleepTime * 60_000,
    ).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return {
    oneCycle: calculateBedTime(1),
    twoCycles: calculateBedTime(2),
    threeCycles: calculateBedTime(3),
    fourCycles: calculateBedTime(4),
    fiveCycles: calculateBedTime(5),
    sixCycles: calculateBedTime(6),
  };
}

export function getCountdownLabel(fajrTime: string, now = new Date()) {
  const [time, modifier] = fajrTime.split(" ");
  let [hours, minutes] = time.split(":").map((value) => Number(value));

  if (modifier === "pm" && hours < 12) {
    hours += 12;
  } else if (modifier === "am" && hours === 12) {
    hours = 0;
  }

  const fajrDate = new Date(now);
  fajrDate.setHours(hours, minutes, 0, 0);

  if (now > fajrDate) {
    fajrDate.setDate(fajrDate.getDate() + 1);
  }

  const diff = fajrDate.getTime() - now.getTime();
  const hoursRemaining = Math.floor(diff / (1000 * 60 * 60));
  const minutesRemaining = Math.floor(
    (diff % (1000 * 60 * 60)) / (1000 * 60),
  );
  const secondsRemaining = Math.floor((diff % (1000 * 60)) / 1000);

  return `${String(hoursRemaining).padStart(2, "0")}:${String(minutesRemaining).padStart(2, "0")}:${String(secondsRemaining).padStart(2, "0")}`;
}
