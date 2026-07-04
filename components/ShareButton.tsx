"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import type { Place } from "@/lib/types";
import { detailId } from "@/lib/placeId";

export default function ShareButton({ place }: { place: Place }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDoc(e: globalThis.MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  function buildUrl() {
    const base =
      typeof window !== "undefined" ? window.location.origin : "https://plancitos-phi.vercel.app";
    return `${base}/lugar/${encodeURIComponent(detailId(place))}`;
  }

  async function handleClick(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const url = buildUrl();
    const text = `Mirá este plancito: ${place.name}`;
    // En celulares con menú de compartir nativo, lo usamos directo.
    const nav = navigator as unknown as { share?: (d: unknown) => Promise<void> };
    if (typeof nav.share === "function") {
      try {
        await nav.share({ title: place.name, text, url });
        return;
      } catch {
        /* si cancela, seguimos al menú */
      }
    }
    setOpen((v) => !v);
  }

  async function copyLink(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(buildUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  }

  function shareWhatsApp(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const text = `Mirá este plancito: ${place.name} ${buildUrl()}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener");
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={handleClick}
        aria-label="Compartir"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-neutral-600 shadow-sm backdrop-blur transition hover:scale-110 dark:bg-neutral-800/90 dark:text-neutral-200"
      >
        <span aria-hidden>🔗</span>
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-20 w-44 overflow-hidden rounded-xl border border-neutral-200 bg-white text-sm shadow-lg dark:border-neutral-700 dark:bg-neutral-900">
          <button
            onClick={copyLink}
            className="block w-full px-4 py-2.5 text-left text-neutral-700 hover:bg-neutral-50 dark:text-neutral-200 dark:hover:bg-neutral-800"
          >
            {copied ? "¡Enlace copiado!" : "Copiar enlace"}
          </button>
          <button
            onClick={shareWhatsApp}
            className="block w-full px-4 py-2.5 text-left text-neutral-700 hover:bg-neutral-50 dark:text-neutral-200 dark:hover:bg-neutral-800"
          >
            Compartir por WhatsApp
          </button>
        </div>
      )}
    </div>
  );
}
