import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireApiAdmin } from "@/lib/admin-session";
import { ApiError, apiErrorResponse, readBody } from "@/lib/api";
import { portfolioUpdateSchema } from "@/lib/validation";
import { writeAudit } from "@/lib/audit";
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await requireApiAdmin();
    const { id } = await params;
    const data = await readBody(request, portfolioUpdateSchema);
    const item = await prisma.$transaction(async tx => {
      const existing = await tx.portfolio.findUnique({ where: { id } });
      if (!existing) throw new ApiError(404, "Portofolio tidak ditemukan.");
      const updated = await tx.portfolio.update({ where: { id }, data });
      await writeAudit(tx, admin.id, "UPDATE_PORTFOLIO", "Portfolio", id, existing, updated);
      return updated;
    });
    return NextResponse.json({ success: true, data: item, message: "Portofolio berhasil diperbarui." });
  } catch (error) { return apiErrorResponse(error); }
}
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await requireApiAdmin();
    const { id } = await params;
    await prisma.$transaction(async tx => {
      const existing = await tx.portfolio.findUnique({ where: { id } });
      if (!existing) throw new ApiError(404, "Portofolio tidak ditemukan.");
      await tx.portfolio.delete({ where: { id } });
      await writeAudit(tx, admin.id, "DELETE_PORTFOLIO", "Portfolio", id, existing, null);
    });
    return NextResponse.json({ success: true, message: "Portofolio berhasil dihapus." });
  } catch (error) { return apiErrorResponse(error); }
}
