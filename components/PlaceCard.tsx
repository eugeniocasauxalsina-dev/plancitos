import type { Place } from "@/lib/types";
import { categoryLabel } from "@/lib/categories";

function priceTag(level?: number) {
  if (level === undefined) return null;
  if (level === 0) return "Gratis";
  return "$".repeat(level);
}

export default function PlaceCard({ place }: { place: Place }) {
  const price = priceTag(place.priceLevel);

  return (
    <article className="group overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={place.photoUrl}
          alt={place.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-neutral-700 backdrop-blur">
          {categoryLabel(place.category)}
        </span>
        {place.openNow !== undefined && (
          <span
            className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-xs font-medium ${
              place.openNow
                ? "bg-emerald-500 text-white"
                : "bg-neutral-800/80 text-white"
            }`}
          >
            {place.openNow ? "Abierto" : "Cerrado"}
          </span>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold leading-tight text-neutral-900">
            {place.name}
          </h3>
          <div className="flex shrink-0 items-center gap-1 text-sm">
            <span className="text-amber-500">&#9733;</span>
            <span className="font-medium">{place.rating.toFixed(1)}</span>
          </div>
        </div>

        <p className="mt-0.5 text-sm text-neutral-500">
          {place.neighborhood}
          {place.userRatingsTotal > 0 && (
            <span className="text-neutral-400">
              {" · "}
              {place.userRatingsTotal.toLocaleString("es-AR")} reseñas
            </span>
          )}
        </p>

        {place.description && (
          <p className="mt-2 line-clamp-2 text-sm text-neutral-600">
            {place.description}
          </p>
        )}

        <div className="mt-3 flex items-center justify-between border-t border-neutral-100 pt-3">
          <span className="truncate text-xs text-neutral-500">{place.address}</span>
          {price && (
            <span className="ml-2 shrink-0 text-xs font-medium text-teal-700">
              {price}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
