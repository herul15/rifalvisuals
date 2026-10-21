"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Check, Clock, Image as ImageIcon, Film, MessageCircle, Star, Plus } from "lucide-react";
import { formatRupiah, generateWhatsAppUrl } from "@/lib/whatsapp";

export interface VariantData {
  id: string;
  participantType: string; // SENDIRI, BERDUA, KELUARGA
  label: string;
  price: number;
  durationMinutes: number;
  editedPhotosCount: number;
  reelsDurationSec: number;
  benefitsJson: string;
  isBestSeller: boolean;
}

export interface PackageData {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  description: string;
  imageUrl?: string | null;
  isBestSeller: boolean;
  variants: VariantData[];
}

interface PackageCardProps {
  pkg: PackageData;
  locationName: string;
  selectedParticipantFilter?: string; // "ALL", "SENDIRI", "BERDUA", "KELUARGA"
  whatsappNumber: string;
  onOpenAddOns: (packageName: string) => void;
  selectedAddOns?: string[];
}

export default function PackageCard({
  pkg,
  locationName,
  selectedParticipantFilter = "ALL",
  whatsappNumber,
  onOpenAddOns,
  selectedAddOns = [],
}: PackageCardProps) {
  // Determine active variant based on filter or internal selection
  const availableVariants = pkg.variants;

  // Track manual user override
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);

  // Derive active variant: prioritized by filter if specific, otherwise user override, otherwise best seller/first
  const activeVariant =
    (selectedParticipantFilter !== "ALL"
      ? availableVariants.find((v) => v.participantType === selectedParticipantFilter)
      : null) ||
    availableVariants.find((v) => v.id === selectedVariantId) ||
    availableVariants.find((v) => v.isBestSeller) ||
    availableVariants[0];

  if (!activeVariant) return null;

  // Parse benefits
  let benefits: string[] = [];
  try {
    benefits = JSON.parse(activeVariant.benefitsJson);
  } catch {
    benefits = [activeVariant.benefitsJson];
  }

  const isCardBestSeller = pkg.isBestSeller || activeVariant.isBestSeller;

  const handleBookingClick = () => {
    // Record analytics in background
    try {
      fetch("/api/analytics/whatsapp-click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageName: pkg.name,
          variantLabel: activeVariant.label,
          price: activeVariant.price,
          location: locationName,
        }),
      });
    } catch {
      // Ignore background analytics error
    }

    // Generate WhatsApp link
    const waUrl = generateWhatsAppUrl(
      {
        packageName: pkg.name,
        variantLabel: activeVariant.label,
        priceFormatted: formatRupiah(activeVariant.price),
        location: locationName,
        selectedAddOns: selectedAddOns.length > 0 ? selectedAddOns : undefined,
      },
      whatsappNumber
    );

    window.open(waUrl, "_blank", "noopener,noreferrer");
  };

  // Convert duration minutes to friendly format
  const durationText =
    activeVariant.durationMinutes >= 60
      ? `${activeVariant.durationMinutes / 60} Jam Hunting`
      : `${activeVariant.durationMinutes} Menit Hunting`;

