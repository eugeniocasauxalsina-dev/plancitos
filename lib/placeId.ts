import type { Place } from "./types";

// Devuelve el ID de Google del lugar (para pedir detalles/fotos), o null.
// - Resultados de búsqueda: el propio id ya es el de Google (ChIJ...).
// - Curados: el id de Google viene embebido en la foto (/api/photo?place=ChIJ...).
export function googlePlaceId(place: Pick<Place, "id" | "photoUrl">): string | null {
  if (/^ChIJ/i.test(place.id)) return place.id;
  if (/^places\//i.test(place.id)) return place.id.replace(/^places\//i, "");
  const m = (place.photoUrl || "").match(/[?&]place=([^&]+)/);
  if (m) return decodeURIComponent(m[1]);
  return null;
}

// ID seguro para usar en la URL de detalle (Google id si existe, si no el id interno).
export function detailId(place: Pick<Place, "id" | "photoUrl">): string {
  return googlePlaceId(place) ?? place.id;
}
