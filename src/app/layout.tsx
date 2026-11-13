import { getSiteSettings } from "@/lib/site-settings";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Branding is read at request time, including login and error pages.
export const dynamic = "force-dynamic";

const playfair = localFont({
  src: "./fonts/playfair-display.woff2",
  variable: "--font-playfair",
  display: "swap",
  weight: "400 900",
});

const plusJakarta = localFont({
  src: "./fonts/plus-jakarta-sans.woff2",
  variable: "--font-plus-jakarta",
  display: "swap",
  weight: "200 800",
});

const baseMetadata: Metadata = {
  metadataBase: new URL("https://rifalvisuals.com"),
  title: "Rifalvisuals Indonesia | Jasa Dokumentasi Umroh & Haji Profesional",
  description:
    "Mengabadikan perjalanan ibadah di Mekkah, Madinah, Thaif, dan Al Ula dengan visual sinematik, amanah, dan terpercaya. Pricelist resmi dan booking langsung via WhatsApp.",
  keywords: [
    "dokumentasi umroh",
    "fotografer umroh",
    "videografer mekkah",
    "fotografer madinah",
    "rifalvisuals",
    "dokumentasi haji",
    "video cinematic umroh",
  ],
  authors: [{ name: "Rifalvisuals Indonesia" }],
  creator: "Rifalvisuals",
  icons: {
    icon: "/images/logo-transparent.png",
    apple: "/images/logo-transparent.png",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://rifalvisuals.id",
    title: "Rifalvisuals Indonesia | Jasa Dokumentasi Umroh & Haji Profesional",
    description:
      "Mengabadikan perjalanan ibadah di Mekkah, Madinah, Thaif, dan Al Ula dengan visual sinematik, amanah, dan terpercaya.",
    siteName: "Rifalvisuals Indonesia",
    images: [
      {
        url: "/images/hero/hero-makkah.jpeg",
        width: 1200,
        height: 630,
        alt: "Dokumentasi Umroh Rifalvisuals Indonesia",
      },
    ],
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const title = settings.companyName + " | Jasa Dokumentasi Umroh & Haji Profesional";
  return { ...baseMetadata, title, description: settings.tagline,
    authors: [{ name: settings.companyName }], creator: settings.companyName,
    openGraph: { ...baseMetadata.openGraph, title, description: settings.tagline, siteName: settings.companyName,
      images: [{ url: settings.heroImageUrl || "/images/hero/hero-makkah.jpeg", alt: settings.companyName }] },
  };
}

export const viewport: Viewport = {
  themeColor: "#1e3a5f",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${playfair.variable} ${plusJakarta.variable} scroll-smooth antialiased`}
    >
      <body className="min-h-screen bg-[#fbfbf9] text-[#0f172a] font-body flex flex-col selection:bg-[#d0a526] selection:text-[#0f172a]">
        {children}
      </body>
    </html>
  );
}
