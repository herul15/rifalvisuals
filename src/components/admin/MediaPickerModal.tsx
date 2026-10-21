"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X, Search, Check, ImageIcon, RefreshCw, Folder } from "lucide-react";

interface MediaItem {
  id: string;
  filename: string;
  url: string;
  folder: "portfolio" | "hero";
  sizeBytes: number;
}

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  currentUrl?: string;
  title?: string;
}

export default function MediaPickerModal({
  isOpen,
  onClose,
  onSelect,
  currentUrl,
  title = "Pilih Aset Foto dari Galeri Resmi",
}: MediaPickerModalProps) {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFolder, setActiveFolder] = useState<"ALL" | "portfolio" | "hero">("ALL");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState<string>(currentUrl || "");
  const [customUrlInput, setCustomUrlInput] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchMedia();
      setSelectedUrl(currentUrl || "");
    }
  }, [isOpen, currentUrl]);

  const fetchMedia = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/media");
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setMediaList(data.data);
      }
    } catch (err) {
      console.error("Gagal memuat daftar media:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const filteredMedia = mediaList.filter((item) => {
    const matchesFolder = activeFolder === "ALL" || item.folder === activeFolder;
    const matchesQuery = item.filename.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFolder && matchesQuery;
  });

  const handleConfirm = () => {
    const targetUrl = customUrlInput.trim() || selectedUrl;
    if (targetUrl) {
      onSelect(targetUrl);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0b1626] border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#070e1a]">
          <div>
            <h3 className="text-base font-bold font-display text-white flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-[#d0a526]" />
              <span>{title}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Pilih dari {mediaList.length} foto dokumentasi resmi Tanah Suci yang tersimpan di server.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 bg-[#0b1626]">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama file (misal: IMG_2103, hero-makkah)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#070e1a] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#d0a526]"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setActiveFolder("ALL")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeFolder === "ALL"
                  ? "bg-[#1e3a5f] text-white border border-[#d0a526]/40"
                  : "bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
            >
              Semua ({mediaList.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveFolder("portfolio")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeFolder === "portfolio"
                  ? "bg-[#1e3a5f] text-white border border-[#d0a526]/40"
                  : "bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
            >
              Portofolio ({mediaList.filter((m) => m.folder === "portfolio").length})
            </button>
            <button
              type="button"
              onClick={() => setActiveFolder("hero")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeFolder === "hero"
                  ? "bg-[#1e3a5f] text-white border border-[#d0a526]/40"
                  : "bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
            >
              Banner Hero ({mediaList.filter((m) => m.folder === "hero").length})
            </button>
            <button
              type="button"
              onClick={fetchMedia}
              title="Muat ulang media"
              className="p-2 rounded-lg bg-white/5 text-slate-300 hover:bg-white/10"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Media Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 min-h-[360px] max-h-[500px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400">
              <RefreshCw className="w-8 h-8 animate-spin text-[#d0a526] mb-2" />
              <p className="text-xs">Memuat daftar galeri foto...</p>
            </div>
          ) : filteredMedia.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400">
              <ImageIcon className="w-10 h-10 text-slate-600 mb-2" />
              <p className="text-sm font-medium">Tidak ada foto yang cocok.</p>
              <p className="text-xs text-slate-500 mt-1">Coba gunakan kata kunci pencarian lain.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {filteredMedia.map((item) => {
                const isSelected = selectedUrl === item.url;
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSelectedUrl(item.url);
                      setCustomUrlInput("");
                    }}
                    className={`group relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                      isSelected
                        ? "border-[#d0a526] ring-2 ring-[#d0a526]/50 shadow-lg shadow-[#d0a526]/20 scale-[0.98]"
                        : "border-white/10 hover:border-white/30 bg-slate-900"
                    }`}
                  >
                    <Image
                      src={item.url}
                      alt={item.filename}
                      fill
                      sizes="160px"
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity" />

                    {/* Selected badge checkmark */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#d0a526] text-[#070e1a] flex items-center justify-center shadow-md">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                    )}

                    {/* Bottom file info */}
                    <div className="absolute bottom-1.5 left-2 right-2">
                      <p className="text-[10px] font-medium text-white truncate drop-shadow">
                        {item.filename}
                      </p>
                      <p className="text-[9px] text-slate-300">
                        {item.folder === "hero" ? "Hero Banner" : "Portofolio"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer with Manual URL fallback & Confirmation */}
        <div className="p-4 border-t border-white/10 bg-[#070e1a] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex-1 w-full sm:max-w-md">
            <label className="text-[11px] text-slate-400 block mb-1">
              Atau masukkan path URL gambar khusus:
            </label>
            <input
              type="text"
              placeholder="/images/portfolio/IMG_xxxx.jpeg"
              value={customUrlInput || selectedUrl}
              onChange={(e) => {
                setCustomUrlInput(e.target.value);
                setSelectedUrl(e.target.value);
              }}
              className="w-full bg-[#0b1626] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#d0a526]"
            />
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10"
            >
              Batal
            </button>
            <button
              type="button"
              disabled={!selectedUrl && !customUrlInput}
              onClick={handleConfirm}
              className="px-5 py-2 rounded-xl text-xs font-bold text-[#070e1a] bg-gradient-to-r from-[#dfb73d] via-[#d0a526] to-[#b8901e] hover:brightness-110 shadow-md shadow-[#d0a526]/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Gunakan Foto Terpilih
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
