import React from "react";
import prisma from "@/lib/prisma";
import PortfolioManager from "@/components/admin/PortfolioManager";

export const dynamic = "force-dynamic";

export default async function AdminPortfolioPage() {
  const items = await prisma.portfolio.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-white">
          Kelola Portofolio Media
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Atur galeri dokumentasi foto, izin publikasi jamaah (consent ethics), serta status tayang di landing page.
        </p>
      </div>

      <PortfolioManager initialItems={items} />
    </div>
  );
}
