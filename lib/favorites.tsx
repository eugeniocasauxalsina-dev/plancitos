"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { Place } from "./types";

interface FavContext {
  favorites: Place[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (place: Place) => void;
}

const Ctx = createContext<FavContext | null>(null);
const KEY = "plancitos_favorites";

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [map, setMap] = useState<Record<string, Place>>({});

  // Cargar favoritos guardados en el navegador.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setMap(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  // Guardar cada cambio.
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(map));
    } catch {
      /* ignore */
    }
  }, [map]);

  const toggleFavorite = useCallback((place: Place) => {
    setMap((m) => {
      const next = { ...m };
      if (next[place.id]) delete next[place.id];
      else next[place.id] = place;
      return next;
    });
  }, []);

  const isFavorite = useCallback((id: string) => Boolean(map[id]), [map]);

  return (
    <Ctx.Provider value={{ favorites: Object.values(map), isFavorite, toggleFavorite }}>
      {children}
    </Ctx.Provider>
  );
}

export function useFavorites() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useFavorites debe usarse dentro de FavoritesProvider");
  return c;
}
