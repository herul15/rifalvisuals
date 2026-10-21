"use client";

import React, { useState } from "react";
import { MapPin, Users, Info } from "lucide-react";
import PackageCard, { PackageData } from "@/components/pricing/PackageCard";
import AddOnModal, { AddOnItem } from "@/components/pricing/AddOnModal";

export interface CategoryData {
  id: string;
  slug: string;
  name: string;
  location: string;
  description: string;
  packages: PackageData[];
}

interface PricingSectionProps {
  categories: CategoryData[];
  addOns: AddOnItem[];
  whatsappNumber?: string;
}

export default function PricingSection({
  categories,
  addOns,
  whatsappNumber = "62881080522136",
}: PricingSectionProps) {
  // Active Category Slug
  const [activeCategorySlug, setActiveCategorySlug] = useState<string>(
    categories[0]?.slug || "makkah-haram"
  );

  // Active Participant Filter
  const [participantFilter, setParticipantFilter] = useState<string>("ALL");

  // AddOn Modal State
  const [isAddOnModalOpen, setIsAddOnModalOpen] = useState(false);
  const [selectedAddOnSlugs, setSelectedAddOnSlugs] = useState<string[]>([]);

  // Find currently active category
  const activeCategory =
    categories.find((c) => c.slug === activeCategorySlug) || categories[0];

  const handleToggleAddOn = (slug: string) => {
    setSelectedAddOnSlugs((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  // Participant filter options
  const participantOptions = [
    { label: "Semua Varian", value: "ALL" },
    { label: "Sendiri (Solo)", value: "SENDIRI" },
    { label: "Berdua (Pasangan)", value: "BERDUA" },
    { label: "Keluarga (7 orang)", value: "KELUARGA" },
  ];

  return (
    <section id="pricing" className="py-20 lg:py-28 bg-[#f8f7f3] text-[#0f172a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs sm:text-sm font-semibold tracking-wider text-[#b8901e] uppercase block mb-2">
            Pricelist Resmi Rifalvisuals
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#0f172a]">
            Katalog Paket Dokumentasi Umroh & Haji
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Transparan, tanpa biaya tersembunyi. Seluruh varian mencakup file mentah
            tanpa batas, foto pilihan yang diedit estetik, dan video Reels siap tayang.
          </p>
        </div>

        {/* Location Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8">
          {categories.map((cat) => {
            const isActive = cat.slug === activeCategorySlug;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setActiveCategorySlug(cat.slug);
                }}
                className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-[#1e3a5f] text-white shadow-md shadow-[#1e3a5f]/20 scale-102"
                    : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                <MapPin
                  className={`w-4 h-4 ${
                    isActive ? "text-[#d0a526]" : "text-slate-400"
                  }`}
                />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Participant Type Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          <div className="inline-flex items-center gap-1.5 p-1 rounded-xl bg-white border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-400 px-2 hidden sm:inline flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              <span>Filter Peserta:</span>
            </span>
            {participantOptions.map((opt) => {
              const isSelected = participantFilter === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setParticipantFilter(opt.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    isSelected
                      ? "bg-[#d0a526] text-[#0a0f18] shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Category Description Banner */}
        {activeCategory && (
          <div className="max-w-2xl mx-auto mb-10 p-4 rounded-xl bg-white/70 border border-slate-200/60 text-center flex items-center justify-center gap-2 text-xs sm:text-sm text-slate-600">
            <Info className="w-4 h-4 text-[#1e3a5f] flex-shrink-0" />
            <span>{activeCategory.description}</span>
          </div>
        )}

        {/* Package Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {activeCategory?.packages.map((pkg) => (
            <PackageCard
              key={pkg.id}
              pkg={pkg}
              locationName={activeCategory.name}
              selectedParticipantFilter={participantFilter}
              whatsappNumber={whatsappNumber}
              onOpenAddOns={() => setIsAddOnModalOpen(true)}
              selectedAddOns={selectedAddOnSlugs}
            />
          ))}
        </div>

        {/* Bottom Booking Notice */}
        <div className="mt-16 text-center max-w-xl mx-auto">
          <p className="text-xs text-slate-500 leading-relaxed">
            * Seluruh harga dalam Rupiah resmi. Uang muka (DP) 50% untuk penguncian
            jadwal fotografer dan pelunasan 100% maksimal H-1 sesi pemotretan.
          </p>
        </div>
      </div>

      {/* AddOn Modal */}
      <AddOnModal
        isOpen={isAddOnModalOpen}
        onClose={() => setIsAddOnModalOpen(false)}
        addOns={addOns}
        currentLocation={activeCategory?.location || "MAKKAH_HARAM"}
        selectedAddOnSlugs={selectedAddOnSlugs}
        onToggleAddOn={handleToggleAddOn}
      />
    </section>
  );
}
