"use client";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscá por nombre, barrio o palabra clave…"
        aria-label="Buscar lugares"
        className="w-full rounded-full border border-neutral-200 bg-white py-3.5 pl-12 pr-4 text-base shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          aria-label="Limpiar búsqueda"
          className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
        >
          ✕
        </button>
      )}
    </div>
  );
}
