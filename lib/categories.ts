import type { Category } from "./types";

export const CATEGORIES: Category[] = [
  { id: "cafe", label: "Cafés", emoji: "☕", googleType: "cafe" },
  { id: "restaurant", label: "Restaurantes", emoji: "🍽️", googleType: "restaurant" },
  { id: "bar", label: "Bares", emoji: "🍸", googleType: "bar" },
  { id: "park", label: "Parques", emoji: "🌳", googleType: "park" },
  { id: "museum", label: "Museos", emoji: "🎨", googleType: "museum" },
  { id: "shopping", label: "Compras", emoji: "🛍️", googleType: "shopping_mall" },
];

export function categoryLabel(id: string): string {
  return CATEGORIES.find((c) => c.id === id)?.label ?? id;
}
