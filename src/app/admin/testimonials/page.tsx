import React from "react";
import prisma from "@/lib/prisma";
import TestimonialsManager from "@/components/admin/TestimonialsManager";

export const dynamic = "force-dynamic";

export default async function AdminTestimonialsPage() {
  const items = await prisma.testimonial.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-white">
          Kelola Testimoni Jamaah
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Tinjau ulasan riil jamaah, status persetujuan publikasi (consent), serta kelola penayangan testimoni di landing page.
        </p>
      </div>

      <TestimonialsManager initialItems={items} />
    </div>
  );
}
