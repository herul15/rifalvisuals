"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, PhoneCall } from "lucide-react";
import { generateGeneralInquiryUrl } from "@/lib/whatsapp";

interface NavbarProps {
  whatsappNumber?: string;
}

export default function Navbar({
  whatsappNumber = "62881080522136",
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: "Beranda", href: "#hero" },
    { name: "Tentang Kami", href: "#about" },
    { name: "Layanan", href: "#services" },
    { name: "Pricelist Resmi", href: "#pricing" },
    { name: "Portofolio", href: "#portfolio" },
    { name: "Alur Booking", href: "#booking" },
    { name: "Syarat & Ketentuan", href: "/syarat-ketentuan" },
  ];

  const generalWhatsAppUrl = generateGeneralInquiryUrl(whatsappNumber);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#0b1626]/95 backdrop-blur-md shadow-lg shadow-black/20 border-b border-white/10 py-3"
          : "bg-gradient-to-b from-[#070e1a]/90 via-[#0b1626]/60 to-transparent py-4 sm:py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-[#d0a526] rounded-lg p-1"
            aria-label="Rifalvisuals Beranda"
          >
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
              <Image
                src="/images/logo-transparent.png"
                alt="Logo Rifalvisuals Indonesia"
                fill
                sizes="(max-width: 640px) 40px, 48px"
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-lg sm:text-xl font-bold tracking-tight text-white group-hover:text-[#d0a526] transition-colors">
                RIFALVISUALS
              </span>
              <span className="text-[10px] sm:text-xs text-[#cbd5e1] tracking-wider uppercase">
                Dokumentasi Umroh & Haji
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center justify-center gap-3.5 xl:gap-6 flex-1 mx-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-center text-xs xl:text-sm font-medium text-slate-200 hover:text-[#d0a526] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#d0a526] rounded px-1.5 py-1 leading-snug flex flex-col items-center justify-center"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Desktop CTA Button */}
          <div className="hidden sm:flex items-center gap-4">
            <a
              href={generalWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-[#0a0f18] bg-gradient-to-r from-[#dfb73d] via-[#d0a526] to-[#b8901e] hover:brightness-110 shadow-md shadow-[#d0a526]/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#d0a526]"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Konsultasi WhatsApp</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 rounded-lg text-slate-200 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#d0a526]"
              aria-expanded={isMobileMenuOpen}
              aria-label={isMobileMenuOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[60px] bg-[#070e1a]/98 backdrop-blur-xl border-t border-white/10 z-40 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col h-[calc(100vh-60px)] justify-between px-6 py-8 overflow-y-auto">
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-center text-lg font-medium text-slate-200 hover:text-[#d0a526] transition-all py-2 border-b border-white/5"
                >
                  {link.name}
                </a>
              ))}
            </nav>

            <div className="pt-6 border-t border-white/10 flex flex-col gap-4">
              <a
                href={generalWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-semibold text-[#0a0f18] bg-gradient-to-r from-[#dfb73d] via-[#d0a526] to-[#b8901e] shadow-lg shadow-[#d0a526]/20"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Konsultasi WhatsApp Resmi</span>
              </a>

              <p className="text-center text-xs text-slate-400">
                Rifalvisuals Indonesia · Mekkah & Madinah
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
