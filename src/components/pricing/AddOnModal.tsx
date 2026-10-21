"use client";

import React, { useEffect } from "react";
import { X, PlusCircle, Check } from "lucide-react";
import { formatRupiah } from "@/lib/whatsapp";

export interface AddOnItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  unitLabel: string;
  applicableLocations: string;
}

interface AddOnModalProps {
  isOpen: boolean;
  onClose: () => void;
  addOns: AddOnItem[];
  currentLocation: string; // e.g. "MAKKAH_HARAM", "MAKKAH_JABAL", "MADINAH_NABAWI"
  selectedAddOnSlugs: string[];
  onToggleAddOn: (slug: string) => void;
}

export default function AddOnModal({
  isOpen,
  onClose,
  addOns,
  currentLocation,
  selectedAddOnSlugs,
  onToggleAddOn,
}: AddOnModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Filter add-ons applicable to current location
  const applicableAddOns = addOns.filter((addon) => {
    const locs = addon.applicableLocations.split(",").map((l) => l.trim());
    return locs.includes(currentLocation) || locs.includes("ALL");
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="addon-modal-title"
    >
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-[#fbfbf9]">
          <div>
            <h3
              id="addon-modal-title"
              className="font-display text-xl font-bold text-[#0f172a]"
            >
              Layanan Tambahan (Add-ons)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Sesuaikan dokumentasi Anda dengan layanan tambahan resmi
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[#d0a526]"
            aria-label="Tutup dialog layanan tambahan"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-4 divide-y divide-slate-100">
          {applicableAddOns.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-4">
              Tidak ada layanan tambahan khusus untuk lokasi ini.
            </p>
          ) : (
            applicableAddOns.map((addon) => {
              const isSelected = selectedAddOnSlugs.includes(addon.slug);
              return (
                <div
                  key={addon.id}
                  className="pt-4 first:pt-0 flex items-start justify-between gap-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-[#0f172a]">
                        {addon.name}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {addon.description}
                    </p>
                    <div className="mt-1.5 flex items-baseline gap-1.5">
                      <span className="font-display font-bold text-sm text-[#1e3a5f]">
                        {formatRupiah(addon.price)}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        / {addon.unitLabel}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onToggleAddOn(addon.slug)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isSelected
                        ? "bg-[#1e3a5f] text-white shadow-sm"
                        : "bg-[#fbf4de] text-[#8c6d12] hover:bg-[#d0a526] hover:text-[#0a0f18]"
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Dipilih</span>
                      </>
                    ) : (
                      <>
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>Pilih</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-[#fbfbf9] border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            {selectedAddOnSlugs.length} layanan tambahan dipilih
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-[#0a0f18] bg-[#d0a526] hover:bg-[#b8901e] transition-colors"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
}
