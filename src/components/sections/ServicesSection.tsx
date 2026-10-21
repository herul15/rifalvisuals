"use client";

import React from "react";
import { Camera, Film, Users, Heart, Sparkles, FolderDown } from "lucide-react";

export default function ServicesSection() {
  const services = [
    {
      icon: Camera,
      title: "Dokumentasi Foto Ibadah",
      desc: "Pengambilan sudut candid dan portrait sakral di area Ka'bah, pelataran, dan Jabal dengan hasil tajam beresolusi tinggi.",
      features: ["Unlimited foto mentah", "Color grading hangat & natural", "Panduan pose sopan & khusyuk"],
    },
    {
      icon: Film,
      title: "Video Sinematik & Reels",
      desc: "Kompilasi momen ibadah berdurasi 30 sampai 60 detik yang diiringi lantunan doa atau nasyid syahdu siap bagikan ke media sosial.",
      features: ["Format vertikal 9:16 Reels", "Transisi sinematik halus", "Audio disesuaikan persetujuan"],
    },
    {
      icon: Heart,
      title: "Dokumentasi Pasangan (Couple)",
      desc: "Menjaga kenangan cinta dan kebersamaan suami istri saat bersimpuh dan berikhtiar bersama di Tanah Suci.",
      features: ["Privasi dan adab terjaga", "Momen doa bersama di Multazam", "Waktu hunting fleksibel"],
    },
    {
      icon: Users,
      title: "Dokumentasi Keluarga & Lansia",
      desc: "Layanan penuh kesabaran untuk keluarga besar, anak-anak, dan orang tua lansia tanpa membebani fisik mereka.",
      features: ["Tempo pemotretan rileks", "Spot ramah kursi roda", "Kapasitas hingga 7 anggota keluarga"],
    },
    {
      icon: Sparkles,
      title: "Eksplorasi Spot Panorama Jabal",
      desc: "Dokumentasi pemandangan kota Mekkah dari puncak Jabal Kudai dan Khandamah dengan latar Menara Jam dari ketinggian.",
      features: ["Pemandangan spektakuler", "Pilihan properti piknik santai", "Opsi penjemputan hotel (VIP)"],
    },
    {
      icon: FolderDown,
      title: "Distribusi Cepat & Amanah",
      desc: "Pengiriman seluruh file dokumentasi melalui tautan Google Drive pribadi yang aman maksimal 3 hari setelah sesi selesai.",
      features: ["Estimasi selesai 3 hari kerja", "Masa simpan tautan 2 minggu", "1x revisi minor video/foto"],
    },
  ];

  return (
    <section id="services" className="py-20 lg:py-28 bg-[#0f1d30] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs sm:text-sm font-semibold tracking-wider text-[#d0a526] uppercase block mb-2">
            Layanan Kami
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            Dedikasi Visual Terbaik di Setiap Titik Suci
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            Setiap paket layanan dirancang untuk memberikan kenyamanan, hasil visual
            berkualitas tinggi, dan tetap menjaga kesucian ibadah Anda.
          </p>
        </div>

        {/* 6 Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="group p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-[#d0a526]/50 hover:bg-white/[0.08] transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#d0a526]/15 border border-[#d0a526]/30 text-[#d0a526] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-display font-bold text-xl text-white mb-3 group-hover:text-[#d0a526] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed mb-6">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 space-y-2">
                  {item.features.map((feat) => (
                    <div
                      key={feat}
                      className="flex items-center gap-2 text-xs text-slate-400"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-[#d0a526]" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
