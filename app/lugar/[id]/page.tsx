"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import type { Place } from "@/lib/types";
import { categoryLabel } from "@/lib/categories";
import { useFavorites } from "@/lib/favorites";
import ShareButton from "@/components/ShareButton";

interface Details {
  available: boolean;
  name?: string;
  address?: string;
  rating?: number;
  userRatingsTotal?: number;
  openNow?: boolean | null;
  hours?: string[];
  location?: { latitude: number; longitude: number } | null;
  googleMapsUri?: string | null;
  website?: string | null;
  phone?: string | null;
  reviews?: { author: string; rating: number; text: string; when: string }[];
}

export default function LugarPage() {
  const params = useParams();
  const rawId = params?.id;
  const id = decodeURIComponent(Array.isArray(rawId) ? rawId[0] : rawId ?? "");

  const [place, setPlace] = useState<Place | null>(null);
  const [details, setDetails] = useState<Details | null>(null);
  const [loading, setLoading] = useState(true);
  const { isFavorite, toggleFavorite } = useFavorites();

  // Info básica guardada al tocar la tarjeta (para pintar al instante).
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(`plancitos_place_${id}`);
      if (raw) setPlace(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, [id]);

  // Detalles reales (horarios y reseñas) desde el servidor.
  useEffect(() => {
    let alive = true;
    fetch(`/api/place/${encodeURIComponent(id)}`)
      .then((r) => r.json())
      .then((d) => alive && setDetails(d))
      .catch(() => alive && setDetails({ available: false }))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [id]);

  const name = place?.name || details?.name || "Lugar";
  const rating = details?.rating || place?.rating || 0;
  const reviewsTotal = details?.userRatingsTotal || place?.userRatingsTotal || 0;
  const address = details?.address || place?.address || "";
  const fav = place ? isFavorite(place.id) : false;

  const mapQuery = useMemo(() => {
    if (details?.location) return `${details.location.latitude},${details.location.longitude}`;
    return encodeURIComponent(`${name} Buenos Aires`);
  }, [details, name]);

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
      >
        ← Volver a la búsqueda
      </Link>

      <div className="mt-4 overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        {place?.photoUrl && (
          <div className="relative aspect-[16/9] bg-neutral-100 dark:bg-neutral-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={place.photoUrl} alt={name} className="h-full w-full object-cover" />
          </div>
        )}

        <div className="p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-xs font-medium uppercase tracking-wide text-teal-700 dark:text-teal-400">
                {place ? categoryLabel(place.category) : "Lugar"}
              </span>
              <h1 className="mt-1 text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                {name}
              </h1>
              <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-neutral-500 dark:text-neutral-400">
                {rating > 0 && (
                  <span>
                    <span className="text-amber-500">★</span> {rating.toFixed(1)}
                    {reviewsTotal > 0 && ` · ${reviewsTotal.toLocaleString("es-AR")} reseñas`}
                  </span>
                )}
                {details?.openNow != null && (
                  <span className={details.openNow ? "text-emerald-600 dark:text-emerald-400" : "text-neutral-500"}>
                    · {details.openNow ? "Abierto ahora" : "Cerrado ahora"}
                  </span>
                )}
              </div>
              {address && (
                <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">{address}</p>
              )}
            </div>

            <div className="flex items-center gap-2">
              {place && <ShareButton place={place} />}
              {place && (
                <button
                  onClick={() => toggleFavorite(place)}
                  aria-label={fav ? "Quitar de favoritos" : "Guardar en favoritos"}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 text-lg dark:border-neutral-700"
                >
                  <span className={fav ? "text-rose-500" : "text-neutral-400"}>
                    {fav ? "❤" : "🤍"}
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* Enlaces rápidos */}
          {(details?.website || details?.phone || details?.googleMapsUri) && (
            <div className="mt-4 flex flex-wrap gap-2 text-sm">
              {details?.website && (
                <a
                  href={details.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-neutral-200 px-3 py-1.5 font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
                >
                  Sitio web
                </a>
              )}
              {details?.phone && (
                <a
                  href={`tel:${details.phone}`}
                  className="rounded-full border border-neutral-200 px-3 py-1.5 font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
                >
                  {details.phone}
                </a>
              )}
              {details?.googleMapsUri && (
                <a
                  href={details.googleMapsUri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-neutral-200 px-3 py-1.5 font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
                >
                  Ver en Google Maps
                </a>
              )}
            </div>
          )}

          {/* Mapa */}
          <div className="mt-6">
            <h2 className="mb-2 text-sm font-semibold text-neutral-800 dark:text-neutral-200">Mapa</h2>
            <div className="overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800">
              <iframe
                title={`Mapa de ${name}`}
                src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                className="h-64 w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Horarios */}
          {details?.hours && details.hours.length > 0 && (
            <div className="mt-6">
              <h2 className="mb-2 text-sm font-semibold text-neutral-800 dark:text-neutral-200">Horarios</h2>
              <ul className="space-y-0.5 text-sm text-neutral-600 dark:text-neutral-300">
                {details.hours.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Reseñas */}
          {details?.reviews && details.reviews.length > 0 && (
            <div className="mt-6">
              <h2 className="mb-2 text-sm font-semibold text-neutral-800 dark:text-neutral-200">Reseñas</h2>
              <div className="space-y-4">
                {details.reviews.map((r, i) => (
                  <div key={i} className="rounded-2xl border border-neutral-100 p-4 dark:border-neutral-800">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-neutral-800 dark:text-neutral-100">{r.author}</span>
                      <span className="text-xs text-neutral-500 dark:text-neutral-400">
                        <span className="text-amber-500">★</span> {r.rating} · {r.when}
                      </span>
                    </div>
                    {r.text && (
                      <p className="mt-1.5 text-sm text-neutral-600 dark:text-neutral-300">{r.text}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {!loading && details && !details.available && (
            <p className="mt-6 text-sm text-neutral-500 dark:text-neutral-400">
              Los horarios y reseñas se muestran cuando la búsqueda usa datos de Google.
              Igual podés ver la ubicación en el mapa.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
