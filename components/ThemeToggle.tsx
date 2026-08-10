"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const current = document.documentElement.getAttribute("data-theme") as "dark" | "light" | null;
    if (current === "light" || current === "dark") {
      setTheme(current);
    } else {
      const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
      const initial = prefersLight ? "light" : "dark";
      setTheme(initial);
      document.documentElement.setAttribute("data-theme", initial);
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    try {
      localStorage.setItem("theme", nextTheme);
    } catch (e) {
      // Ignore if localStorage is not accessible
    }
  };

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] shrink-0" />
    );
  }

  return (
    <button
      id="theme-toggle-btn"
      onClick={toggleTheme}
      type="button"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className="relative flex items-center justify-center w-9 h-9 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] text-[var(--text-primary)] transition-all duration-200 shadow-sm active:scale-95 cursor-pointer group"
    >
      <span className="text-base transition-transform duration-300 group-hover:scale-110">
        {theme === "dark" ? "☀️" : "🌙"}
      </span>
    </button>
  );
}
