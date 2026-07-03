# Plancitos 🧉

Descubrí lugares en Buenos Aires: cafés, bares, restaurantes, parques, museos y compras. Búsqueda instantánea, filtros por categoría y tarjetas con foto, rating y precio.

Esta es la **primera versión: un prototipo visual** con datos de ejemplo de Buenos Aires. La integración real con **Google Places API** ya está preparada y documentada — solo falta tu clave.

## Stack

- **Next.js 15** (App Router) + **React 19**
- **TypeScript**
- **Tailwind CSS v4**

## Cómo correrlo

Necesitás Node 18.18+ (recomendado Node 20 o 22).

```bash
cd plancitos
npm install
npm run dev
```

Abrí http://localhost:3000

## Estructura

```
plancitos/
├── app/
│   ├── layout.tsx        # Layout raíz + metadata
│   ├── page.tsx          # Página principal (hero, búsqueda, filtros, grid)
│   └── globals.css       # Tailwind + variables de color
├── components/
│   ├── SearchBar.tsx     # Input de búsqueda
│   ├── CategoryFilter.tsx# Chips de categoría
│   └── PlaceCard.tsx     # Tarjeta de lugar
├── lib/
│   ├── types.ts          # Tipos (mapeados a Google Places)
│   ├── categories.ts     # Categorías y sus tipos de Google
│   └── places.ts         # Capa de datos: mock + integración Google Places
└── data/
    └── places.ts         # Lugares de ejemplo de Buenos Aires
```

## Cómo conectar Google Places (cuando tengas la clave)

1. Creá un proyecto en [Google Cloud Console](https://console.cloud.google.com), habilitá la **Places API (New)** y generá una API key.
2. Copiá el archivo de ejemplo y completá la clave:

   ```bash
   cp .env.local.example .env.local
   ```

   ```
   GOOGLE_PLACES_API_KEY=tu_clave_aca
   NEXT_PUBLIC_USE_REAL_PLACES=true
   ```

3. La función `searchPlaces()` en `lib/places.ts` detecta la clave y empieza a usar la API real (endpoint *Text Search* de Places New), con la búsqueda sesgada a Buenos Aires. El mapeo de la respuesta ya está resuelto en `mapGooglePlace()`.

> **Nota:** `app/page.tsx` filtra los datos de ejemplo en el cliente para que sea instantáneo. Para consumir la API real, moveé la búsqueda a un Server Component o a un Route Handler que llame a `searchPlaces()` (así la clave nunca se expone al navegador). Hay un comentario indicándolo en el código.

## Próximos pasos sugeridos

- Página de detalle por lugar (`app/lugar/[id]/page.tsx`).
- Guardar favoritos.
- Geolocalización ("cerca mío") y ordenar por distancia.
- Mapa con los resultados.
