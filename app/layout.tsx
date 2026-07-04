import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Plancitos · Descubrí Buenos Aires",
  description:
    "Encontrá cafés, bares, restaurantes, parques y museos en Buenos Aires.",
};

// Script que corre ANTES de pintar: evita el parpadeo del modo oscuro.
const themeScript = `(function(){try{var t=localStorage.getItem('plancitos_theme');if(t==='dark'){document.documentElement.classList.add('dark');}}catch(e){}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
