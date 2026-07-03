import { NextResponse } from "next/server";
import { PLACES } from "@/data/places";

// Endpoint TEMPORAL para enriquecer la lista curada con datos reales de Google
// (foto, rating, dirección). Corre en el servidor con la clave de entorno.
// Se usa una sola vez para "hornear" los datos; después se puede borrar.

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const PRICE: Record<string, number> = {
  PRICE_LEVEL_FREE: 0,
  PRICE_LEVEL_INEXPENSIVE: 1,
  PRICE_LEVEL_MODERATE: 2,
  PRICE_LEVEL_EXPENSIVE: 3,
  PRICE_LEVEL_VERY_EXPENSIVE: 4,
};

async function lookup(name: string, apiKey: string) {
  try {
    const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask":
          "places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.priceLevel,places.photos",
      },
      body: JSON.stringify({
        textQuery: `${name} Buenos Aires`,
        languageCode: "es",
        regionCode: "AR",
        locationRestriction: {
          rectangle: {
            low: { latitude: -34.8, longitude: -58.6 },
            high: { latitude: -34.45, longitude: -58.28 },
          },
        },
        maxResultCount: 1,
      }),
    });
    if (!res.ok) return null;
    const d = await res.json();
    const p = d.places?.[0];
    if (!p) return null;
    return {
      rating: p.rating ?? 0,
      userRatingsTotal: p.userRatingCount ?? 0,
      address: p.formattedAddress ?? "",
      neighborhood: p.formattedAddress?.split(",")[1]?.trim() ?? "Buenos Aires",
      priceLevel: p.priceLevel ? PRICE[p.priceLevel] : undefined,
      photoRef: p.photos?.[0]?.name ?? "",
    };
  } catch {
    return null;
  }
}

export async function GET() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "no key" }, { status: 500 });

  const out: Record<string, unknown>[] = [];
  const batchSize = 8;
  for (let i = 0; i < PLACES.length; i += batchSize) {
    const batch = PLACES.slice(i, i + batchSize);
    const results = await Promise.all(
      batch.map(async (pl) => {
        const info = await lookup(pl.name, apiKey);
        return { id: pl.id, name: pl.name, category: pl.category, ...(info ?? { notFound: true }) };
      }),
    );
    out.push(...results);
  }
  return NextResponse.json(out);
}
