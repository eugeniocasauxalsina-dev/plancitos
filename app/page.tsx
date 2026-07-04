"use client";

import { useEffect, useMemo, useState } from "react";
import SearchBar from "@/components/SearchBar";
import CategoryFilter from "@/components/CategoryFilter";
import PlaceCard from "@/components/PlaceCard";
import type { CategoryId, Place } from "@/lib/types";

// La pagina le pega a /api/places (server-side). Ese endpoint devuelve los
// datos de ejemplo o los de Google Places reales segun .env.local, sin
// exponer nunca la clave en el navegador.

type SortId = "recomendado" | "rating" | "reviews";

export default function Home() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryId | "all">("all");
  const [openOnly, setOpenOnly] = useState(false);
  const [sort, setSort] = useState<SortId>("recomendado");
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);

    const params = new URLSearchParams({ query: debouncedQuery, category });
    fetch(`/api/places?${params.toString()}`, { signal: controller.signal })
      .then((r) => r.json())
      .then((data) => setPlaces(data.places ?? []))
      .catch((err) => {
        if (err.name !== "AbortError") setPlaces([]);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [debouncedQuery, category]);

  // Filtro "Abierto ahora" y orden, aplicados en el navegador.
  const visible = useMemo(() => {
    let list = places;
    if (openOnly) list = list.filter((p) => p.openNow === true);
    if (sort === "rating") {
      list = [...list].sort((a, b) => b.rating - a.rating);
    } else if (sort === "reviews") {
      list = [...list].sort((a, b) => b.userRatingsTotal - a.userRatingsTotal);
    }
    return list;
  }, [places, openOnly, sort]);

  const heading = useMemo(() => {
    if (loading) return "Buscando...";
    const label = `${visible.length} ${visible.length === 1 ? "lugar" : "lugares"}`;
    return debouncedQuery.trim() ? label : `Recomendados de Plancitos · ${label}`;
  }, [loading, visible.length, debouncedQuery]);

  return (
    <main className="min-h-screen">
      <section className="bg-gradient-to-b from-teal-50 to-transparent dark:from-teal-950/40">
        <div className="mx-auto max-w-6xl px-4 py-14 text-center sm:py-20">
          <p className="mb-3 text-sm font-medium uppercase tracking-wider text-teal-700 dark:text-teal-400">
            Buenos Aires
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 sm:text-5xl">
            Plancitos
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-lg text-neutral-600 dark:text-neutral-300">
            Descubri cafes, bares, restaurantes, parques y museos cerca tuyo.
          </p>

          <div className="mt-8">
            <SearchBar value={query} onChange={setQuery} />
          </div>
          <div className="mt-5">
            <CategoryFilter active={category} onChange={setCategory} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">{heading}</h2>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setOpenOnly((v) => !v)}
              aria-pressed={openOnly}
              className={`rounded-full border px-3.5 py-2 text-sm font-medium transition ${
                openOnly
                  ? "border-emerald-600 bg-emerald-600 text-white shadow-sm"
                  : "border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
              }`}
            >
              🟢 Abierto ahora
            </button>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortId)}
              aria-label="Ordenar resultados"
              className="rounded-full border border-neutral-200 bg-white px-3.5 py-2 text-sm font-medium text-neutral-700 outline-none transition hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
            >
              <option value="recomendado">Recomendado</option>
              <option value="rating">Mejor puntaje</option>
              <option value="reviews">Más reseñas</option>
            </select>
          </div>
        </div>

        {!loading && visible.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-neutral-300 py-16 text-center dark:border-neutral-700">
            <p className="text-4xl">&#129362;</p>
            <p className="mt-3 font-medium text-neutral-700 dark:text-neutral-200">
              {openOnly
                ? "No hay lugares marcados como abiertos ahora."
                : "No encontramos plancitos con esa busqueda."}
            </p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {openOnly
                ? "Probá quitando el filtro 'Abierto ahora'."
                : "Proba con otra palabra o cambia el filtro."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        )}
      </section>

      <footer className="border-t border-neutral-200 py-8 text-center text-sm text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
        Plancitos - Buenos Aires
      </footer>
    </main>
  );
}

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}
