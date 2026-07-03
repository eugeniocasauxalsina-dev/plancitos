/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Fotos reales de Google Places (cuando conectes la API)
      { protocol: "https", hostname: "places.googleapis.com" },
      { protocol: "https", hostname: "maps.googleapis.com" },
      // Imágenes de ejemplo del prototipo
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
