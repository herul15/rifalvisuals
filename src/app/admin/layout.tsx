"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Images,
  MessageSquare,
  Settings,
  LogOut,
  ExternalLink,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  // If on login page, render children directly without admin shell
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch {
      router.push("/admin/login");
    }
  };

  const navItems = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Paket & Harga",
      href: "/admin/packages",
      icon: Package,
    },
    {
      name: "Portofolio Media",
      href: "/admin/portfolio",
      icon: Images,
    },
    {
      name: "Testimoni Jamaah",
      href: "/admin/testimonials",
      icon: MessageSquare,
    },
    {
      name: "Pengaturan Situs",
      href: "/admin/settings",
      icon: Settings,
    },
  ];

  return (
    <div className="min-h-screen bg-[#070e1a] text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar for Desktop */}
      <aside className="w-full md:w-64 bg-[#0b1626] border-r border-white/10 flex flex-col justify-between flex-shrink-0">
        <div>
          {/* Logo Brand Header */}
          <div className="p-6 border-b border-white/10 flex items-center gap-3">
            <div className="relative w-8 h-8 flex-shrink-0">
              <Image
                src="/images/logo-white.png"
                alt="Logo Rifalvisuals"
                fill
                sizes="32px"
                className="object-contain"
              />
            </div>
            <div>
              <span className="font-display font-bold text-base text-white tracking-tight block">
                CMS Rifalvisuals
              </span>
              <span className="text-[10px] text-[#d0a526] uppercase tracking-wider block">
                Admin Panel
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[#1e3a5f] text-[#d0a526] font-semibold"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer & Logout */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between w-full px-3 py-2 text-xs text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            <span>Lihat Website Publik</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2.5 w-full px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors focus:outline-none"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar Akun (Logout)</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <main className="flex-1 p-6 sm:p-10">{children}</main>
      </div>
    </div>
  );
}
