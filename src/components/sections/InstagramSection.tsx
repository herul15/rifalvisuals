"use client";

import React from "react";
import Image from "next/image";
import { Heart, ExternalLink } from "lucide-react";
import { InstagramIcon } from "@/components/ui/InstagramIcon";

export interface InstagramPostItem {
  id: string;
  postUrl: string;
  imageUrl: string;
  caption: string | null;
  likeCount: number | null;
}

interface InstagramSectionProps {
  posts?: InstagramPostItem[];
}

export default function InstagramSection({
  posts = [],
}: InstagramSectionProps) {
  const defaultPosts: InstagramPostItem[] = [
    {
      id: "ig-1",
      postUrl: "https://www.instagram.com/rifalvisuals",
      imageUrl: "/images/hero/hero-makkah.jpeg",
      caption:
        "Setiap tetes air mata dan doa di hadapan Baitullah layak diabadikan dengan penuh kehormatan.",
      likeCount: 428,
    },
    {
      id: "ig-2",
      postUrl: "https://www.instagram.com/rifalvisuals",
      imageUrl: "/images/hero/hero-nabawi.jpeg",
      caption:
        "Ketenangan Masjid Nabawi yang selalu dirindukan setiap jiwa yang pernah berkunjung.",
      likeCount: 615,
    },
    {
      id: "ig-3",
      postUrl: "https://www.instagram.com/rifalvisuals",
      imageUrl: "/images/hero/hero-jabal.jpeg",
      caption:
        "Pemandangan kota Mekkah dari bukit Khandamah saat matahari terbenam memancarkan cahaya emas.",
      likeCount: 890,
    },
  ];

  const displayPosts = posts.length > 0 ? posts : defaultPosts;

  return (
    <section className="py-20 bg-[#0b1626] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#d0a526] uppercase tracking-wider mb-2">
              <InstagramIcon className="w-4 h-4" />
              <span>Ikuti Keseharian Kami</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
              Instagram @rifalvisuals
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Dokumentasi harian, cuplikan Reels terbaru, dan suasana Tanah Suci.
            </p>
          </div>

          <a
            href="https://www.instagram.com/rifalvisuals"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-colors"
          >
            <span>Kunjungi Akun Instagram</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* 3 Grid Posts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayPosts.map((post) => (
            <a
              key={post.id}
              href={post.postUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-[4/5] rounded-2xl overflow-hidden bg-slate-900 border border-white/10 block shadow-lg hover:border-[#d0a526]/50 transition-all duration-300"
            >
              <Image
                src={post.imageUrl}
                alt="Instagram @rifalvisuals feed"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              {/* Instagram Floating Icon */}
              <div className="absolute top-4 right-4">
                <span className="p-2 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center">
                  <InstagramIcon className="w-4 h-4 text-[#d0a526]" />
                </span>
              </div>

              {/* Caption & Like Count */}
              <div className="absolute bottom-5 left-5 right-5 text-white">
                {post.likeCount && (
                  <div className="flex items-center gap-1.5 text-xs text-[#d0a526] font-semibold mb-1.5">
                    <Heart className="w-3.5 h-3.5 fill-current" />
                    <span>{post.likeCount} suka</span>
                  </div>
                )}
                {post.caption && (
                  <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed">
                    {post.caption}
                  </p>
                )}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
