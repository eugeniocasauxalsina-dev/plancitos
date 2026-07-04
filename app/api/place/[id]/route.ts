import { NextResponse } from "next/server";

// Detalles de un lugar (horarios y reseñas) desde Google Place Details (New).
// La clave vive solo en el servidor; nunca se expone al navegador.
// Si no hay clave o el id no es de Google, devolvemos { available:false }
// y la página de detalle igual muestra el mapa y la info básica.

export const revalidate = 3600;

interface Review {
  rating?: number;
  text?: { text?: string };
  authorAttribution?: { displayName?: string; photoUri?: string };
  relativePublishTime?: string;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  if (!apiKey || !/^ChIJ/i.test(id)) {
    return NextResponse.json({ available: false });
  }

  const fields = [
    "id",
    "displayName",
    "formattedAddress",
    "rating",
    "userRatingCount",
    "priceLevel",
    "location",
    "googleMapsUri",
    "websiteUri",
    "nationalPhoneNumber",
    "currentOpeningHours.openNow",
    "regularOpeningHours.weekdayDescriptions",
    "reviews",
  ].join(",");

  try {
    const res = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(id)}`, {
      headers: {
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": fields,
        "Accept-Language": "es",
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      console.error("Place Details error:", await res.text());
      return NextResponse.json({ available: false });
    }

    const p = await res.json();

    return NextResponse.json({
      available: true,
      name: p.displayName?.text ?? "",
      address: p.formattedAddress ?? "",
      rating: p.rating ?? 0,
      userRatingsTotal: p.userRatingCount ?? 0,
      openNow: p.currentOpeningHours?.openNow ?? null,
      hours: p.regularOpeningHours?.weekdayDescriptions ?? [],
      location: p.location ?? null,
      googleMapsUri: p.googleMapsUri ?? null,
      website: p.websiteUri ?? null,
      phone: p.nationalPhoneNumber ?? null,
      reviews: (p.reviews ?? []).slice(0, 5).map((r: Review) => ({
        author: r.authorAttribution?.displayName ?? "Anónimo",
        rating: r.rating ?? 0,
        text: r.text?.text ?? "",
        when: r.relativePublishTime ?? "",
      })),
    });
  } catch (err) {
    console.error("Place Details fetch failed:", err);
    return NextResponse.json({ available: false });
  }
}
