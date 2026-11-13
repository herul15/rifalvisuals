import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireApiAdmin } from "@/lib/admin-session";
import { apiErrorResponse, readBody } from "@/lib/api";
import { settingsSchema } from "@/lib/validation";
import { writeAudit } from "@/lib/audit";
export async function GET() {
  try {
    await requireApiAdmin();
    return NextResponse.json({ success: true, data: await prisma.siteSetting.findUnique({ where: { id: "default" } }) });
  } catch (error) { return apiErrorResponse(error); }
}
export async function PATCH(request: Request) {
  try {
    const admin = await requireApiAdmin();
    const data = await readBody(request, settingsSchema);
    const settings = await prisma.$transaction(async tx => {
      const existing = await tx.siteSetting.findUnique({ where: { id: "default" } });
      const updated = await tx.siteSetting.upsert({ where: { id: "default" }, update: data, create: { id: "default", ...data } });
      await writeAudit(tx, admin.id, "UPDATE_SITE_SETTINGS", "SiteSetting", "default", existing, updated);
      return updated;
    });
    return NextResponse.json({ success: true, data: settings, message: "Pengaturan situs berhasil disimpan." });
  } catch (error) { return apiErrorResponse(error); }
}
