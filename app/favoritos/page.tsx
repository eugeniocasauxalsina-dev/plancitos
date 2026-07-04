"use client";

import Link from "next/link";
import PlaceCard from "@/components/PlaceCard";
import { useFavorites } from "@/lib/favorites";

export default function FavoritosPage() {
  const { favorites } = useFavorites();

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Mis favoritos</h1>
      <p className="mt-1 text-neutral-600 dark:text-neutral-300">
        Los lugares que marcaste con el corazón. Se guardan en este dispositivo.
      </p>

      {favorites.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-neutral-300 py-16 text-center dark:border-neutral-700">
          <p className="text-4xl">🤍</p>
          <p className="mt-3 font-medium text-neutral-700 dark:text-neutral-200">Todavía no guardaste favoritos.</p>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Tocá el corazón en cualquier lugar para agregarlo.
          </p>
          <Link
            href="/"
            className="mt-4 inline-block rounded-full bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
          >
            Explorar lugares
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((place) => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>
      )}
    </main>
  );
}
