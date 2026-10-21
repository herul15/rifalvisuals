import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  Package,
  Images,
  MessageSquare,
  MessageCircle,
  TrendingUp,
  Clock,
  ArrowRight,
} from "lucide-react";
import { formatRupiah } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [
    packageCount,
    portfolioCount,
    testimonialCount,
    clickCount,
    recentClicks,
    recentAudits,
  ] = await Promise.all([
    prisma.package.count({ where: { isActive: true } }),
    prisma.portfolio.count({ where: { isActive: true } }),
    prisma.testimonial.count({ where: { isApproved: true } }),
    prisma.trackingEvent.count({ where: { eventType: "WHATSAPP_CLICK" } }),
    prisma.trackingEvent.findMany({
      where: { eventType: "WHATSAPP_CLICK" },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { admin: true },
    }),
  ]);

  const stats = [
    {
      title: "Paket Aktif",
      count: packageCount,
      desc: "Katalog Makkah, Jabal & Madinah",
      icon: Package,
      href: "/admin/packages",
    },
    {
      title: "Portofolio Media",
      count: portfolioCount,
      desc: "Foto & visual asli berizin",
      icon: Images,
      href: "/admin/portfolio",
    },
    {
      title: "Testimoni Jamaah",
      count: testimonialCount,
      desc: "Ulasan terverifikasi",
      icon: MessageSquare,
      href: "/admin/testimonials",
    },
    {
      title: "Klik WhatsApp (Leads)",
      count: clickCount,
      desc: "Total minat konsultasi paket",
      icon: MessageCircle,
      href: "#leads",
    },
  ];

  return (
    <div className="space-y-10">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Ringkasan Operasional & Metrik
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Selamat datang di panel manajemen Rifalvisuals Indonesia.
          </p>
        </div>

        <Link
          href="/admin/packages"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-[#0a0f18] bg-[#d0a526] hover:bg-[#b8901e] transition-colors"
        >
          <span>Kelola Paket & Harga</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.title}
              href={s.href}
              className="p-6 rounded-2xl bg-[#0f1d30] border border-white/10 hover:border-[#d0a526]/50 transition-all block group"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-slate-400">
                  {s.title}
                </span>
                <div className="w-9 h-9 rounded-lg bg-[#d0a526]/15 text-[#d0a526] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <p className="font-display text-3xl font-bold text-white">
                {s.count}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">{s.desc}</p>
            </Link>
          );
        })}
      </div>

      {/* 2 Column Layout: Recent Leads Clicks & Audit Log */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" id="leads">
        {/* Recent WhatsApp Clicks */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#0f1d30] border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <TrendingUp className="w-5 h-5 text-[#d0a526]" />
              <h2 className="font-display font-bold text-lg text-white">
                Minat Konsultasi WhatsApp Terbaru
              </h2>
            </div>
            <span className="text-xs text-slate-400">
              {recentClicks.length} rekaman terakhir
            </span>
          </div>

          {recentClicks.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">
              Belum ada riwayat klik WhatsApp yang tercatat.
            </p>
          ) : (
            <div className="space-y-3">
              {recentClicks.map((click) => {
                let meta: {
                  packageName?: string;
                  variantLabel?: string;
                  price?: number;
                  location?: string;
                } = {};
                try {
                  meta = JSON.parse(click.metadata || "{}");
                } catch {
                  // ignore
                }

                return (
                  <div
                    key={click.id}
                    className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-semibold text-white">
                        {meta.packageName || "Paket Umum"}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {meta.variantLabel || "Semua"} · {meta.location || "Tanah Suci"}
                      </p>
                    </div>
                    <div className="text-right">
                      {meta.price && (
                        <p className="font-semibold text-[#d0a526]">
                          {formatRupiah(meta.price)}
                        </p>
                      )}
                      <p className="text-[10px] text-slate-500 flex items-center gap-1 justify-end mt-0.5">
                        <Clock className="w-3 h-3" />
                        <span>
                          {new Date(click.createdAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Audit Log */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#0f1d30] border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-bold text-lg text-white">
              Log Audit Perubahan Data
            </h2>
            <span className="text-xs text-slate-400">Keamanan & Integritas</span>
          </div>

          {recentAudits.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">
              Belum ada perubahan data yang tercatat dalam audit log.
            </p>
          ) : (
            <div className="space-y-3">
              {recentAudits.map((log) => (
                <div
                  key={log.id}
                  className="p-3.5 rounded-xl bg-white/5 border border-white/5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#d0a526]">
                      {log.action}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(log.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-slate-300 mt-1">
                    {log.entityType} ({log.entityId}) diubah oleh{" "}
                    <strong>{log.admin.name}</strong>
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
