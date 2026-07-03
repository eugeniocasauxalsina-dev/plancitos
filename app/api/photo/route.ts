import { NextResponse } from "next/server";

// Puente de fotos. Dos modos:
//  ?ref=<nombre de foto>   -> foto directa (resultados de búsqueda)
//  ?place=<ID de lugar>    -> busca la primera foto del lugar (lista curada)
// La clave nunca queda expuesta en el navegador.

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) return new NextResponse(null, { status: 404 });

  let photoName = searchParams.get("ref");
  const place = searchParams.get("place");

  if (!photoName && place) {
    try {
      const dres = await fetch(`https://places.googleapis.com/v1/places/${place}`, {
        headers: { "X-Goog-Api-Key": apiKey, "X-Goog-FieldMask": "photos" },
        next: { revalidate: 604800 },
      });
      if (dres.ok) {
        const dj = await dres.json();
        photoName = dj.photos?.[0]?.name ?? null;
      }
    } catch {
      /* ignore */
    }
  }

  if (!photoName) return new NextResponse(null, { status: 404 });

  try {
    const res = await fetch(
      `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=800&key=${apiKey}`,
    );
    if (!res.ok) return new NextResponse(null, { status: res.status });
    const buf = await res.arrayBuffer();
    return new NextResponse(buf, {
      headers: {
        "Content-Type": res.headers.get("content-type") || "image/jpeg",
        "Cache-Control": "public, max-age=604800, s-maxage=604800",
      },
    });
  } catch {
    return new NextResponse(null, { status: 502 });
  }
}
