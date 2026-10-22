"use client";

import React from "react";
import Image from "next/image";
import { Award, HeartHandshake, Eye } from "lucide-react";

interface AboutSectionProps {
  aboutImageUrl?: string | null;
}

export default function AboutSection({
  aboutImageUrl = "/images/hero/about-rifal.jpeg",
}: AboutSectionProps) {
  const displayImage = aboutImageUrl || "/images/hero/about-rifal.jpeg";
  const milestones = [
    {
      year: "2024",
      title: "Layanan Personal Dimulai",
      desc: "Berawal dari dedikasi melayani jamaah umroh secara personal di Mekkah dan Madinah.",
    },
    {
      year: "2025",
      title: "Penguatan Sistem & Tim",
      desc: "Membangun standar operasional, kurasi peralatan profesional, dan memperluas spot dokumentasi.",
    },
    {
      year: "2026",
      title: "Layanan Profesional Terstruktur",
      desc: "Pengembangan tim inti fotografer resmi di Tanah Suci dan integrasi sistem layanan digital.",
    },
  ];

  const coreValues = [
    {
      icon: HeartHandshake,
      title: "Amanah",
      desc: "Menjaga kepercayaan setiap jamaah, menghormati waktu ibadah, dan tidak mengganggu kekhusyukan.",
    },
    {
      icon: Award,
      title: "Profesional",
      desc: "Peralatan standar industri, fotografer ramah dan sabar, serta komitmen pengiriman file maksimal 3 hari kerja.",
    },
    {
      icon: Eye,
      title: "Estetik",
      desc: "Sentuhan visual modern, pewarnaan sinematik yang sejuk, dan komposisi yang berbicara dari hati.",
    },
  ];

  return (
    <section id="about" className="py-20 lg:py-28 bg-[#fbfbf9] text-[#0f172a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <span className="text-xs sm:text-sm font-semibold tracking-wider text-[#b8901e] uppercase block mb-2">
            Tentang Rifalvisuals Indonesia
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#0f172a] leading-tight">
            Menemani Setiap Langkah Ibadah Anda di Tanah Suci
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Kami percaya bahwa perjalanan ke Baitullah adalah momentum sakral yang
            jarang terulang dengan cara yang sama. Kami hadir untuk merawat setiap
            senyum, doa, dan haru menjadi kenangan yang hidup selamanya.
          </p>
        </div>

        {/* 2-Column Split: Image Showcase & Company Story */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
              <Image
                src={displayImage}
                alt="Tim Dokumentasi Rifalvisuals Bersama Jamaah"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-xs font-semibold text-[#d0a526] tracking-wide uppercase">
                  Dokumentasi Tanah Suci
                </span>
                <p className="font-display text-xl font-bold">Kehangatan Ibadah Jamaah</p>
                <p className="text-xs text-slate-300">
                  Rifalvisuals Indonesia · Mekkah &amp; Madinah
                </p>
              </div>
            </div>
            {/* Accent badge */}
            <div className="hidden sm:block absolute -bottom-6 -right-6 bg-[#1e3a5f] text-white p-5 rounded-xl shadow-xl max-w-[220px] border border-white/10">
              <p className="font-display text-2xl font-bold text-[#d0a526]">
                100%
              </p>
              <p className="text-xs text-slate-200 mt-1">
                Fokus kenyamanan dan kekhusyukan jamaah
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4 text-slate-700 leading-relaxed text-sm sm:text-base">
              <p>
                Berawal dari panggilan hati seorang fotografer dan videografer yang
                mendampingi jamaah di pelataran Kakbah dan Masjid Nabawi, kini
                Rifalvisuals telah berkembang menjadi penyedia jasa dokumentasi
                profesional yang siap menjadi mitra terbaik bagi jamaah mandiri
                maupun rombongan travel di Indonesia.
              </p>
              <p>
                Fokus utama kami adalah menghadirkan dokumentasi yang santun: tanpa
                sorotan lampu berlebih di tempat suci, tanpa mengganggu shaf orang
                lain, dan selalu memprioritaskan ketenteraman ibadah jamaah di atas
                segalanya.
              </p>
            </div>

            {/* Core Values 3 Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {coreValues.map((val) => {
                const IconComponent = val.icon;
                return (
                  <div
                    key={val.title}
                    className="p-5 rounded-xl bg-white border border-slate-200/80 shadow-sm hover:border-[#d0a526]/50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-[#fbf4de] text-[#8c6d12] flex items-center justify-center mb-3">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <h3 className="font-display font-bold text-base text-[#0f172a] mb-1">
                      {val.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-normal">
                      {val.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Timeline Milestones */}
            <div className="pt-4 border-t border-slate-200">
              <h3 className="text-xs font-semibold tracking-wider uppercase text-slate-500 mb-4">
                Perjalanan Kami Menuju Standar Terbaik
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {milestones.map((item) => (
                  <div key={item.year} className="flex flex-col">
                    <span className="font-display text-xl font-bold text-[#1e3a5f]">
                      {item.year}
                    </span>
                    <span className="font-semibold text-xs text-[#0f172a] mt-0.5">
                      {item.title}
                    </span>
                    <p className="text-xs text-slate-500 mt-1 leading-normal">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
