"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Save,
  Check,
  AlertCircle,
  X,
  Phone,
  Mail,
  MapPin,
  Building,
  Percent,
  Megaphone,
  Camera,
  ImageIcon,
} from "lucide-react";
import MediaPickerModal from "@/components/admin/MediaPickerModal";

interface SiteSetting {
  id: string;
  companyName: string;
  tagline: string;
  whatsappNumber: string;
  emailAddress: string;
  instagramHandle: string;
  tiktokHandle: string;
  address: string;
  meetingPointNabawi: string;
  meetingPointHaram: string;
  meetingPointJabal: string;
  dpPercentage: number;
  announcementText: string | null;
  heroImageUrl?: string | null;
  aboutImageUrl?: string | null;
}

interface SettingsManagerProps {
  initialSettings: SiteSetting;
}

export default function SettingsManager({
  initialSettings,
}: SettingsManagerProps) {
  const [settings, setSettings] = useState<SiteSetting>(initialSettings);
  const [activePickerField, setActivePickerField] = useState<"hero" | "about" | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal menyimpan perubahan pengaturan.");
      }

      setSettings(data.data);
      showNotification("success", "Pengaturan situs berhasil diperbarui.");
    } catch (err: unknown) {
      showNotification(
        "error",
        err instanceof Error ? err.message : "Terjadi kesalahan sistem."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Toast Notification */}
      {notification && (
        <div
          role="alert"
          className={`p-4 rounded-xl border flex items-center justify-between shadow-lg transition-all ${
            notification.type === "success"
              ? "bg-emerald-950/80 border-emerald-500/30 text-emerald-300"
              : "bg-red-950/80 border-red-500/30 text-red-300"
          }`}
        >
          <div className="flex items-center gap-2.5 text-sm">
            {notification.type === "success" ? (
              <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotification(null)}
            className="p-1 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Company & Brand Identity */}
        <div className="bg-[#0b1626] border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-white/10">
            <Building className="w-5 h-5 text-[#d0a526]" />
            <h2 className="text-base font-bold text-white">Identitas Perusahaan</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Nama Resmi Perusahaan
              </label>
              <input
                type="text"
                required
                value={settings.companyName}
                onChange={(e) =>
                  setSettings({ ...settings, companyName: e.target.value })
                }
                className="w-full bg-[#070e1a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d0a526]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Tagline Utama
              </label>
              <input
                type="text"
                required
                value={settings.tagline}
                onChange={(e) =>
                  setSettings({ ...settings, tagline: e.target.value })
                }
                className="w-full bg-[#070e1a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d0a526]"
              />
            </div>
          </div>
        </div>

        {/* Contact & Social Links */}
        <div className="bg-[#0b1626] border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-white/10">
            <Phone className="w-5 h-5 text-[#d0a526]" />
            <h2 className="text-base font-bold text-white">Kontak & Saluran Resmi</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Nomor WhatsApp Resmi (Format: 628...)
              </label>
              <input
                type="text"
                required
                value={settings.whatsappNumber}
                onChange={(e) =>
                  setSettings({ ...settings, whatsappNumber: e.target.value })
                }
                className="w-full bg-[#070e1a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d0a526]"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Nomor ini digunakan di seluruh tombol CTA WhatsApp booking.
              </span>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Email Operasional
              </label>
              <input
                type="email"
                required
                value={settings.emailAddress}
                onChange={(e) =>
                  setSettings({ ...settings, emailAddress: e.target.value })
                }
                className="w-full bg-[#070e1a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d0a526]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Username Instagram
              </label>
              <div className="flex items-center">
                <span className="bg-[#070e1a] border border-r-0 border-white/10 rounded-l-xl px-3 py-2 text-xs text-slate-400">
                  @
                </span>
                <input
                  type="text"
                  value={settings.instagramHandle}
                  onChange={(e) =>
                    setSettings({ ...settings, instagramHandle: e.target.value })
                  }
                  className="w-full bg-[#070e1a] border border-white/10 rounded-r-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d0a526]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Username TikTok
              </label>
              <div className="flex items-center">
                <span className="bg-[#070e1a] border border-r-0 border-white/10 rounded-l-xl px-3 py-2 text-xs text-slate-400">
                  @
                </span>
                <input
                  type="text"
                  value={settings.tiktokHandle}
                  onChange={(e) =>
                    setSettings({ ...settings, tiktokHandle: e.target.value })
                  }
                  className="w-full bg-[#070e1a] border border-white/10 rounded-r-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d0a526]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Meeting Points & Booking Rules */}
        <div className="bg-[#0b1626] border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-white/10">
            <MapPin className="w-5 h-5 text-[#d0a526]" />
            <h2 className="text-base font-bold text-white">
              Titik Temu (Meeting Points) & Aturan DP
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Meeting Point Madinah (Nabawi)
              </label>
              <input
                type="text"
                required
                value={settings.meetingPointNabawi}
                onChange={(e) =>
                  setSettings({ ...settings, meetingPointNabawi: e.target.value })
                }
                className="w-full bg-[#070e1a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d0a526]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Meeting Point Makkah (Haram)
              </label>
              <input
                type="text"
                required
                value={settings.meetingPointHaram}
                onChange={(e) =>
                  setSettings({ ...settings, meetingPointHaram: e.target.value })
                }
                className="w-full bg-[#070e1a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d0a526]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Meeting Point City Tour Jabal
              </label>
              <input
                type="text"
                required
                value={settings.meetingPointJabal}
                onChange={(e) =>
                  setSettings({ ...settings, meetingPointJabal: e.target.value })
                }
                className="w-full bg-[#070e1a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d0a526]"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Persentase DP Wajib (%)
            </label>
            <div className="w-32">
              <input
                type="number"
                min="10"
                max="100"
                value={settings.dpPercentage}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    dpPercentage: Number(e.target.value),
                  })
                }
                className="w-full bg-[#070e1a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d0a526]"
              />
            </div>
          </div>
        </div>

        {/* Visual Media Management (Hero & About Backgrounds) */}
        <div className="bg-[#0b1626] border border-white/10 rounded-2xl p-6 space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-white/10">
            <Camera className="w-5 h-5 text-[#d0a526]" />
            <h2 className="text-base font-bold text-white">
              Foto Latar Belakang Hero & Tentang Kami
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Hero Image Setting */}
            <div className="space-y-3 p-4 rounded-xl bg-[#070e1a] border border-white/5">
              <label className="block text-xs font-semibold text-slate-200">
                Foto Latar Belakang Hero (Header Utama)
              </label>
              <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-slate-900 border border-white/10 group">
                <Image
                  src={settings.heroImageUrl || "/images/hero/hero-makkah.jpeg"}
                  alt="Hero Preview"
                  fill
                  sizes="320px"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => setActivePickerField("hero")}
                    className="px-3 py-1.5 rounded-xl bg-[#d0a526] text-[#070e1a] text-xs font-bold flex items-center gap-1.5 shadow"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Pilih Foto Hero</span>
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-400 text-[11px] truncate max-w-[200px]">
                  {settings.heroImageUrl || "/images/hero/hero-makkah.jpeg"}
                </span>
                <button
                  type="button"
                  onClick={() => setActivePickerField("hero")}
                  className="text-[#d0a526] font-semibold hover:underline text-xs"
                >
                  Ubah Foto
                </button>
              </div>
            </div>

            {/* About Image Setting */}
            <div className="space-y-3 p-4 rounded-xl bg-[#070e1a] border border-white/5">
              <label className="block text-xs font-semibold text-slate-200">
                Foto Profil Bagian &quot;Tentang Kami&quot;
              </label>
              <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-slate-900 border border-white/10 group">
                <Image
                  src={settings.aboutImageUrl || "/images/hero/about-rifal.jpeg"}
                  alt="About Preview"
                  fill
                  sizes="320px"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => setActivePickerField("about")}
                    className="px-3 py-1.5 rounded-xl bg-[#d0a526] text-[#070e1a] text-xs font-bold flex items-center gap-1.5 shadow"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Pilih Foto Tentang Kami</span>
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-400 text-[11px] truncate max-w-[200px]">
                  {settings.aboutImageUrl || "/images/hero/about-rifal.jpeg"}
                </span>
                <button
                  type="button"
                  onClick={() => setActivePickerField("about")}
                  className="text-[#d0a526] font-semibold hover:underline text-xs"
                >
                  Ubah Foto
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Announcement Banner */}
        <div className="bg-[#0b1626] border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-white/10">
            <Megaphone className="w-5 h-5 text-[#d0a526]" />
            <h2 className="text-base font-bold text-white">Banner Pengumuman Situs</h2>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Teks Pengumuman (Opsional)
            </label>
            <input
              type="text"
              placeholder="Contoh: Booking musim Umroh Syawal 1447H telah dibuka. Slot terbatas!"
              value={settings.announcementText || ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  announcementText: e.target.value || null,
                })
              }
              className="w-full bg-[#070e1a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d0a526]"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              Kosongkan jika tidak ingin menampilkan banner informasi di bagian atas halaman publik.
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#d0a526] to-[#b3891b] text-[#070e1a] text-xs font-bold rounded-xl hover:brightness-110 transition-all shadow-lg disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isLoading ? "Menyimpan..." : "Simpan Semua Pengaturan"}</span>
          </button>
        </div>
      </form>

      {/* Media Picker Modal */}
      {activePickerField && (
        <MediaPickerModal
          isOpen={!!activePickerField}
          onClose={() => setActivePickerField(null)}
          title={
            activePickerField === "hero"
              ? "Pilih Foto Latar Belakang Hero Utama"
              : "Pilih Foto Bagian Tentang Kami"
          }
          currentUrl={
            activePickerField === "hero"
              ? settings.heroImageUrl || undefined
              : settings.aboutImageUrl || undefined
          }
          onSelect={(url) => {
            if (activePickerField === "hero") {
              setSettings({ ...settings, heroImageUrl: url });
            } else if (activePickerField === "about") {
              setSettings({ ...settings, aboutImageUrl: url });
            }
          }}
        />
      )}
    </div>
  );
}
