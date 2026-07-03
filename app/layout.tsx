import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Plancitos · Descubrí Buenos Aires",
  description:
    "Encontrá cafés, bares, restaurantes, parques y museos en Buenos Aires.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
