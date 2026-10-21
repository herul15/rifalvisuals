import React from "react";
import prisma from "@/lib/prisma";
import SettingsManager from "@/components/admin/SettingsManager";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await prisma.siteSetting.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      companyName: "Rifalvisuals Indonesia",
      tagline: "Mengabadikan Perjalanan Ibadah, Menjaga Kenangan Selamanya.",
      whatsappNumber: "62881080522136",
      emailAddress: "Rifalvisuals2024@gmail.com",
      instagramHandle: "rifalvisuals",
      tiktokHandle: "rifaal_dii",
      address: "Mekkah - Madinah - Indonesia",
      meetingPointNabawi: "Pintu 333 / 310 Masjid Nabawi",
      meetingPointHaram: "WC 3 Pelataran Masjidil Haram",
      meetingPointJabal: "Lobby Hotel Al Shohada",
      dpPercentage: 50,
      announcementText: null,
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-white">
          Pengaturan Situs & Operasional
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Konfigurasi nomor WhatsApp resmi, persentase DP, meeting points, serta kontak operasional Rifalvisuals Indonesia.
        </p>
      </div>

      <SettingsManager initialSettings={settings} />
    </div>
  );
}
