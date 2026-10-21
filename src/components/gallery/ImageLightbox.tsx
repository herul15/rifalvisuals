"use client";

import React, { useEffect, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, MapPin } from "lucide-react";

export interface GalleryItem {
  id: string;
  title: string;
  location: string;
  mediaUrl: string;
  caption: string | null;
}

interface ImageLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  items: GalleryItem[];
  currentIndex: number;
  onNavigate: (index: number) => void;
}

export default function ImageLightbox({
  isOpen,
  onClose,
  items,
  currentIndex,
  onNavigate,
}: ImageLightboxProps) {
  const currentItem = items[currentIndex];

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      onNavigate(currentIndex - 1);
    } else {
      onNavigate(items.length - 1);
    }
  }, [currentIndex, items.length, onNavigate]);

  const handleNext = useCallback(() => {
    if (currentIndex < items.length - 1) {
      onNavigate(currentIndex + 1);
    } else {
      onNavigate(0);
    }
  }, [currentIndex, items.length, onNavigate]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, handlePrev, handleNext]);

  if (!isOpen || !currentItem) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label="Penampil Galeri Foto Dokumentasi"
    >
      {/* Close button */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-3 rounded-full text-white/80 hover:text-white bg-white/10 hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-[#d0a526]"
        aria-label="Tutup penampil foto"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Prev button */}
      {items.length > 1 && (
        <button
          type="button"
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full text-white/80 hover:text-white bg-white/10 hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-[#d0a526]"
          aria-label="Foto sebelumnya"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Next button */}
      {items.length > 1 && (
        <button
          type="button"
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full text-white/80 hover:text-white bg-white/10 hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-[#d0a526]"
          aria-label="Foto berikutnya"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Image Container */}
      <div className="relative max-w-5xl max-h-[85vh] w-full h-full flex flex-col items-center justify-center">
        <div className="relative w-full h-[75vh]">
          <Image
            src={currentItem.mediaUrl}
            alt={currentItem.title}
            fill
            sizes="90vw"
            className="object-contain"
            priority
          />
        </div>

        {/* Caption Bar */}
        <div className="w-full text-center mt-4 px-4">
          <div className="inline-flex items-center gap-1.5 text-xs text-[#d0a526] mb-1">
            <MapPin className="w-3.5 h-3.5" />
            <span className="font-semibold uppercase tracking-wider">
              {currentItem.location}
            </span>
            <span className="text-white/40">·</span>
            <span className="text-white/70">
              {currentIndex + 1} dari {items.length}
            </span>
          </div>
          <h4 className="font-display text-lg font-bold text-white">
            {currentItem.title}
          </h4>
          {currentItem.caption && (
            <p className="text-xs text-slate-300 max-w-xl mx-auto mt-0.5">
              {currentItem.caption}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
