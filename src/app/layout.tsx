import type { Metadata, Viewport } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700", "800"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://rifalvisuals.id"),
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
