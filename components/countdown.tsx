"use client";

import { useEffect, useState } from "react";
import { getCountdownLabel } from "@/lib/sleep";

export function Countdown({ fajrTime }: { fajrTime: string }) {
  const [counter, setCounter] = useState("");

  useEffect(() => {
    const updateCounter = () => {
      setCounter(getCountdownLabel(fajrTime));
    };

    updateCounter();
    const timer = window.setInterval(updateCounter, 1000);
    return () => window.clearInterval(timer);
  }, [fajrTime]);

  return (
    <p className="text-5xl font-semibold tracking-tight text-foreground">
      {counter}
    </p>
  );
}
