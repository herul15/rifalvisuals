import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifySessionToken } from "@/lib/auth";
import { ApiError } from "@/lib/api";

export const ADMIN_ROLES = ["ADMIN", "SUPER_ADMIN"];

export async function getAdminSession() {
  const token = (await cookies()).get("rifal_admin_session")?.value;
  if (!token) return null;
  const payload = verifySessionToken(token);
  if (!payload) return null;
  const admin = await prisma.adminUser.findUnique({
    where: { id: payload.userId },
    select: { id: true, username: true, role: true, isActive: true },
  });
  return admin?.isActive ? admin : null;
}

export async function requireApiAdmin() {
  const admin = await getAdminSession();
  if (!admin) throw new ApiError(401, "Akses ditolak. Sesi admin tidak valid.");
  if (!ADMIN_ROLES.includes(admin.role)) throw new ApiError(403, "Akses admin diperlukan.");
  return admin;
}

export async function requirePageAdmin() {
  const admin = await getAdminSession();
  if (!admin || !ADMIN_ROLES.includes(admin.role)) redirect("/admin/login");
  return admin;
}
