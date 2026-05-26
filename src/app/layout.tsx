import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import Providers from "./providers";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CasaAI — Encontrá tu propiedad ideal",
  description:
    "La plataforma inmobiliaria inteligente de Argentina. Match IA, tasador automático y análisis de inversión.",
  openGraph: {
    title: "CasaAI",
    description: "Encontrá tu propiedad ideal con inteligencia artificial",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${playfair.variable} ${dmSans.variable} h-full`}
    >
      <body
        className="min-h-full flex flex-col antialiased"
        style={{ fontFamily: "var(--font-dm-sans), system-ui, sans-serif" }}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
