import { NextResponse } from "next/server";

// Puente de fotos: trae la imagen de Google Places del lado del servidor,
// para que la clave nunca quede expuesta en el navegador y las fotos carguen bien.

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ref = searchParams.get("ref");
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  if (!ref || !apiKey) {
    return new NextResponse(null, { status: 404 });
  }

  const url = `https://places.googleapis.com/v1/${ref}/media?maxWidthPx=800&key=${apiKey}`;

  try {
    const res = await fetch(url);
    if (!res.ok) return new NextResponse(null, { status: res.status });
    const buf = await res.arrayBuffer();
    return new NextResponse(buf, {
      headers: {
        "Content-Type": res.headers.get("content-type") || "image/jpeg",
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    });
  } catch {
    return new NextResponse(null, { status: 502 });
  }
}
