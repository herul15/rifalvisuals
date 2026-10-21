"use client";

import React, { useState } from "react";
import {
  Star,
  CheckCircle2,
  XCircle,
  Trash2,
  Plus,
  Check,
  AlertCircle,
  X,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";

interface TestimonialItem {
  id: string;
  clientName: string;
  originCity: string | null;
  packageTaken: string;
  rating: number;
  comment: string;
  consentGiven: boolean;
  isApproved: boolean;
}

interface TestimonialsManagerProps {
  initialItems: TestimonialItem[];
}

export default function TestimonialsManager({
  initialItems,
}: TestimonialsManagerProps) {
  const [items, setItems] = useState<TestimonialItem[]>(initialItems);
  const [filter, setFilter] = useState<"ALL" | "APPROVED" | "PENDING">("ALL");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [newItem, setNewItem] = useState({
    clientName: "",
    originCity: "",
    packageTaken: "Paket Ka'bah & Pelataran (Sendiri)",
    rating: 5,
    comment: "",
    consentGiven: true,
  });

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const filteredItems = items.filter((item) => {
    if (filter === "APPROVED") return item.isApproved;
    if (filter === "PENDING") return !item.isApproved;
    return true;
  });

  const handleToggleApproved = async (item: TestimonialItem) => {
    setLoadingId(item.id);
    const newStatus = !item.isApproved;
    try {
      const res = await fetch(`/api/admin/testimonials/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved: newStatus }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal mengubah status testimoni.");
      }
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, isApproved: newStatus } : i))
      );
      showNotification(
        "success",
        `Testimoni dari "${item.clientName}" ${
          newStatus ? "disetujui dan tayang di website" : "dinonaktifkan"
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

  const handleDelete = async (item: TestimonialItem) => {
    if (!confirm(`Hapus ulasan dari "${item.clientName}" secara permanen?`)) {
      return;
    }
    setLoadingId(item.id);
    try {
      const res = await fetch(`/api/admin/testimonials/${item.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal menghapus testimoni.");
      }
      setItems((prev) => prev.filter((i) => i.id !== item.id));
      showNotification(
        "success",
        `Testimoni dari "${item.clientName}" berhasil dihapus.`
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

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal menyimpan testimoni.");
      }
      setItems((prev) => [data.data, ...prev]);
      setIsAddModalOpen(false);
      setNewItem({
        clientName: "",
        originCity: "",
        packageTaken: "Paket Ka'bah & Pelataran (Sendiri)",
        rating: 5,
        comment: "",
        consentGiven: true,
      });
      showNotification("success", "Testimoni jamaah berhasil ditambahkan.");
    } catch (err: unknown) {
      showNotification(
        "error",
        err instanceof Error ? err.message : "Terjadi kesalahan sistem."
      );
    }
  };

  return (
    <div className="space-y-6">
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

      {/* Action Header & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0b1626] border border-white/10 rounded-2xl p-4">
        <div className="flex items-center gap-2">
          {[
            { id: "ALL", label: "Semua Testimoni" },
            { id: "APPROVED", label: "Tayang (Disetujui)" },
            { id: "PENDING", label: "Menunggu / Nonaktif" },
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id as "ALL" | "APPROVED" | "PENDING")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === f.id
                  ? "bg-[#1e3a5f] text-[#d0a526] font-semibold border border-[#d0a526]/30"
                  : "text-slate-300 hover:bg-white/5 border border-white/5"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-[#d0a526] to-[#b3891b] text-[#070e1a] text-xs font-bold rounded-xl hover:brightness-110 transition-all shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Testimoni Riil</span>
        </button>
      </div>

      {/* Testimonials List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={`bg-[#0b1626] border rounded-2xl p-5 flex flex-col justify-between transition-all ${
              item.isApproved
                ? "border-white/10 hover:border-[#d0a526]/30"
                : "border-red-500/20 bg-red-950/10 opacity-75"
            }`}
          >
            <div className="space-y-3">
              {/* Header: Name, City, Stars */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-white text-sm">
                    {item.clientName}
                  </h3>
                  <div className="text-[11px] text-slate-400">
                    {item.originCity ? `${item.originCity} • ` : ""}
                    <span className="text-[#d0a526]">{item.packageTaken}</span>
                  </div>
                </div>

                <div className="flex items-center gap-0.5">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-3.5 h-3.5 fill-[#d0a526] text-[#d0a526]"
                    />
                  ))}
                </div>
              </div>

              {/* Comment */}
              <p className="text-xs text-slate-300 leading-relaxed italic bg-[#070e1a] p-3 rounded-xl border border-white/5">
                &ldquo;{item.comment}&rdquo;
              </p>

              {/* Consent status badge */}
              <div className="flex items-center gap-2 text-[11px]">
                {item.consentGiven ? (
                  <span className="inline-flex items-center gap-1 text-emerald-400">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Persetujuan Publikasi Sah
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-amber-400">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    Tanpa Persetujuan Publikasi
                  </span>
                )}
              </div>
            </div>

            {/* Actions Bar */}
            <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/5">
              <button
                type="button"
                disabled={loadingId === item.id}
                onClick={() => handleToggleApproved(item)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                  item.isApproved
                    ? "border-emerald-500/30 text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20"
                    : "border-slate-600 text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {item.isApproved ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Tayang di Landing Page</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-3.5 h-3.5 text-slate-400" />
                    <span>Nonaktif (Setujui)</span>
                  </>
                )}
              </button>

              <button
                type="button"
                disabled={loadingId === item.id}
                onClick={() => handleDelete(item)}
                aria-label={`Hapus ulasan ${item.clientName}`}
                className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add Real Testimonial */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0b1626] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white">
                Tambah Testimoni Riil Jamaah
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Nama Jamaah / Keluarga
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Bpk. H. Rahmat & Keluarga"
                  value={newItem.clientName}
                  onChange={(e) =>
                    setNewItem({ ...newItem, clientName: e.target.value })
                  }
                  className="w-full bg-[#070e1a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d0a526]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Kota Asal
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Surabaya"
                    value={newItem.originCity}
                    onChange={(e) =>
                      setNewItem({ ...newItem, originCity: e.target.value })
                    }
                    className="w-full bg-[#070e1a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d0a526]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Rating (Bintang)
                  </label>
                  <select
                    value={newItem.rating}
                    onChange={(e) =>
                      setNewItem({ ...newItem, rating: Number(e.target.value) })
                    }
                    className="w-full bg-[#070e1a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d0a526]"
                  >
                    <option value="5">5 Bintang (Sempurna)</option>
                    <option value="4">4 Bintang (Sangat Baik)</option>
                    <option value="3">3 Bintang (Cukup)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Paket yang Diambil
                </label>
                <input
                  type="text"
                  required
                  value={newItem.packageTaken}
                  onChange={(e) =>
                    setNewItem({ ...newItem, packageTaken: e.target.value })
                  }
                  className="w-full bg-[#070e1a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d0a526]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Ulasan Riil Jamaah
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Tulis ulasan autentik jamaah tanpa rekayasa..."
                  value={newItem.comment}
                  onChange={(e) =>
                    setNewItem({ ...newItem, comment: e.target.value })
                  }
                  className="w-full bg-[#070e1a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d0a526]"
                />
              </div>

              <div className="p-3 bg-[#070e1a] rounded-xl border border-white/5">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={newItem.consentGiven}
                    onChange={(e) =>
                      setNewItem({ ...newItem, consentGiven: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-[#d0a526] focus:ring-0 bg-slate-900 border-white/20"
                  />
                  <span>
                    Jamaah telah menyetujui ulasan ini ditampilkan ke publik
                  </span>
                </label>
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
                  className="px-4 py-2 bg-[#d0a526] text-[#070e1a] text-xs font-bold rounded-xl hover:brightness-110"
                >
                  Simpan Testimoni
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
