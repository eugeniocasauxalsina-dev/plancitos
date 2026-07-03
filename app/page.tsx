"use client";

import { useEffect, useMemo, useState } from "react";
import SearchBar from "@/components/SearchBar";
import CategoryFilter from "@/components/CategoryFilter";
import PlaceCard from "@/components/PlaceCard";
import type { CategoryId, Place } from "@/lib/types";

// La pagina le pega a /api/places (server-side). Ese endpoint devuelve los
// datos de ejemplo o los de Google Places reales segun .env.local, sin
// exponer nunca la clave en el navegador.

export default function Home() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryId | "all">("all");
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

  const heading = useMemo(() => {
    if (loading) return "Buscando...";
    return `${places.length} ${places.length === 1 ? "lugar" : "lugares"}`;
  }, [loading, places.length]);

  return (
    <main className="min-h-screen">
      <section className="bg-gradient-to-b from-teal-50 to-transparent">
        <div className="mx-auto max-w-6xl px-4 py-14 text-center sm:py-20">
          <p className="mb-3 text-sm font-medium uppercase tracking-wider text-teal-700">
            Buenos Aires
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl">
            Plancitos
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-lg text-neutral-600">
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
        <div className="mb-5 flex items-baseline justify-between">
          <h2 className="text-lg font-semibold text-neutral-800">{heading}</h2>
        </div>

        {!loading && places.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-neutral-300 py-16 text-center">
            <p className="text-4xl">&#129362;</p>
            <p className="mt-3 font-medium text-neutral-700">
              No encontramos plancitos con esa busqueda.
            </p>
            <p className="text-sm text-neutral-500">
              Proba con otra palabra o cambia el filtro.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {places.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        )}
      </section>

      <footer className="border-t border-neutral-200 py-8 text-center text-sm text-neutral-500">
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
