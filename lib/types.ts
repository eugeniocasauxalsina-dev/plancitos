// Tipos centrales de Plancitos.
// Están pensados para mapear 1:1 con la respuesta de Google Places (New),
// así el día que conectes la API real casi no hay que tocar la UI.

export type CategoryId =
  | "cafe"
  | "restaurant"
  | "bar"
  | "park"
  | "museum"
  | "shopping";

export interface Category {
  id: CategoryId;
  label: string;
  emoji: string;
  /** Tipo equivalente en Google Places (para la integración real). */
  googleType: string;
}

export interface Place {
  id: string;
  name: string;
  category: CategoryId;
  /** Barrio / zona de Buenos Aires. */
  neighborhood: string;
  address: string;
  rating: number;
  userRatingsTotal: number;
  /** Nivel de precio 0–4, como en Google Places. */
  priceLevel?: number;
  photoUrl: string;
  description: string;
  openNow?: boolean;
}
