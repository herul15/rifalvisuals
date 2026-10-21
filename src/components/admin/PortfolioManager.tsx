"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  ShieldCheck,
  ShieldAlert,
  Eye,
  EyeOff,
  Trash2,
  Plus,
  Check,
  AlertCircle,
  MapPin,
  X,
  Edit2,
  Camera,
  ImageIcon,
} from "lucide-react";
import MediaPickerModal from "@/components/admin/MediaPickerModal";

interface PortfolioItem {
  id: string;
  title: string;
  location: string;
  mediaType: string;
  mediaUrl: string;
  caption: string | null;
  clientConsent: boolean;
  isFeatured: boolean;
  isActive: boolean;
}

interface PortfolioManagerProps {
  initialItems: PortfolioItem[];
}

export default function PortfolioManager({
  initialItems,
}: PortfolioManagerProps) {
  const [items, setItems] = useState<PortfolioItem[]>(initialItems);
  const [selectedLocation, setSelectedLocation] = useState<string>("ALL");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [mediaPickerTarget, setMediaPickerTarget] = useState<"NEW" | "EDIT">("NEW");

  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // New item form state
  const [newItem, setNewItem] = useState({
    title: "",
    location: "MEKKAH",
    mediaUrl: "/images/hero/hero-makkah.jpeg",
    caption: "",
    clientConsent: true,
    isFeatured: false,
  });

  const filteredItems = items.filter((item) => {
    if (selectedLocation === "ALL") return true;
    return item.location.toUpperCase() === selectedLocation.toUpperCase();
  });

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleToggleConsent = async (item: PortfolioItem) => {
    setLoadingId(item.id);
    const newConsent = !item.clientConsent;
    try {
      const res = await fetch(`/api/admin/portfolio/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientConsent: newConsent }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal memperbarui izin persetujuan.");
      }
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, clientConsent: newConsent } : i))
      );
      showNotification(
        "success",
        `Status izin media "${item.title}" diubah menjadi: ${
          newConsent ? "Diizinkan (Consent Aktif)" : "Privat (Tanpa Izin)"
        }.`
      );
    } catch (err: unknown) {
      showNotification(
        "error",
        err instanceof Error ? err.message : "Terjadi kesalahan sistem."
      );
    } finally {
      setLoadingId(null);
    }
  };

  const handleToggleActive = async (item: PortfolioItem) => {
    setLoadingId(item.id);
    const newActive = !item.isActive;
    try {
      const res = await fetch(`/api/admin/portfolio/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: newActive }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal mengubah status publikasi.");
      }
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, isActive: newActive } : i))
      );
      showNotification(
        "success",
        `Foto "${item.title}" sekarang ${newActive ? "TAYANG" : "DISEMBUNYIKAN"} di landing page.`
      );
    } catch (err: unknown) {
      showNotification(
        "error",
        err instanceof Error ? err.message : "Terjadi kesalahan sistem."
      );
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (item: PortfolioItem) => {
    if (!confirm(`Hapus foto "${item.title}" dari galeri portofolio?`)) return;

    setLoadingId(item.id);
    try {
      const res = await fetch(`/api/admin/portfolio/${item.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal menghapus item portofolio.");
      }
      setItems((prev) => prev.filter((i) => i.id !== item.id));
      showNotification("success", `Media "${item.title}" berhasil dihapus.`);
    } catch (err: unknown) {
      showNotification(
        "error",
        err instanceof Error ? err.message : "Terjadi kesalahan sistem."
      );
    } finally {
      setLoadingId(null);
    }
  };

  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal menambahkan item portofolio.");
      }

      setItems((prev) => [data.data, ...prev]);
      setIsAddModalOpen(false);
      setNewItem({
        title: "",
        location: "MEKKAH",
        mediaUrl: "/images/hero/hero-makkah.jpeg",
        caption: "",
        clientConsent: true,
        isFeatured: false,
      });
      showNotification("success", "Foto portofolio baru berhasil ditambahkan.");
    } catch (err: unknown) {
      showNotification(
        "error",
        err instanceof Error ? err.message : "Terjadi kesalahan sistem."
      );
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    setLoadingId(editingItem.id);
    try {
      const res = await fetch(`/api/admin/portfolio/${editingItem.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editingItem.title,
          location: editingItem.location,
          mediaUrl: editingItem.mediaUrl,
          caption: editingItem.caption,
          clientConsent: editingItem.clientConsent,
          isFeatured: editingItem.isFeatured,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal memperbarui item portofolio.");
      }

      setItems((prev) =>
        prev.map((i) => (i.id === editingItem.id ? { ...i, ...editingItem } : i))
      );
      showNotification("success", `Item portofolio "${editingItem.title}" berhasil diperbarui.`);
      setEditingItem(null);
    } catch (err: unknown) {
      showNotification(
        "error",
        err instanceof Error ? err.message : "Terjadi kesalahan sistem."
      );
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center justify-between gap-3 animate-in fade-in ${
            notification.type === "success"
              ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
              : "bg-red-500/10 border border-red-500/30 text-red-400"
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === "success" ? (
              <Check className="w-4 h-4 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
            )}
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

      {/* Top Filter and Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#0f1d30] border border-white/10">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 mr-2">Filter Lokasi:</span>
          {["ALL", "MEKKAH", "MADINAH", "JABAL", "AL_ULA"].map((loc) => (
            <button
              key={loc}
              type="button"
              onClick={() => setSelectedLocation(loc)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedLocation === loc
                  ? "bg-[#1e3a5f] text-white border border-[#d0a526]/50 shadow-sm"
                  : "bg-white/5 text-slate-400 hover:text-white"
              }`}
            >
              {loc === "ALL"
                ? "Semua"
                : loc === "MEKKAH"
                ? "Mekkah"
                : loc === "MADINAH"
                ? "Madinah"
                : loc === "JABAL"
                ? "Jabal Series"
                : "Al Ula"}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-[#070e1a] bg-gradient-to-r from-[#dfb73d] via-[#d0a526] to-[#b8901e] hover:brightness-110 shadow-md shadow-[#d0a526]/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Foto Baru</span>
        </button>
      </div>

      {/* Gallery Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={`rounded-2xl overflow-hidden bg-[#0f1d30] border flex flex-col justify-between transition-all group ${
              item.isActive ? "border-white/10" : "border-white/5 opacity-60"
            }`}
          >
            {/* Image Preview with Badges */}
            <div className="relative aspect-[4/3] w-full bg-slate-900 overflow-hidden">
              <Image
                src={item.mediaUrl}
                alt={item.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

              {/* Location Badge */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-semibold bg-black/60 backdrop-blur-md text-white border border-white/20">
                  <MapPin className="w-3 h-3 text-[#d0a526]" />
                  <span>{item.location}</span>
                </span>
              </div>

              {/* Consent Badge */}
              <div className="absolute top-3 right-3">
                {item.clientConsent ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 backdrop-blur-md">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    Consent
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-amber-950/80 text-amber-300 border border-amber-500/30 backdrop-blur-md">
                    <ShieldAlert className="w-3 h-3 text-amber-400" />
                    No Consent
                  </span>
                )}
              </div>

              {/* Title & Caption */}
              <div className="absolute bottom-3 left-3 right-3">
                <h3 className="text-white font-bold text-sm line-clamp-1 drop-shadow">
                  {item.title}
                </h3>
                {item.caption && (
                  <p className="text-slate-300 text-xs line-clamp-1 mt-0.5 opacity-90 drop-shadow">
                    {item.caption}
                  </p>
                )}
              </div>
            </div>

            {/* Controls Bar */}
            <div className="p-3.5 border-t border-white/5 space-y-2.5 bg-[#070e1a]/70">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Izin Publikasi:</span>
                <button
                  type="button"
                  disabled={loadingId === item.id}
                  onClick={() => handleToggleConsent(item)}
                  className={`text-xs font-semibold px-2 py-0.5 rounded transition-colors ${
                    item.clientConsent
                      ? "text-emerald-400 hover:bg-emerald-500/10"
                      : "text-amber-400 hover:bg-amber-500/10"
                  }`}
                >
                  {item.clientConsent ? "Consent OK (Diizinkan)" : "Privat (Klik Ubah)"}
                </button>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/5 gap-2">
                <button
                  type="button"
                  disabled={loadingId === item.id}
                  onClick={() => handleToggleActive(item)}
                  className={`flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-medium py-1 rounded-lg border transition-colors ${
                    item.isActive
                      ? "border-emerald-500/30 text-emerald-300 bg-emerald-500/10"
                      : "border-slate-700 text-slate-400 hover:bg-white/5"
                  }`}
                >
                  {item.isActive ? (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>Tayang</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Sembunyi</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setEditingItem(item)}
                  title="Edit data dan foto"
                  className="p-1.5 text-slate-300 hover:text-[#d0a526] hover:bg-white/5 rounded-lg border border-white/10 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  disabled={loadingId === item.id}
                  onClick={() => handleDelete(item)}
                  title="Hapus foto"
                  className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg border border-white/10 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add New Media */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0b1626] border border-white/10 rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#d0a526]" />
                <span>Tambah Foto Portofolio</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateItem} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Judul Foto / Dokumentasi
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Khidmat Tawaf di Hadapan Ka'bah"
                  value={newItem.title}
                  onChange={(e) =>
                    setNewItem({ ...newItem, title: e.target.value })
                  }
                  className="w-full bg-[#070e1a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d0a526]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Lokasi Pemotretan
                </label>
                <select
                  value={newItem.location}
                  onChange={(e) =>
                    setNewItem({ ...newItem, location: e.target.value })
                  }
                  className="w-full bg-[#070e1a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d0a526]"
                >
                  <option value="MEKKAH">Mekkah (Haram / Thawaf)</option>
                  <option value="MADINAH">Madinah (Masjid Nabawi / Payung)</option>
                  <option value="JABAL">City Tour Jabal (Khandamah / Kudai)</option>
                  <option value="AL_ULA">Al Ula</option>
                </select>
              </div>

              {/* Photo Preview & Selection */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Foto Terpilih:
                </label>
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#070e1a] border border-white/10">
                  <div className="relative w-16 h-14 rounded-lg overflow-hidden bg-slate-900 border border-white/10 flex-shrink-0">
                    <Image
                      src={newItem.mediaUrl}
                      alt="Pratinjau Foto"
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-white truncate">
                      {newItem.mediaUrl}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setMediaPickerTarget("NEW");
                        setIsMediaPickerOpen(true);
                      }}
                      className="mt-1 inline-flex items-center gap-1.5 text-xs text-[#d0a526] hover:underline font-semibold"
                    >
                      <Camera className="w-3 h-3" />
                      <span>Buka Galeri 146+ Foto Asli</span>
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Caption / Keterangan Singkat
                </label>
                <input
                  type="text"
                  placeholder="Keterangan momen spiritual atau sudut pengambilan..."
                  value={newItem.caption}
                  onChange={(e) =>
                    setNewItem({ ...newItem, caption: e.target.value })
                  }
                  className="w-full bg-[#070e1a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d0a526]"
                />
              </div>

              {/* Consent Checkbox */}
              <div className="p-3 bg-[#070e1a] rounded-xl border border-white/5 space-y-1.5">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={newItem.clientConsent}
                    onChange={(e) =>
                      setNewItem({ ...newItem, clientConsent: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-[#d0a526] focus:ring-0 bg-slate-900 border-white/20"
                  />
                  <span>Jamaah telah memberikan persetujuan publikasi (Consent)</span>
                </label>
                <p className="text-[10px] text-slate-400">
                  Foto tanpa izin jamaah akan ditandai privat dan tidak ditampilkan kepada publik demi privasi ibadah.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-300 hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#d0a526] text-[#070e1a] text-xs font-bold rounded-xl hover:brightness-110 shadow"
                >
                  Simpan Media
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Existing Media */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0b1626] border border-white/10 rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-[#d0a526]" />
                <span>Edit Foto Portofolio</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Judul Foto / Dokumentasi
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.title}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, title: e.target.value })
                  }
                  className="w-full bg-[#070e1a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d0a526]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Lokasi Pemotretan
                </label>
                <select
                  value={editingItem.location}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, location: e.target.value })
                  }
                  className="w-full bg-[#070e1a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d0a526]"
                >
                  <option value="MEKKAH">Mekkah (Haram / Thawaf)</option>
                  <option value="MADINAH">Madinah (Masjid Nabawi / Payung)</option>
                  <option value="JABAL">City Tour Jabal (Khandamah / Kudai)</option>
                  <option value="AL_ULA">Al Ula</option>
                </select>
              </div>

              {/* Photo Preview & Change */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Foto Terpilih:
                </label>
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#070e1a] border border-white/10">
                  <div className="relative w-16 h-14 rounded-lg overflow-hidden bg-slate-900 border border-white/10 flex-shrink-0">
                    <Image
                      src={editingItem.mediaUrl}
                      alt="Pratinjau Foto"
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-white truncate">
                      {editingItem.mediaUrl}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setMediaPickerTarget("EDIT");
                        setIsMediaPickerOpen(true);
                      }}
                      className="mt-1 inline-flex items-center gap-1.5 text-xs text-[#d0a526] hover:underline font-semibold"
                    >
                      <Camera className="w-3 h-3" />
                      <span>Ganti dari Galeri 146+ Foto</span>
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Caption / Keterangan Singkat
                </label>
                <input
                  type="text"
                  value={editingItem.caption || ""}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, caption: e.target.value })
                  }
                  className="w-full bg-[#070e1a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d0a526]"
                />
              </div>

              {/* Consent Checkbox */}
              <div className="p-3 bg-[#070e1a] rounded-xl border border-white/5 space-y-1.5">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={editingItem.clientConsent}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        clientConsent: e.target.checked,
                      })
                    }
                    className="w-4 h-4 rounded text-[#d0a526] focus:ring-0 bg-slate-900 border-white/20"
                  />
                  <span>Jamaah telah memberikan persetujuan publikasi (Consent)</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 text-xs text-slate-300 hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loadingId === editingItem.id}
                  className="px-5 py-2 bg-[#d0a526] text-[#070e1a] text-xs font-bold rounded-xl hover:brightness-110 shadow"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Media Picker Modal */}
      {isMediaPickerOpen && (
        <MediaPickerModal
          isOpen={isMediaPickerOpen}
          onClose={() => setIsMediaPickerOpen(false)}
          currentUrl={
            mediaPickerTarget === "EDIT"
              ? editingItem?.mediaUrl
              : newItem.mediaUrl
          }
          onSelect={(selectedUrl) => {
            if (mediaPickerTarget === "EDIT" && editingItem) {
              setEditingItem({ ...editingItem, mediaUrl: selectedUrl });
            } else {
              setNewItem({ ...newItem, mediaUrl: selectedUrl });
            }
          }}
        />
      )}
    </div>
  );
}
