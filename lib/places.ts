import type { CategoryId, Place } from "./types";
import { PLACES } from "@/data/places";
import { CATEGORIES } from "./categories";

// ---------------------------------------------------------------------------
// Capa de datos de Plancitos.
//
// En el prototipo devolvemos los datos de ejemplo (mock). El día que tengas
// tu clave de Google Places, poné NEXT_PUBLIC_USE_REAL_PLACES=true y completá
// GOOGLE_PLACES_API_KEY en .env.local: `searchPlaces` empezará a pegarle a la
// API real sin que haya que tocar la interfaz.
// ---------------------------------------------------------------------------

export interface SearchParams {
  query?: string;
  category?: CategoryId | "all";
}

const USE_REAL = process.env.NEXT_PUBLIC_USE_REAL_PLACES === "true";

export async function searchPlaces(params: SearchParams): Promise<Place[]> {
  if (USE_REAL && process.env.GOOGLE_PLACES_API_KEY) {
    return searchPlacesGoogle(params);
  }
  return searchPlacesMock(params);
}

// --- Prototipo: filtra los datos de ejemplo en memoria -------------------

function searchPlacesMock({ query, category }: SearchParams): Place[] {
  const q = (query ?? "").trim().toLowerCase();

  return PLACES.filter((place) => {
    const matchesCategory =
      !category || category === "all" || place.category === category;

    const matchesQuery =
      !q ||
      place.name.toLowerCase().includes(q) ||
      place.neighborhood.toLowerCase().includes(q) ||
      place.description.toLowerCase().includes(q);

    return matchesCategory && matchesQuery;
  });
}

// --- Real: Google Places API (New) - Text Search --------------------------
// Docs: https://developers.google.com/maps/documentation/places/web-service/text-search

async function searchPlacesGoogle({ query, category }: SearchParams): Promise<Place[]> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY!;
  const cat = CATEGORIES.find((c) => c.id === category);

  // Sesgamos la búsqueda a Buenos Aires (centro aprox.) con un radio de 15 km.
  const textQuery =
    [query, cat?.label, "Buenos Aires"].filter(Boolean).join(" ") ||
    "lugares en Buenos Aires";

  const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      // Pedí solo los campos que usa la UI para no pagar de más.
      "X-Goog-FieldMask": [
        "places.id",
        "places.displayName",
        "places.formattedAddress",
        "places.rating",
        "places.userRatingCount",
        "places.priceLevel",
        "places.primaryType",
        "places.photos",
        "places.currentOpeningHours.openNow",
      ].join(","),
    },
    body: JSON.stringify({
      textQuery,
      languageCode: "es",
      regionCode: "AR",
      locationBias: {
        circle: {
          center: { latitude: -34.6037, longitude: -58.3816 },
          radius: 15000,
        },
      },
    }),
    // Cachea 1h para no repetir llamadas idénticas.
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    console.error("Google Places error:", await res.text());
    return searchPlacesMock({ query, category });
  }

  const data = (await res.json()) as { places?: GooglePlace[] };
  return (data.places ?? []).map((p) => mapGooglePlace(p, apiKey, category));
}

interface GooglePlace {
  id: string;
  displayName?: { text: string };
  formattedAddress?: string;
  rating?: number;
  userRatingCount?: number;
  priceLevel?: string;
  primaryType?: string;
  photos?: { name: string }[];
  currentOpeningHours?: { openNow?: boolean };
}

function mapGooglePlace(
  p: GooglePlace,
  apiKey: string,
  fallbackCategory?: CategoryId | "all",
): Place {
  const photoUrl = p.photos?.[0]
    ? `/api/photo?ref=${encodeURIComponent(p.photos[0].name)}`
    : "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80";

  return {
    id: p.id,
    name: p.displayName?.text ?? "Sin nombre",
    category: (fallbackCategory && fallbackCategory !== "all"
      ? fallbackCategory
      : "restaurant") as CategoryId,
    neighborhood: p.formattedAddress?.split(",")[1]?.trim() ?? "Buenos Aires",
    address: p.formattedAddress ?? "",
    rating: p.rating ?? 0,
    userRatingsTotal: p.userRatingCount ?? 0,
    priceLevel: PRICE_LEVEL_MAP[p.priceLevel ?? ""] ?? undefined,
    photoUrl,
    description: "",
    openNow: p.currentOpeningHours?.openNow,
  };
}

const PRICE_LEVEL_MAP: Record<string, number> = {
  PRICE_LEVEL_FREE: 0,
  PRICE_LEVEL_INEXPENSIVE: 1,
  PRICE_LEVEL_MODERATE: 2,
  PRICE_LEVEL_EXPENSIVE: 3,
  PRICE_LEVEL_VERY_EXPENSIVE: 4,
};
