import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireApiAdmin } from "@/lib/admin-session";
import { ApiError, apiErrorResponse, readBody } from "@/lib/api";
import { packageUpdateSchema } from "@/lib/validation";
import { writeAudit } from "@/lib/audit";
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await requireApiAdmin();
    const { id } = await params;
    const { variantUpdates, ...changes } = await readBody(request, packageUpdateSchema);
    await prisma.$transaction(async tx => {
      const existing = await tx.package.findUnique({ where: { id }, include: { variants: true } });
      if (!existing) throw new ApiError(404, "Paket tidak ditemukan.");
      if (variantUpdates?.some(update => !existing.variants.some(v => v.id === update.variantId))) throw new ApiError(400, "Varian tidak termasuk dalam paket ini.");
      if (Object.keys(changes).length) {
        const updated = await tx.package.update({ where: { id }, data: changes });
        await writeAudit(tx, admin.id, "UPDATE_PACKAGE", "Package", id, existing, updated, id);
      }
      for (const { variantId, ...data } of variantUpdates ?? []) {
        const updated = await tx.packageVariant.update({ where: { id: variantId }, data });
        await writeAudit(tx, admin.id, "UPDATE_PRICE", "PackageVariant", variantId, existing.variants.find(v => v.id === variantId), updated, id);
      }
    });
    return NextResponse.json({ success: true, message: "Data paket berhasil diperbarui." });
  } catch (error) { return apiErrorResponse(error); }
}
