"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Edit2,
  Check,
  X,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  MapPin,
  Camera,
  ImageIcon,
} from "lucide-react";
import { formatRupiah } from "@/lib/whatsapp";
import MediaPickerModal from "@/components/admin/MediaPickerModal";

interface Variant {
  id: string;
  participantType: string;
  label: string;
  price: number;
  durationMinutes: number;
  editedPhotosCount: number;
  reelsDurationSec: number;
  isBestSeller: boolean;
}

interface PackageItem {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  imageUrl: string | null;
  isActive: boolean;
  category: {
    name: string;
    location: string;
  };
  variants: Variant[];
}

interface PackagesManagerProps {
  initialPackages: PackageItem[];
}

export default function PackagesManager({
  initialPackages,
}: PackagesManagerProps) {
  const [packages, setPackages] = useState<PackageItem[]>(initialPackages);
  const [editingVariant, setEditingVariant] = useState<{
    packageId: string;
    variantId: string;
    name: string;
    label: string;
    currentPrice: number;
    newPrice: number;
  } | null>(null);

  const [pickerPackageId, setPickerPackageId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleUpdatePackageImage = async (packageId: string, newImageUrl: string) => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/admin/packages/${packageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: newImageUrl }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal memperbarui foto paket.");
      }

      setPackages((prev) =>
        prev.map((p) => (p.id === packageId ? { ...p, imageUrl: newImageUrl } : p))
      );
      setNotification({
        type: "success",
        message: "Foto sampul paket berhasil diperbarui dan disinkronkan ke landing page.",
      });
    } catch (err: unknown) {
      setNotification({
        type: "error",
        message: err instanceof Error ? err.message : "Terjadi kesalahan sistem.",
      });
    } finally {
      setIsLoading(false);
      setPickerPackageId(null);
    }
  };

  const handleToggleActive = async (packageId: string, currentStatus: boolean) => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/admin/packages/${packageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setNotification({
          type: "error",
          message: data.error || "Gagal mengubah status paket.",
        });
        setIsLoading(false);
        return;
      }

      setPackages((prev) =>
        prev.map((p) => (p.id === packageId ? { ...p, isActive: !currentStatus } : p))
      );
      setNotification({
        type: "success",
        message: `Status paket berhasil diubah menjadi ${
          !currentStatus ? "Aktif" : "Nonaktif"
        }.`,
      });
      setIsLoading(false);
    } catch {
      setNotification({
        type: "error",
        message: "Kendala koneksi ke server saat mengubah status.",
      });
      setIsLoading(false);
    }
  };

  const handleSavePrice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVariant) return;

    try {
      setIsLoading(true);
      const res = await fetch(`/api/admin/packages/${editingVariant.packageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          variantUpdates: [
            {
              variantId: editingVariant.variantId,
              price: editingVariant.newPrice,
            },
          ],
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setNotification({
          type: "error",
          message: data.error || "Gagal memperbarui harga paket.",
        });
        setIsLoading(false);
        return;
      }

      // Update local state
      setPackages((prev) =>
        prev.map((p) => {
          if (p.id !== editingVariant.packageId) return p;
          return {
            ...p,
            variants: p.variants.map((v) =>
              v.id === editingVariant.variantId
                ? { ...v, price: editingVariant.newPrice }
                : v
            ),
          };
        })
      );

      setNotification({
        type: "success",
        message: `Harga ${editingVariant.name} (${editingVariant.label}) berhasil diperbarui menjadi ${formatRupiah(
          editingVariant.newPrice
        )}.`,
      });
      setEditingVariant(null);
      setIsLoading(false);
    } catch {
      setNotification({
        type: "error",
        message: "Terjadi kesalahan saat menyimpan harga.",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Manajemen Paket & Harga
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Ubah harga varian paket, perbarui durasi, atau aktifkan/nonaktifkan paket.
          Setiap perubahan harga tercatat dalam Log Audit secara otomatis.
        </p>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center justify-between gap-3 animate-in fade-in ${
            notification.type === "success"
              ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
              : "bg-red-500/10 border border-red-500/30 text-red-400"
          }`}
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{notification.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotification(null)}
            className="p-1 hover:opacity-75 focus:outline-none"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Packages Table List */}
      <div className="space-y-6">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className={`p-6 rounded-2xl bg-[#0f1d30] border transition-all ${
              pkg.isActive ? "border-white/10" : "border-red-500/20 opacity-75"
            }`}
          >
            {/* Package Card Top */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div className="flex items-start sm:items-center gap-4">
                {/* Package Thumbnail with Change Photo Trigger */}
                <div className="relative w-24 h-18 sm:w-28 sm:h-20 rounded-xl overflow-hidden bg-slate-800 border border-white/10 flex-shrink-0 group">
                  <Image
                    src={
                      pkg.imageUrl ||
                      (pkg.category.location.includes("JABAL")
                        ? "/images/hero/hero-jabal.jpeg"
                        : pkg.category.location.includes("MADINAH")
                        ? "/images/hero/hero-nabawi.jpeg"
                        : "/images/hero/hero-makkah.jpeg")
                    }
                    alt={pkg.name}
                    fill
                    sizes="112px"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => setPickerPackageId(pkg.id)}
                      className="px-2 py-1 rounded-lg bg-[#d0a526] text-[#070e1a] text-[10px] font-bold flex items-center gap-1 shadow"
                    >
                      <Camera className="w-3 h-3" />
                      <span>Ubah</span>
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="font-display font-bold text-lg text-white">
                      {pkg.name}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#d0a526] bg-[#d0a526]/10 px-2.5 py-0.5 rounded-full">
                      <MapPin className="w-3 h-3" />
                      <span>{pkg.category.name}</span>
                    </span>
                  </div>
                  {pkg.tagline && (
                    <p className="text-xs text-slate-400 mt-1">{pkg.tagline}</p>
                  )}
                  <button
                    type="button"
                    onClick={() => setPickerPackageId(pkg.id)}
                    className="mt-2 inline-flex items-center gap-1.5 text-xs text-[#d0a526] hover:underline font-medium"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>{pkg.imageUrl ? "Ganti Foto Sampul" : "Pilih Foto Sampul"}</span>
                  </button>
                </div>
              </div>

              {/* Toggle Active Button */}
              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleToggleActive(pkg.id, pkg.isActive)}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                  pkg.isActive
                    ? "bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25"
                    : "bg-red-500/15 text-red-400 hover:bg-red-500/25"
                }`}
              >
                {pkg.isActive ? (
                  <>
                    <ToggleRight className="w-4 h-4 text-emerald-400" />
                    <span>Paket Aktif (Tampil di Web)</span>
                  </>
                ) : (
                  <>
                    <ToggleLeft className="w-4 h-4 text-red-400" />
                    <span>Paket Nonaktif (Tersembunyi)</span>
                  </>
                )}
              </button>
            </div>

            {/* Variants List */}
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-slate-400 border-b border-white/5">
                    <th className="py-2.5 font-medium">Varian Peserta</th>
                    <th className="py-2.5 font-medium">Durasi Hunting</th>
                    <th className="py-2.5 font-medium">Foto Edit</th>
                    <th className="py-2.5 font-medium">Harga Resmi</th>
                    <th className="py-2.5 font-medium text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-200">
                  {pkg.variants.map((v) => (
                    <tr key={v.id} className="hover:bg-white/[0.02]">
                      <td className="py-3 font-semibold text-white">
                        <div className="flex items-center gap-2">
                          <span>{v.label}</span>
                          {v.isBestSeller && (
                            <span className="text-[10px] text-[#0a0f18] bg-[#d0a526] font-bold px-2 py-0.5 rounded">
                              Best Seller
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 text-slate-400">
                        {v.durationMinutes} Menit
                      </td>
                      <td className="py-3 text-slate-400">
                        {v.editedPhotosCount} Foto
                      </td>
                      <td className="py-3 font-display font-bold text-[#d0a526] text-sm">
                        {formatRupiah(v.price)}
                      </td>
                      <td className="py-3 text-right">
                        <button
                          type="button"
                          onClick={() =>
                            setEditingVariant({
                              packageId: pkg.id,
                              variantId: v.id,
                              name: pkg.name,
                              label: v.label,
                              currentPrice: v.price,
                              newPrice: v.price,
                            })
                          }
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-200 hover:text-white transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-[#d0a526]" />
                          <span>Ubah Harga</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Price Modal Dialog */}
      {editingVariant && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md bg-[#0f1d30] border border-white/15 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
              <div>
                <h3 className="font-display font-bold text-lg text-white">
                  Ubah Harga Varian Paket
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {editingVariant.name} · {editingVariant.label}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingVariant(null)}
                className="text-slate-400 hover:text-white p-1 rounded focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePrice} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Harga Saat Ini
                </label>
                <p className="text-base font-display font-bold text-slate-400">
                  {formatRupiah(editingVariant.currentPrice)}
                </p>
              </div>

              <div>
                <label
                  htmlFor="newPrice"
                  className="block text-xs font-semibold text-[#d0a526] uppercase tracking-wider mb-2"
                >
                  Harga Baru (Integer Rupiah)
                </label>
                <div className="relative rounded-xl">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 text-sm font-semibold pointer-events-none">
                    Rp
                  </span>
                  <input
                    id="newPrice"
                    type="number"
                    step="500"
                    min="100000"
                    required
                    value={editingVariant.newPrice}
                    onChange={(e) =>
                      setEditingVariant({
                        ...editingVariant,
                        newPrice: parseInt(e.target.value) || 0,
                      })
                    }
                    className="block w-full pl-11 pr-4 py-3 bg-[#16273d] border border-white/10 rounded-xl text-white font-bold font-display text-lg focus:outline-none focus:ring-2 focus:ring-[#d0a526]"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Pratinjau: {formatRupiah(editingVariant.newPrice)}
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingVariant(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-[#0a0f18] bg-[#d0a526] hover:bg-[#b8901e] transition-colors disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Media Picker Modal for Package Covers */}
      {pickerPackageId && (
        <MediaPickerModal
          isOpen={!!pickerPackageId}
          onClose={() => setPickerPackageId(null)}
          title="Pilih Foto Sampul Paket Resmi"
          currentUrl={
            packages.find((p) => p.id === pickerPackageId)?.imageUrl || undefined
          }
          onSelect={(url) => {
            if (pickerPackageId) {
              handleUpdatePackageImage(pickerPackageId, url);
            }
          }}
        />
      )}
    </div>
  );
}
