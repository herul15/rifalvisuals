import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireApiAdmin } from "@/lib/admin-session";
import { apiErrorResponse, readBody } from "@/lib/api";
import { portfolioCreateSchema } from "@/lib/validation";
import { writeAudit } from "@/lib/audit";
export async function GET() {
  try {
    await requireApiAdmin();
    return NextResponse.json({ success: true, data: await prisma.portfolio.findMany({ orderBy: { createdAt: "desc" } }) });
  } catch (error) { return apiErrorResponse(error); }
}
export async function POST(request: Request) {
  try {
    const admin = await requireApiAdmin();
    const data = await readBody(request, portfolioCreateSchema);
    const item = await prisma.$transaction(async tx => {
      const created = await tx.portfolio.create({ data });
      await writeAudit(tx, admin.id, "CREATE_PORTFOLIO", "Portfolio", created.id, null, created);
      return created;
    });
    return NextResponse.json({ success: true, data: item, message: "Media portofolio berhasil ditambahkan." });
  } catch (error) { return apiErrorResponse(error); }
}
