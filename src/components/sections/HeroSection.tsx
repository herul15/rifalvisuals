"use client";

import React from "react";
import Image from "next/image";
import { ArrowDown, MessageCircle, MapPin, ShieldCheck, Camera, Sparkles } from "lucide-react";
import { generateGeneralInquiryUrl } from "@/lib/whatsapp";

interface HeroSectionProps {
  whatsappNumber?: string;
  heroImageUrl?: string | null;
}

export default function HeroSection({
  whatsappNumber = "62881080522136",
  heroImageUrl = "/images/hero/hero-makkah.jpeg",
}: HeroSectionProps) {
  const generalWhatsAppUrl = generateGeneralInquiryUrl(whatsappNumber);
  const bgImage = heroImageUrl || "/images/hero/hero-makkah.jpeg";

  return (
    <section
      id="hero"
      className="relative isolate min-h-[100dvh] flex items-center justify-center overflow-hidden pt-24 pb-16 lg:py-32 bg-[#070e1a] text-white"
    >
      {/* Background Image with Cinematic Dark Scrim */}
      <div className="absolute inset-0 z-0">
        <Image
          src={bgImage}
          alt="Dokumentasi Jamaah Umroh di Depan Ka'bah"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center scale-105 transition-transform duration-1000 ease-out"
        />
        {/* Layered Gradient for Optimal Text Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#070e1a] via-[#070e1a]/70 to-[#070e1a]/80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(208,165,38,0.12)_0%,transparent_70%)]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Location & Authority Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-[#d0a526]/30 text-xs sm:text-sm font-medium text-slate-200 mb-6">
          <MapPin className="w-3.5 h-3.5 text-[#d0a526]" />
          <span>Mekkah · Madinah · Thaif · Al Ula</span>
        </div>

        {/* Cinematic Display Headline */}
        <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white max-w-4xl leading-[1.15] mb-6 drop-shadow-sm">
          Mengabadikan Perjalanan Ibadah,{" "}
          <span className="gold-gradient-text block sm:inline">
            Menjaga Kenangan Selamanya.
          </span>
        </h1>

        {/* Crisp Value Proposition Subtext (Under 25 words) */}
        <p className="font-body text-base sm:text-lg lg:text-xl text-slate-300 max-w-2xl leading-relaxed mb-8">
          Jasa dokumentasi foto dan video sinematik profesional untuk jamaah Umroh
          dan Haji di Tanah Suci dengan pelayanan amanah, santun, dan estetik.
        </p>

        {/* Dual High-Contrast CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-12">
          <a
            href="#pricing"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full text-sm sm:text-base font-semibold text-[#0a0f18] bg-gradient-to-r from-[#dfb73d] via-[#d0a526] to-[#b8901e] hover:brightness-110 shadow-lg shadow-[#d0a526]/25 transition-all duration-200"
          >
            <span>Pilih Paket & Cek Jadwal</span>
            <ArrowDown className="w-4 h-4 animate-bounce" />
          </a>

          <a
            href={generalWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full text-sm sm:text-base font-semibold text-white bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 transition-all duration-200"
          >
            <MessageCircle className="w-4 h-4 text-[#d0a526]" />
            <span>Tanya Admin via WhatsApp</span>
          </a>
        </div>

        {/* Trust & Craft Indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 pt-6 border-t border-white/15 max-w-3xl w-full">
          <div className="flex items-center justify-center gap-2 text-slate-300 text-xs sm:text-sm">
            <ShieldCheck className="w-4 h-4 text-[#d0a526] flex-shrink-0" />
            <span>Layanan Resmi & Terpercaya</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-slate-300 text-xs sm:text-sm">
            <Camera className="w-4 h-4 text-[#d0a526] flex-shrink-0" />
            <span>100% Foto Asli Tanah Suci</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-slate-300 text-xs sm:text-sm">
            <Sparkles className="w-4 h-4 text-[#d0a526] flex-shrink-0" />
            <span>Hasil Selesai 3 Hari Kerja</span>
          </div>
        </div>
      </div>
    </section>
  );
}
