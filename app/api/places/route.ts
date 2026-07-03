import { NextResponse } from "next/server";
import { searchPlaces } from "@/lib/places";
import type { CategoryId } from "@/lib/types";

// Endpoint del lado del servidor. La UI le pega a /api/places y este handler
// llama a searchPlaces(), que usa datos de ejemplo o la API real de Google
// según la configuración de .env.local. La clave NUNCA llega al navegador.

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") ?? "";
  const category = (searchParams.get("category") ?? "all") as CategoryId | "all";

  try {
    const places = await searchPlaces({ query, category });
    return NextResponse.json({ places });
  } catch (err) {
    console.error("Error en /api/places:", err);
    return NextResponse.json(
      { places: [], error: "No se pudieron obtener los lugares." },
      { status: 500 },
    );
  }
}
