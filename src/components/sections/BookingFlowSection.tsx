"use client";

import React from "react";
import Link from "next/link";
import {
  CalendarCheck,
  MessageCircle,
  CreditCard,
  MapPin,
  Send,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import { generateGeneralInquiryUrl } from "@/lib/whatsapp";

interface BookingFlowSectionProps {
  whatsappNumber?: string;
}

export default function BookingFlowSection({
  whatsappNumber = "62881080522136",
}: BookingFlowSectionProps) {
  const generalWhatsAppUrl = generateGeneralInquiryUrl(whatsappNumber);

  const steps = [
    {
      step: "01",
      icon: CalendarCheck,
      title: "Pilih Paket & Waktu",
      desc: "Pilih paket dokumentasi yang sesuai dan sesuaikan dengan jadwal itinerary ibadah Anda di Tanah Suci.",
    },
    {
      step: "02",
      icon: MessageCircle,
      title: "Konsultasi Slot",
      desc: "Hubungi admin resmi via WhatsApp untuk konfirmasi ketersediaan tim fotografer pada tanggal yang Anda inginkan.",
    },
    {
      step: "03",
      icon: CreditCard,
      title: "Uang Muka (DP) 50%",
      desc: "Kunci tanggal dan jam sesi pemotretan Anda dengan DP 50% melalui rekening resmi yang diverifikasi admin.",
    },
    {
      step: "04",
      icon: MapPin,
      title: "Pelunasan & Sesi Temu",
      desc: "Pelunasan 100% maksimal H-1. Tim fotografer menyambut Anda di titik temu resmi yang disepakati.",
    },
    {
      step: "05",
      icon: Send,
      title: "Hasil Drive (3 Hari)",
      desc: "File foto mentah dan foto edit serta Reels dikirim via tautan Google Drive pribadi dalam waktu maksimal 3 hari kerja.",
    },
  ];

  return (
    <section id="booking" className="py-20 lg:py-28 bg-[#0f1d30] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs sm:text-sm font-semibold tracking-wider text-[#d0a526] uppercase block mb-2">
            Alur Pemesanan Transparan
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            Langkah Mudah Booking Dokumentasi Ibadah
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            Proses pemesanan sederhana dan terstruktur agar Anda dapat beribadah
            dengan tenang tanpa kekhawatiran teknis di lapangan.
          </p>
        </div>

        {/* 5 Steps Linear Flow */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-16">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#d0a526]/40 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-display text-2xl font-bold text-[#d0a526]">
                      {item.step}
                    </span>
                    <div className="w-9 h-9 rounded-lg bg-[#d0a526]/10 text-[#d0a526] flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="font-display font-bold text-base text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Important Terms Highlights Box */}
        <div className="p-8 rounded-2xl bg-[#16273d] border border-white/15 max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-[#d0a526]" />
                <h4 className="font-display font-bold text-lg text-white">
                  Titik Temu Resmi & Kebijakan Layanan
                </h4>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                Titik temu resmi telah disesuaikan agar mudah dijangkau jamaah:
                Pintu 333/310 (Nabawi), WC 3 (Haram), dan Hotel Al Shohada (Jabal).
                Baca rincian ketentuan lengkap mengenai DP, revisi, dan masa simpan file.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <Link
                href="/syarat-ketentuan"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-colors"
              >
                <span>Baca Syarat Lengkap</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={generalWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-semibold text-[#0a0f18] bg-[#d0a526] hover:bg-[#b8901e] transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Konsultasi Sekarang</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
