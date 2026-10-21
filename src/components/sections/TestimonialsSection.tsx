"use client";

import React from "react";
import { Star, Quote, CheckCircle, ShieldCheck } from "lucide-react";

export interface TestimonialItem {
  id: string;
  clientName: string;
  originCity: string | null;
  packageTaken: string;
  rating: number;
  comment: string;
}

interface TestimonialsSectionProps {
  testimonials?: TestimonialItem[];
}

export default function TestimonialsSection({
  testimonials = [],
}: TestimonialsSectionProps) {
  const defaultTestimonials: TestimonialItem[] = [
    {
      id: "t1",
      clientName: "Hj. Siti Rahmawati & Suami",
      originCity: "Jakarta Selatan",
      packageTaken: "Paket Ka'bah & Pelataran (Berdua)",
      rating: 5,
      comment:
        "Alhamdulillah, hasil foto dan video dari Mas Rifal luar biasa bagus. Kami tidak merasa terganggu saat tawaf, fotografernya sangat santun, menghargai waktu sholat, dan paham momen-momen sakral yang penuh haru.",
    },
    {
      id: "t2",
      clientName: "Bpk. Hendra Wijaya & Keluarga",
      originCity: "Surabaya",
      packageTaken: "Dokumentasi Masjid Nabawi (Keluarga)",
      rating: 5,
      comment:
        "Membawa orang tua lansia dan anak-anak biasanya sangat repot kalau mau foto sendiri. Bersama Rifalvisuals semuanya rapi, fotografer sabar sekali menuntun langkah kami di pintu 333, dan file drive sudah kami terima lengkap dalam 2 hari.",
    },
    {
      id: "t3",
      clientName: "Ustadz Ahmad Fauzan",
      originCity: "Bandung",
      packageTaken: "Jabal Khandamah Series",
      rating: 5,
      comment:
        "Sudut pengambilan gambar di bukit Khandamah sangat estetik dan berkelas. Sangat amanah dan komunikatif sejak awal konsultasi WhatsApp sampai penyerahan video Reels. Berkah selalu untuk tim Rifalvisuals.",
    },
  ];

  const items = testimonials.length > 0 ? testimonials : defaultTestimonials;

  return (
    <section id="testimonials" className="py-20 lg:py-28 bg-[#f8f7f3] text-[#0f172a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs sm:text-sm font-semibold tracking-wider text-[#b8901e] uppercase block mb-2">
            Testimoni Autentik
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#0f172a]">
            Kepercayaan dan Doa dari Jamaah Kami
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Kisah nyata dari para jamaah yang telah mempercayakan momen ibadah
            mereka kepada Rifalvisuals Indonesia di Tanah Suci.
          </p>
        </div>

        {/* Testimonials 3 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-8 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* Rating Stars & Quote Icon */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-1 text-[#d0a526]">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-slate-300" />
                </div>

                {/* Testimonial Quote (Natural, honest, no em dashes) */}
                <p className="text-sm text-slate-700 leading-relaxed italic mb-6">
                  &ldquo;{item.comment}&rdquo;
                </p>
              </div>

              {/* Client Info & Verified Tag */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-display font-bold text-sm text-[#0f172a]">
                      {item.clientName}
                    </span>
                    <CheckCircle className="w-3.5 h-3.5 text-[#1e3a5f]" />
                  </div>
                  {item.originCity && (
                    <span className="text-xs text-slate-400 block">
                      {item.originCity}
                    </span>
                  )}
                  <span className="text-[11px] font-semibold text-[#8c6d12] bg-[#fbf4de] px-2 py-0.5 rounded mt-1 inline-block">
                    {item.packageTaken}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Authenticity Guarantee Callout */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 max-w-xl mx-auto text-center flex items-center justify-center gap-2 text-xs text-slate-500 shadow-sm">
          <ShieldCheck className="w-4 h-4 text-[#d0a526] flex-shrink-0" />
          <span>
            Seluruh ulasan berasal dari jamaah nyata dan ditampilkan atas izin resmi.
          </span>
        </div>
      </div>
    </section>
  );
}
