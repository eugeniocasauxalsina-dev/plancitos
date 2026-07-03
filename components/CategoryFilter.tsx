"use client";

import { CATEGORIES } from "@/lib/categories";
import type { CategoryId } from "@/lib/types";

interface CategoryFilterProps {
  active: CategoryId | "all";
  onChange: (category: CategoryId | "all") => void;
}

export default function CategoryFilter({ active, onChange }: CategoryFilterProps) {
  const chip = (isActive: boolean) =>
    `whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition ${
      isActive
        ? "border-teal-600 bg-teal-600 text-white shadow-sm"
        : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50"
    }`;

  return (
    <div className="flex flex-wrap justify-center gap-2">
      <button className={chip(active === "all")} onClick={() => onChange("all")}>
        Todos
      </button>
      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          className={chip(active === cat.id)}
          onClick={() => onChange(cat.id)}
        >
          <span className="mr-1">{cat.emoji}</span>
          {cat.label}
        </button>
      ))}
    </div>
  );
}
