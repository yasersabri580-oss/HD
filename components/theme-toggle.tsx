"use client";

import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "../components/icons";

type Theme = "light" | "dark";

function getPreferredTheme(): Theme {
  if (typeof window === "undefined") {
    return "light";
  }

  const stored = window.localStorage.getItem("heart_doctor_theme");
  if (stored === "light" || stored === "dark") {
    return stored;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");
  const [hydrated, setHydrated] = useState(false);
  const isDark = theme === "dark";

  useEffect(() => {
    const preferred = getPreferredTheme();
    setTheme(preferred);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    document.documentElement.classList.toggle("dark", isDark);
    window.localStorage.setItem("heart_doctor_theme", theme);
  }, [hydrated, isDark, theme]);

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
      aria-label={isDark ? "تغییر به حالت روشن" : "تغییر به حالت تیره"}
      title={isDark ? "حالت روشن" : "حالت تیره"}
    >
      <span className="theme-toggle-icon">{isDark ? <SunIcon /> : <MoonIcon />}</span>
      <span className="theme-toggle-label">{isDark ? "روشن" : "تیره"}</span>
    </button>
  );
}