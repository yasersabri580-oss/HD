"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "../lib/l10n";

type AnimatedCounterProps = {
  value: number;
  suffix?: string;
  locale: Locale;
};

const localeMap: Record<Locale, string> = {
  fa: "fa-IR",
  ps: "fa-AF",
  en: "en-US",
};

export function AnimatedCounter({
  value,
  suffix = "",
  locale,
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const element = ref.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        const duration = 1200;
        const startedAt = performance.now();

        const tick = (time: number) => {
          const progress = Math.min((time - startedAt) / duration, 1);

          setCount(Math.round(value * progress));

          if (progress < 1) {
            requestAnimationFrame(tick);
          }
        };

        requestAnimationFrame(tick);
        observer.disconnect();
      },
      { threshold: 0.5 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [value]);

  return (
    <span ref={ref}>
      {count.toLocaleString(localeMap[locale])}
      {suffix}
    </span>
  );
}