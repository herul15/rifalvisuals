"use client";

import React, { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { generateGeneralInquiryUrl } from "@/lib/whatsapp";

interface WhatsAppFloatingProps {
  whatsappNumber?: string;
}

export default function WhatsAppFloating({
  whatsappNumber = "62881080522136",
}: WhatsAppFloatingProps) {
  const [isTooltipDismissed, setIsTooltipDismissed] = useState(false);
  const whatsappUrl = generateGeneralInquiryUrl(whatsappNumber);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-end gap-3 pointer-events-none">
      {/* Tooltip badge */}
      {!isTooltipDismissed && (
        <div className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white text-slate-800 text-xs font-medium shadow-2xl border border-slate-200 pointer-events-auto animate-in fade-in slide-in-from-right-4 duration-300">
          <span>Konsultasi jadwal & paket Umroh?</span>
          <button
            type="button"
            onClick={() => setIsTooltipDismissed(true)}
            className="text-slate-400 hover:text-slate-600 p-0.5 rounded focus:outline-none"
            aria-label="Tutup pesan bantuan"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="pointer-events-auto relative group w-14 h-14 rounded-full bg-gradient-to-r from-[#dfb73d] via-[#d0a526] to-[#b8901e] text-[#0a0f18] flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-[#d0a526]/50"
        aria-label="Hubungi Admin Rifalvisuals via WhatsApp"
      >
        <span className="absolute -inset-1 rounded-full bg-[#d0a526]/30 animate-ping -z-10 opacity-75" />
        <MessageCircle className="w-7 h-7 fill-current" />
      </a>
    </div>
  );
}
