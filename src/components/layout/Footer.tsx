"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  ArrowUp,
  ShieldCheck,
} from "lucide-react";
import { InstagramIcon } from "@/components/ui/InstagramIcon";
import { generateGeneralInquiryUrl } from "@/lib/whatsapp";

interface FooterProps {
  whatsappNumber?: string;
  emailAddress?: string;
}

export default function Footer({
  whatsappNumber = "62881080522136",
  emailAddress = "Rifalvisuals2024@gmail.com",
}: FooterProps) {
  const whatsappUrl = generateGeneralInquiryUrl(whatsappNumber);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#070e1a] text-slate-300 pt-16 pb-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 mb-14">
          {/* Brand Info & Legal Entity */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 flex-shrink-0">
                <Image
                  src="/images/logo-white.png"
                  alt="Logo Resmi Rifalvisuals Indonesia"
                  fill
                  sizes="40px"
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-display text-xl font-bold text-white tracking-tight">
                  RIFALVISUALS
                </span>
                <span className="text-[10px] text-[#d0a526] uppercase tracking-wider">
                  Rifalvisuals Indonesia
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              &ldquo;Mengabadikan Perjalanan Ibadah, Menjaga Kenangan Selamanya.&rdquo;
              Penyedia jasa dokumentasi profesional resmi Umroh dan Haji di Tanah Suci.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-[#d0a526]">
              <ShieldCheck className="w-4 h-4 flex-shrink-0" />
              <span>Layanan Fotografer Profesional</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider">
              Navigasi Halaman
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <a href="#about" className="hover:text-[#d0a526] transition-colors">
                  Tentang Perusahaan
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-[#d0a526] transition-colors">
                  Layanan & Fasilitas
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-[#d0a526] transition-colors">
                  Pricelist Resmi 2026
                </a>
              </li>
              <li>
                <a href="#portfolio" className="hover:text-[#d0a526] transition-colors">
                  Galeri Foto & Video
                </a>
              </li>
              <li>
                <a href="#booking" className="hover:text-[#d0a526] transition-colors">
                  Alur Pemesanan
                </a>
              </li>
              <li>
                <Link
                  href="/syarat-ketentuan"
                  className="hover:text-[#d0a526] transition-colors font-medium text-slate-200"
                >
                  Syarat & Ketentuan Layanan
                </Link>
              </li>
            </ul>
          </div>

          {/* Official Contact Info */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider">
              Kontak & Operasional
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#d0a526] mt-0.5 flex-shrink-0" />
                <span>Area Layanan: Mekkah, Madinah, Thaif, dan Al Ula</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#d0a526] flex-shrink-0" />
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  +62 881-0805-22136 (WhatsApp Resmi)
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#d0a526] flex-shrink-0" />
                <a
                  href={`mailto:${emailAddress}`}
                  className="hover:text-white transition-colors"
                >
                  {emailAddress}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <InstagramIcon className="w-4 h-4 text-[#d0a526] flex-shrink-0" />
                <a
                  href="https://www.instagram.com/rifalvisuals"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  @rifalvisuals
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Back to Top */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p className="text-center sm:text-left">
            © 2024-2026 Rifalvisuals Indonesia. Seluruh hak cipta dilindungi
            undang-undang.
          </p>

          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 text-slate-400 hover:text-[#d0a526] transition-colors p-1 rounded focus:outline-none focus:ring-2 focus:ring-[#d0a526]"
            aria-label="Kembali ke atas halaman"
          >
            <span>Kembali ke Atas</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
