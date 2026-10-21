"use client";

import React, { useState } from "react";
import Image from "next/image";
import { MapPin, Maximize2, ShieldCheck } from "lucide-react";
import ImageLightbox, { GalleryItem } from "@/components/gallery/ImageLightbox";

interface PortfolioSectionProps {
  initialItems?: GalleryItem[];
}

export default function PortfolioSection({
  initialItems = [],
}: PortfolioSectionProps) {
  // Built-in curated authentic photos from Tanah Suci
  const defaultItems: GalleryItem[] = [
    {
      id: "p1",
      title: "Khidmat di Hadapan Ka'bah",
      location: "MEKKAH",
      mediaUrl: "/images/hero/hero-makkah.jpeg",
      caption: "Momen kekhidmatan jamaah dalam melantunkan munajat di hadapan Baitullah.",
    },
    {
      id: "p2",
      title: "Kesejukan Masjid Nabawi",
      location: "MADINAH",
      mediaUrl: "/images/hero/hero-nabawi.jpeg",
      caption: "Pelataran luas berpayung megah dengan pencahayaan fajar yang menenteramkan.",
    },
    {
      id: "p3",
      title: "Panorama Jabal Khandamah",
      location: "JABAL",
      mediaUrl: "/images/hero/hero-jabal.jpeg",
      caption: "Pemandangan magis kota suci Mekkah dari ketinggian puncak Khandamah.",
    },
    {
      id: "p4",
      title: "Kehangatan Ibadah Jamaah",
      location: "MEKKAH",
      mediaUrl: "/images/hero/about-rifal.jpeg",
      caption: "Mendampingi langkah ibadah jamaah tercinta tanpa rasa lelah.",
    },
    {
      id: "p5",
      title: "Sudut Megah Menara Jam",
      location: "MEKKAH",
      mediaUrl: "/images/portfolio/IMG_2103.jpeg",
      caption: "Kemegahan arsitektur modern berpadu kesucian tempat ibadah.",
    },
    {
      id: "p6",
      title: "Ketenangan Gerbang Nabawi",
      location: "MADINAH",
      mediaUrl: "/images/portfolio/IMG_4841.jpeg",
      caption: "Keagungan pintu Masjid Nabawi dan langkah lembut para peziarah makam Rasulullah SAW.",
    },
    {
      id: "p7",
      title: "Tawaf Syahdu Pelataran Ka'bah",
      location: "MEKKAH",
      mediaUrl: "/images/portfolio/IMG_1951.jpeg",
      caption: "Sudut pengambilan candid jamaah saat bertawaf mengelilingi Ka'bah yang mulia.",
    },
    {
      id: "p8",
      title: "Panorama Perbukitan Kudai",
      location: "JABAL",
      mediaUrl: "/images/portfolio/IMG_1339.jpeg",
      caption: "Sesi dokumentasi santai dengan latar belakang lanskap perbukitan kota suci.",
    },
    {
      id: "p9",
      title: "Arsitektur Megah Masjidil Haram",
      location: "MEKKAH",
      mediaUrl: "/images/portfolio/IMG_3562.jpeg",
      caption: "Detail pilar-pilar agung dan kemilau marmer putih Masjidil Haram.",
    },
    {
      id: "p10",
      title: "Pelataran Payung Madinah",
      location: "MADINAH",
      mediaUrl: "/images/portfolio/IMG_4629.jpeg",
      caption: "Kesejukan semilir angin di bawah naungan payung raksasa Masjid Nabawi.",
    },
    {
      id: "p11",
      title: "Puncak Menawan Khandamah",
      location: "JABAL",
      mediaUrl: "/images/portfolio/IMG_9650.jpeg",
      caption: "Sudut pandang tertinggi memandang Masjidil Haram saat matahari terbenam.",
    },
    {
      id: "p12",
      title: "Doa Syahdu Bersama Pasangan",
      location: "MEKKAH",
      mediaUrl: "/images/portfolio/IMG_6567.jpeg",
      caption: "Kebersamaan suami istri memanjatkan harapan terbaik di Tanah Suci.",
    },
  ];

  const allItems = initialItems.length > 0 ? initialItems : defaultItems;

  const [activeFilter, setActiveFilter] = useState<string>("ALL");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filterOptions = [
    { label: "Semua Dokumentasi", value: "ALL" },
    { label: "Mekkah (Haram)", value: "MEKKAH" },
    { label: "Madinah (Nabawi)", value: "MADINAH" },
    { label: "Jabal Series", value: "JABAL" },
  ];

  const filteredItems =
    activeFilter === "ALL"
      ? allItems
      : allItems.filter(
          (item) => item.location.toUpperCase() === activeFilter.toUpperCase()
        );

  return (
    <section id="portfolio" className="py-20 lg:py-28 bg-[#fbfbf9] text-[#0f172a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs sm:text-sm font-semibold tracking-wider text-[#b8901e] uppercase block mb-2">
            Galeri Portofolio
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#0f172a]">
            Kisah Visual Nyata dari Tanah Suci
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            100% foto dan video asli yang diambil langsung oleh tim Rifalvisuals.
            Setiap karya visual dirawat dengan sentuhan warna yang menenangkan jiwa.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {filterOptions.map((opt) => {
            const isActive = activeFilter === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setActiveFilter(opt.value)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-[#1e3a5f] text-white shadow-sm"
                    : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              onClick={() => setLightboxIndex(index)}
              className="group relative aspect-[4/5] rounded-2xl overflow-hidden bg-slate-900 cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setLightboxIndex(index);
                }
              }}
              aria-label={`Buka foto: ${item.title}`}
            >
              <Image
                src={item.mediaUrl}
                alt={item.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
              />

              {/* Gradient Overlay for Text Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              {/* Top Authority & Location Badge */}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-black/60 backdrop-blur-md text-white border border-white/20">
                  <MapPin className="w-3 h-3 text-[#d0a526]" />
                  {item.location}
                </span>
              </div>

              {/* Consent Protection Pill */}
              <div className="absolute top-4 right-4">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#1e3a5f]/80 backdrop-blur-md text-[#d0a526] border border-[#d0a526]/30">
                  <ShieldCheck className="w-3 h-3 text-[#d0a526]" />
                  Verified
                </span>
              </div>

              {/* Bottom Details */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform transition-transform duration-300">
                <h3 className="font-display text-lg font-bold group-hover:text-[#d0a526] transition-colors">
                  {item.title}
                </h3>
                {item.caption && (
                  <p className="mt-1 text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {item.caption}
                  </p>
                )}

                <div className="mt-3 flex items-center gap-1.5 text-xs text-[#d0a526] font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Lihat Foto Resolusi Penuh</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fullscreen Accessible Lightbox */}
      {lightboxIndex !== null && (
        <ImageLightbox
          isOpen={lightboxIndex !== null}
          items={filteredItems}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={(idx) => setLightboxIndex(idx)}
        />
      )}
    </section>
  );
}
