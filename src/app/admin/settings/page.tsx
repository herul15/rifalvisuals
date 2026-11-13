import { requirePageAdmin } from "@/lib/admin-session";
import React from "react";
import { getSiteSettings } from "@/lib/site-settings";
import SettingsManager from "@/components/admin/SettingsManager";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  await requirePageAdmin();
  const settings = await getSiteSettings();

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
