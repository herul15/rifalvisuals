import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CreditCard,
  MapPin,
  Clock,
  ShieldCheck,
  RefreshCw,
  FolderLock,
  PhoneCall,
} from "lucide-react";
import { generateGeneralInquiryUrl } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Syarat & Ketentuan Pemesanan | Rifalvisuals Indonesia",
  description:
    "Ketentuan resmi pemesanan jasa dokumentasi umroh, titik temu di Mekkah dan Madinah, alur pembayaran, dan kebijakan revisi.",
};

export default function TermsPage() {
  const whatsappUrl = generateGeneralInquiryUrl("62881080522136");

  const sections = [
    {
      icon: CreditCard,
      title: "1. Uang Muka (DP) & Pelunasan",
      items: [
        "Pemesanan jadwal fotografer dinyatakan sah setelah calon jamaah melakukan pembayaran Uang Muka (DP) sebesar 50% dari total nilai paket.",
        "Pelunasan sebesar 100% wajib diselesaikan paling lambat H-1 sebelum waktu sesi pemotretan berlangsung.",
        "Pembayaran hanya dilakukan melalui satu rekening resmi perusahaan yang dikonfirmasi langsung oleh admin WhatsApp resmi Rifalvisuals.",
        "Demi keamanan transaksi dan menghindari penipuan, Rifalvisuals tidak pernah meminta transfer ke rekening pribadi pihak ketiga tanpa surat tugas resmi.",
      ],
    },
    {
      icon: MapPin,
      title: "2. Titik Temu Resmi (Meeting Point)",
      items: [
        "Masjid Nabawi (Madinah): Pintu 333 / 310 pelataran Masjid Nabawi.",
        "Masjidil Haram (Makkah): Area WC 3 pelataran Masjidil Haram.",
        "Jabal Series (Makkah): Lobby Hotel Al Shohada (kecuali paket Jabal VIP yang menyertakan penjemputan langsung di hotel jamaah).",
        "Jamaah diharapkan hadir tepat waktu di titik temu sesuai jam yang telah dikonfirmasi bersama admin untuk memaksimalkan durasi hunting foto.",
      ],
    },
    {
      icon: Clock,
      title: "3. Estimasi Pengerjaan & Distribusi File",
      items: [
        "Seluruh file foto mentah (unlimited) dan foto yang telah diedit akan diserahkan dalam estimasi maksimal 3 hari kerja setelah pemotretan.",
        "Pengiriman file dilakukan melalui tautan penyimpanan Google Drive pribadi yang aman dan beresolusi penuh (high-definition).",
        "Tautan Google Drive aktif selama 2 minggu sejak pengiriman. Jamaah sangat dianjurkan untuk segera mengunduh dan menyimpan salinan file secara mandiri.",
      ],
    },
    {
      icon: RefreshCw,
      title: "4. Kebijakan Revisi Hasil Karya",
      items: [
        "Setiap paket berhak mendapatkan 1 kali revisi minor untuk hasil foto atau video Reels.",
        "Revisi minor mencakup penyesuaian pencahayaan, koreksi warna (color grading), atau pemotongan durasi tertentu.",
        "Revisi tidak mencakup penggantian total konsep musik/audio nasyid yang telah disepakati sebelum proses editing dimulai.",
      ],
    },
    {
      icon: ShieldCheck,
      title: "5. Kebijakan Privasi Jamaah & Hak Publikasi",
      items: [
        "Rifalvisuals Indonesia sangat menghormati privasi dan kehormatan setiap jamaah di Tanah Suci.",
        "Foto atau video yang menampilkan wajah jamaah hanya akan dipublikasikan pada portofolio situs web atau akun media sosial resmi (@rifalvisuals) apabila telah mendapatkan izin dan persetujuan (consent) dari pelanggan.",
        "Jamaah berhak menolak publikasi karyanya ke ranah publik tanpa dikenakan biaya penalti apa pun.",
      ],
    },
    {
      icon: FolderLock,
      title: "6. Perubahan Jadwal (Reschedule) & Pembatalan",
      items: [
        "Permohonan perubahan jadwal (reschedule) wajib diinfokan kepada admin minimal H-3 sebelum tanggal sesi awal.",
        "Pemberian jadwal baru disesuaikan dengan ketersediaan slot fotografer yang belum terisi di tanggal tujuan.",
        "Pembatalan sepihak setelah H-2 menyebabkan DP yang telah dibayarkan tidak dapat dikembalikan (non-refundable) karena slot fotografer telah dikunci dan menolak pesanan jamaah lain.",
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-[#fbfbf9] text-[#0f172a] pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#1e3a5f] hover:text-[#d0a526] transition-colors p-1 rounded focus:outline-none focus:ring-2 focus:ring-[#d0a526]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda Rifalvisuals</span>
          </Link>
        </div>

        {/* Page Header */}
        <div className="mb-12 border-b border-slate-200 pb-8">
          <span className="text-xs sm:text-sm font-semibold tracking-wider text-[#b8901e] uppercase block mb-2">
            Pedoman Layanan Resmi
          </span>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#0f172a] leading-tight">
            Syarat & Ketentuan Pemesanan
          </h1>
          <p className="mt-4 text-base text-slate-600 leading-relaxed">
            Perjanjian layanan dan pedoman operasional dokumentasi ibadah Umroh dan
            Haji bersama Rifalvisuals Indonesia di Mekkah dan Madinah.
          </p>
        </div>

        {/* Sections Content */}
        <div className="space-y-10">
          {sections.map((sec) => {
            const Icon = sec.icon;
            return (
              <div
                key={sec.title}
                className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-[#fbf4de] text-[#8c6d12] flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h2 className="font-display font-bold text-xl text-[#0f172a]">
                    {sec.title}
                  </h2>
                </div>

                <ul className="space-y-3 text-sm text-slate-600 leading-relaxed pl-2">
                  {sec.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#d0a526] mt-2 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Official Contact Box */}
        <div className="mt-14 p-8 rounded-2xl bg-[#0f1d30] text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <h3 className="font-display font-bold text-xl text-white">
              Ada Pertanyaan Seputar Ketentuan Layanan?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-lg leading-relaxed">
              Tim admin kami siap membantu memberikan penjelasan dan konsultasi
              jadwal ibadah Anda di Tanah Suci.
            </p>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-[#0a0f18] bg-[#d0a526] hover:bg-[#b8901e] transition-colors flex-shrink-0"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Hubungi WhatsApp Resmi</span>
          </a>
        </div>
      </div>
    </main>
  );
}
