import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import Header from "@/components/Header";

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
      <body>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
