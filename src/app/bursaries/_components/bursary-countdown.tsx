"use client";

import { useEffect, useState } from "react";

type CountdownParts = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function getCountdownParts(targetTime: number): CountdownParts {
  const remaining = Math.max(targetTime - Date.now(), 0);

  return {
    days: Math.floor(remaining / (1000 * 60 * 60 * 24)),
    hours: Math.floor((remaining / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((remaining / (1000 * 60)) % 60),
    seconds: Math.floor((remaining / 1000) % 60),
  };
}

export function BursaryCountdown({ targetDate }: { targetDate: string }) {
  const targetTime = new Date(targetDate).getTime();
  const [timeLeft, setTimeLeft] = useState<CountdownParts>(() => getCountdownParts(targetTime));

  useEffect(() => {
    setTimeLeft(getCountdownParts(targetTime));

    const interval = window.setInterval(() => {
      setTimeLeft(getCountdownParts(targetTime));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [targetTime]);

  const tiles = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (
    <div className="rounded-3xl border border-white/15 bg-white/10 p-5 shadow-xl backdrop-blur md:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-md-gold/90">
            Next bursary distribution
          </p>
          <p className="mt-1 text-sm text-white/80">Live countdown to the nearest upcoming date</p>
        </div>
        <div className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-white/80">
          {new Date(targetDate).toLocaleDateString()}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {tiles.map((tile) => (
          <div
            key={tile.label}
            className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/15 to-white/5 px-3 py-4 text-center"
          >
            <div className="text-3xl font-black tracking-tight text-white md:text-4xl">
              {String(tile.value).padStart(2, "0")}
            </div>
            <div className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
              {tile.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
