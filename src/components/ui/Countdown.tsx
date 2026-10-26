"use client";

import { useState, useEffect } from "react";

type CountdownProps = {
  targetDate: string;
  onFinished?: () => void;
};

export function Countdown({ targetDate, onFinished }: CountdownProps) {
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    const target = new Date(targetDate).getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        clearInterval(interval);
        setRemaining(0);
        if (onFinished) onFinished();
        return;
      }

      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setRemaining(hours * 3600 + minutes * 60 + seconds);
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  if (!remaining) return null;

  const hours = Math.floor(remaining / 3600);
  const minutes = Math.floor((remaining % 3600) / 60);
  const seconds = remaining % 60;

  return (
    <div className="text-center">
      {hours > 0 && <span className="text-[0.8rem] font-medium">{hours}h </span>}
      {minutes > 0 || hours > 0 && <span className="text-[0.8rem] font-medium">{minutes}m </span>}
      <span className="text-[0.8rem] font-medium">{seconds}s</span>
    </div>
  );
}