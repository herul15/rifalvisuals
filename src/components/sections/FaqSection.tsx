"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle, PhoneCall } from "lucide-react";
import { generateGeneralInquiryUrl } from "@/lib/whatsapp";

interface FaqSectionProps {
  whatsappNumber?: string;
}

export default function FaqSection({
  whatsappNumber = "62881080522136",
}: FaqSectionProps) {
  const whatsappUrl = generateGeneralInquiryUrl(whatsappNumber);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "Apakah proses dokumentasi akan mengganggu ibadah saya atau jamaah lain?",
      a: "Sama sekali tidak. Prinsip utama Rifalvisuals adalah 'Amanah dan Santun'. Fotografer kami berpengalaman di Tanah Suci, mengutamakan adab di tempat suci, tidak menggunakan lampu kilat yang mengganggu, tidak memotong shaf sholat, dan memprioritaskan kekhusyukan doa Anda di atas pengambilan gambar.",
    },
    {
      q: "Kapan waktu terbaik untuk mengambil sesi foto di Ka'bah dan Jabal?",
      a: "Untuk area Ka'bah dan pelataran Masjidil Haram, waktu terbaik adalah pagi hari setelah sholat Dhuha (pukul 07.00 - 09.00) atau menjelang sore (pukul 16.00 - 17.30) saat suhu lebih bersahabat dan pencahayaan lembut. Untuk Jabal Series, waktu paling spektakuler adalah menjelang matahari terbenam (golden hour) hingga lampu kota Mekkah mulai menyala.",
    },
    {
      q: "Bagaimana jika jadwal kepulangan atau jadwal thawaf kami bergeser (reschedule)?",
      a: "Kami memahami bahwa dinamika jadwal ibadah dan travel umroh bisa berubah. Anda dapat mengajukan permohonan perubahan jadwal (reschedule) maksimal H-3 sebelum sesi awal, dan kami akan menyesuaikan dengan slot fotografer yang tersedia di tanggal baru tanpa biaya penalti tambahan.",
    },
    {
      q: "Berapa lama estimasi pengiriman hasil foto dan video Reels?",
      a: "Seluruh file foto mentah tanpa batas (unlimited) beserta foto pilihan yang telah diedit tajam dan video Reels akan dikirimkan maksimal dalam 3 hari kerja setelah sesi pemotretan selesai, melalui tautan pribadi Google Drive.",
    },
    {
      q: "Apakah saya bisa memilih musik latar atau nasyid untuk video Reels saya?",
      a: "Tentu bisa. Anda dapat mengusulkan audio doa, murottal merdu, atau nasyid syahdu pilihan Anda kepada admin sebelum tim editor memulai proses editing video.",
    },
    {
      q: "Berapa kapasitas peserta untuk paket keluarga?",
      a: "Paket keluarga kami dirancang nyaman hingga 7 anggota keluarga dalam satu sesi pemotretan. Jika terdapat tambahan anggota keluarga lebih dari 7 orang, Anda dapat memilih opsi layanan tambahan (add-on) peserta seharga Rp450.000 per orang.",
    },
  ];

  return (
    <section id="faq" className="py-20 lg:py-28 bg-[#fbfbf9] text-[#0f172a]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs sm:text-sm font-semibold tracking-wider text-[#b8901e] uppercase block mb-2">
            Tanya Jawab Layanan
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#0f172a]">
            Pertanyaan yang Sering Diajukan Jamaah
          </h2>
          <p className="mt-3 text-sm text-slate-600 leading-relaxed">
            Informasi penting seputar pelaksanaan teknis sesi pemotretan, waktu terbaik,
            dan ketentuan layanan Rifalvisuals di Tanah Suci.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {faqs.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-white border border-slate-200/90 overflow-hidden transition-all duration-200 shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 focus:outline-none focus:ring-2 focus:ring-[#d0a526]"
                  aria-expanded={isOpen}
                >
                  <span className="font-display font-bold text-base sm:text-lg text-[#0f172a] pr-2">
                    {item.q}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-200 ${
                      isOpen
                        ? "bg-[#1e3a5f] text-white rotate-180"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Contact Assistance Callout */}
        <div className="mt-12 text-center p-6 rounded-2xl bg-[#fbf4de] border border-[#d0a526]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left flex items-center gap-3">
            <HelpCircle className="w-6 h-6 text-[#8c6d12] flex-shrink-0" />
            <div>
              <p className="text-sm font-bold text-[#0f172a]">
                Punya pertanyaan lain yang belum terjawab?
              </p>
              <p className="text-xs text-slate-600">
                Konsultasikan kebutuhan tanggal dan rencana itinerary Anda dengan admin kami.
              </p>
            </div>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-[#0a0f18] bg-[#d0a526] hover:bg-[#b8901e] transition-colors flex-shrink-0"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Tanya via WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
}
