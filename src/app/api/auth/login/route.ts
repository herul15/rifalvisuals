import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, signSessionToken } from "@/lib/auth";
import { readBody, apiErrorResponse, ApiError } from "@/lib/api";
import { loginSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = await readBody(request, loginSchema);
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: "Username dan kata sandi wajib diisi." },
        { status: 400 }
      );
    }

    const admin = await prisma.adminUser.findFirst({
      where: {
        OR: [{ username: username }, { email: username }],
        isActive: true,
      },
    });

    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Kredensial login tidak valid." },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(password, admin.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Kredensial login tidak valid." },
        { status: 401 }
      );
    }

    if (!["ADMIN", "SUPER_ADMIN"].includes(admin.role)) throw new ApiError(403, "Akses admin diperlukan.");

    // Sign session token (7 days)
    const token = signSessionToken({
      userId: admin.id,
      username: admin.username,
      role: admin.role,
    });

    const response = NextResponse.json({
      success: true,
      data: {
        id: admin.id,
        username: admin.username,
        name: admin.name,
        role: admin.role,
      },
    });

    // Set secure HTTP-only cookie
    response.cookies.set("rifal_admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    return apiErrorResponse(error);
  }
}
