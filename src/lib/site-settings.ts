import { cache } from "react";
import type { SiteSetting } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const defaultSiteSettings: SiteSetting = {
  id: "default", companyName: "Rifalvisuals Indonesia",
  tagline: "Mengabadikan Perjalanan Ibadah, Menjaga Kenangan Selamanya.",
  whatsappNumber: "62881080522136", emailAddress: "Rifalvisuals2024@gmail.com",
  instagramHandle: "rifalvisuals", tiktokHandle: "rifaal_dii",
  address: "Mekkah - Madinah - Indonesia", meetingPointNabawi: "Pintu 333 / 310 Masjid Nabawi",
  meetingPointHaram: "WC 3 Pelataran Masjidil Haram", meetingPointJabal: "Lobby Hotel Al Shohada",
  dpPercentage: 50, announcementText: null, heroImageUrl: "/images/hero/hero-makkah.jpeg",
  aboutImageUrl: "/images/hero/about-rifal.jpeg", updatedAt: new Date(0),
};

// Cache only within a React render. Database errors deliberately propagate.
export const getSiteSettings = cache(async (): Promise<SiteSetting> =>
  await prisma.siteSetting.findUnique({ where: { id: "default" } }) ?? { ...defaultSiteSettings }
);
