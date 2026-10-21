"use client";

import React, { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Lock, User, ArrowLeft, Loader2, AlertCircle } from "lucide-react";

function LoginForm() {
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("from") || "/admin/dashboard";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Gagal masuk. Periksa kembali kredensial Anda.");
        setIsLoading(false);
        return;
      }

      // Successful login - hard navigation to guarantee cookie transmission
      window.location.href = redirectPath;
    } catch {
      setError("Terjadi kendala koneksi ke server. Coba beberapa saat lagi.");
      setIsLoading(false);
    }
  };

  const handleFillDemo = () => {
    setUsername("admin");
    setPassword("AdminRifal2026!");
  };

  return (
    <div className="bg-[#0f1d30] py-8 px-6 sm:px-10 shadow-2xl rounded-2xl border border-white/10">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div
            className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-start gap-2.5 animate-in fade-in"
            role="alert"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label
            htmlFor="username"
            className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider"
          >
            Username atau Email
          </label>
          <div className="relative rounded-xl shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <User className="w-4 h-4" />
            </div>
            <input
              id="username"
              name="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin atau email"
              className="block w-full pl-10 pr-4 py-3 bg-[#16273d] border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#d0a526] focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider"
          >
            Kata Sandi
          </label>
          <div className="relative rounded-xl shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="block w-full pl-10 pr-4 py-3 bg-[#16273d] border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#d0a526] focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-[#0a0f18] bg-gradient-to-r from-[#dfb73d] via-[#d0a526] to-[#b8901e] hover:brightness-110 shadow-lg shadow-[#d0a526]/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#d0a526]"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Memverifikasi...</span>
              </>
            ) : (
              <span>Masuk ke Dashboard</span>
            )}
          </button>
        </div>
      </form>

      {/* Quick Demo Credentials Info */}
      <div className="mt-8 pt-6 border-t border-white/10 text-center">
        <p className="text-xs text-slate-400 mb-2">
          Kredensial bawaan seeding: <code className="text-[#d0a526]">admin</code> /{" "}
          <code className="text-[#d0a526]">AdminRifal2026!</code>
        </p>
        <button
          type="button"
          onClick={handleFillDemo}
          className="text-xs font-semibold text-[#d0a526] hover:underline"
        >
          Isi otomatis kredensial bawaan
        </button>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen bg-[#070e1a] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(208,165,38,0.08)_0%,transparent_60%)] -z-10" />

      {/* Back to Home Link */}
      <div className="absolute top-6 left-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-[#d0a526] transition-colors p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#d0a526]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <Image
              src="/images/logo-white.png"
              alt="Logo Resmi Rifalvisuals Indonesia"
              fill
              sizes="64px"
              className="object-contain"
              priority
            />
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Admin CMS Rifalvisuals
          </h1>
          <p className="mt-2 text-xs text-slate-400">
            Masuk ke sistem pengelolaan paket, harga, portofolio, dan ulasan.
          </p>
        </div>

        {/* Suspense Wrapped LoginForm */}
        <Suspense
          fallback={
            <div className="bg-[#0f1d30] py-12 px-6 sm:px-10 shadow-2xl rounded-2xl border border-white/10 text-center text-slate-400 text-xs">
              Memuat formulir login...
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