const getPackageThumbnail = (slug: string, loc: string) => {
  const s = slug.toLowerCase();
  const l = loc.toLowerCase();
  if (s.includes("jabal") || l.includes("jabal")) {
    return "/images/hero/hero-jabal.jpeg";
  }
  if (
    s.includes("nabawi") ||
    s.includes("madinah") ||
    l.includes("madinah") ||
    l.includes("nabawi")
  ) {
    return "/images/hero/hero-nabawi.jpeg";
  }
  return "/images/hero/hero-makkah.jpeg";
};

  const thumbnailSrc = pkg.imageUrl || getPackageThumbnail(pkg.slug, locationName);

  return (
    <div
      className={`relative rounded-2xl bg-white border flex flex-col justify-between transition-all duration-300 hover:shadow-xl overflow-hidden ${
        isCardBestSeller
          ? "border-[#d0a526] shadow-md shadow-[#d0a526]/10 ring-1 ring-[#d0a526]/30"
          : "border-slate-200/90 shadow-sm"
      }`}
    >
      {/* Best Seller Top Ribbon */}
      {isCardBestSeller && (
        <div className="absolute top-3.5 right-3.5 z-20">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-[#0a0f18] bg-gradient-to-r from-[#dfb73d] via-[#d0a526] to-[#b8901e] shadow-md shadow-[#d0a526]/30 uppercase tracking-wider">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>Pilihan Terfavorit</span>
          </span>
        </div>
      )}

      {/* Package Photo Banner */}
      <div className="relative h-44 w-full overflow-hidden bg-slate-900 group">
        <Image
          src={thumbnailSrc}
          alt={pkg.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
          <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-white/20 backdrop-blur-md text-white border border-white/20">
            {locationName}
          </span>
          <span className="text-[11px] text-amber-300 font-medium flex items-center gap-1 drop-shadow">
            <ImageIcon className="w-3.5 h-3.5" /> 100% Foto Asli
          </span>
        </div>
      </div>

      {/* Card Header & Price */}
      <div className="p-6 sm:p-8 pb-4">
        <div className="mb-4">
          <h3 className="font-display text-2xl font-bold text-[#0f172a] mb-1">
            {pkg.name}
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed min-h-[36px]">
            {pkg.tagline || pkg.description}
          </p>
        </div>

        {/* Variant Participant Selector Pills (if package has multiple variants) */}
        {availableVariants.length > 1 && (
          <div className="mb-6">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Pilihan Peserta:
            </span>
            <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-slate-100/80 border border-slate-200/60">
              {availableVariants.map((v) => {
                const isSelected = v.id === activeVariant.id;
                let shortLabel = "Sendiri";
                if (v.participantType === "BERDUA") shortLabel = "Berdua";
                if (v.participantType === "KELUARGA") shortLabel = "Keluarga (7 org)";

                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelectedVariantId(v.id)}
                    className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-semibold transition-all ${
                      isSelected
                        ? "bg-[#1e3a5f] text-white shadow-sm"
                        : "text-slate-600 hover:text-[#0f172a] hover:bg-white/60"
                    }`}
                  >
                    {shortLabel}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Price Display */}
        <div className="py-4 border-y border-slate-100 flex items-baseline justify-between">
          <div>
            <span className="text-xs font-medium text-slate-400 block mb-0.5">
              Investasi Kenangan:
            </span>
            <span className="font-display text-3xl font-extrabold text-[#1e3a5f] tracking-tight">
              {formatRupiah(activeVariant.price)}
            </span>
          </div>
          <span className="text-xs font-medium text-[#8c6d12] bg-[#fbf4de] px-2.5 py-1 rounded-full">
            {activeVariant.label}
          </span>
        </div>

        {/* Highlight Metrics */}
        <div className="grid grid-cols-3 gap-2 py-4 border-b border-slate-100 text-center">
          <div className="p-2 rounded-lg bg-slate-50">
            <Clock className="w-4 h-4 text-[#1e3a5f] mx-auto mb-1" />
            <span className="text-[11px] font-semibold text-slate-700 block">
              {durationText}
            </span>
          </div>
          <div className="p-2 rounded-lg bg-slate-50">
            <ImageIcon className="w-4 h-4 text-[#1e3a5f] mx-auto mb-1" />
            <span className="text-[11px] font-semibold text-slate-700 block">
              {activeVariant.editedPhotosCount} Foto Edit
            </span>
          </div>
          <div className="p-2 rounded-lg bg-slate-50">
            <Film className="w-4 h-4 text-[#1e3a5f] mx-auto mb-1" />
            <span className="text-[11px] font-semibold text-slate-700 block">
              1 Reels {activeVariant.reelsDurationSec}s
            </span>
          </div>
        </div>

        {/* Benefits Checklist */}
        <div className="pt-4 space-y-2.5">
          <span className="text-xs font-semibold text-slate-700 block">
            Fasilitas Termasuk:
          </span>
          {benefits.map((b, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-600">
              <Check className="w-4 h-4 text-[#d0a526] flex-shrink-0 mt-0.5" />
              <span>{b}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Card Actions & WhatsApp CTA */}
      <div className="p-6 sm:p-8 pt-4 space-y-3">
        <button
          type="button"
          onClick={handleBookingClick}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-[#0a0f18] bg-gradient-to-r from-[#dfb73d] via-[#d0a526] to-[#b8901e] hover:brightness-110 shadow-md shadow-[#d0a526]/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#d0a526]"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Konsultasi Paket Ini</span>
        </button>

        <button
          type="button"
          onClick={() => onOpenAddOns(pkg.name)}
          className="w-full inline-flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-slate-500 hover:text-[#1e3a5f] hover:bg-slate-50 rounded-lg transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Lihat Opsi Layanan Tambahan (Add-ons)</span>
        </button>
      </div>
    </div>
  );
}
