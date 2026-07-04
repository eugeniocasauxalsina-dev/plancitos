"use client";

import { useEffect, useState } from "react";

const KEY = "plancitos_theme";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  // Al montar, leemos el estado real que dejó el script anti-parpadeo.
  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    const root = document.documentElement;
    root.classList.toggle("dark", next);
    try {
      localStorage.setItem(KEY, next ? "dark" : "light");
    } catch {
      /* ignore */
    }
  }

  return (
    <button
      onClick={toggle}
      aria-label={dark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      title={dark ? "Modo claro" : "Modo oscuro"}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 text-base transition hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
    >
      <span aria-hidden>{dark ? "☀️" : "🌙"}</span>
    </button>
  );
}
