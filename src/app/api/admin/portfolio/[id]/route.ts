import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifySessionToken } from "@/lib/auth";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Verify admin session
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("rifal_admin_session")?.value;
    const session = sessionCookie ? verifySessionToken(sessionCookie) : null;

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Akses ditolak. Sesi admin tidak valid." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { clientConsent, isActive, isFeatured, caption, title, location, mediaUrl } = body;

    const existingItem = await prisma.portfolio.findUnique({
      where: { id },
    });

    if (!existingItem) {
      return NextResponse.json(
        { success: false, error: "Item portofolio tidak ditemukan." },
        { status: 404 }
      );
    }

    const updated = await prisma.portfolio.update({
      where: { id },
      data: {
        clientConsent: typeof clientConsent === "boolean" ? clientConsent : undefined,
        isActive: typeof isActive === "boolean" ? isActive : undefined,
        isFeatured: typeof isFeatured === "boolean" ? isFeatured : undefined,
        caption: typeof caption === "string" ? caption : undefined,
        title: typeof title === "string" ? title : undefined,
        location: typeof location === "string" ? location : undefined,
        mediaUrl: typeof mediaUrl === "string" ? mediaUrl : undefined,
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        adminId: session.userId,
        action: "UPDATE_PORTFOLIO",
        entityType: "Portfolio",
        entityId: id,
        oldValue: JSON.stringify({
          clientConsent: existingItem.clientConsent,
          isActive: existingItem.isActive,
          isFeatured: existingItem.isFeatured,
        }),
        newValue: JSON.stringify({
          clientConsent: updated.clientConsent,
          isActive: updated.isActive,
          isFeatured: updated.isFeatured,
        }),
      },
    });

    return NextResponse.json({
      success: true,
      data: updated,
      message: "Portofolio berhasil diperbarui.",
    });
  } catch (error) {
    console.error("Error updating portfolio:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memperbarui portofolio." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("rifal_admin_session")?.value;
    const session = sessionCookie ? verifySessionToken(sessionCookie) : null;

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Akses ditolak. Sesi admin tidak valid." },
        { status: 401 }
      );
    }

    const existingItem = await prisma.portfolio.findUnique({
      where: { id },
    });

    if (!existingItem) {
      return NextResponse.json(
        { success: false, error: "Item portofolio tidak ditemukan." },
        { status: 404 }
      );
    }

    await prisma.portfolio.delete({
      where: { id },
    });

    await prisma.auditLog.create({
      data: {
        adminId: session.userId,
        action: "DELETE_PORTFOLIO",
        entityType: "Portfolio",
        entityId: id,
        oldValue: JSON.stringify(existingItem),
        newValue: null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Item portofolio berhasil dihapus.",
    });
  } catch (error) {
    console.error("Error deleting portfolio:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menghapus portofolio." },
      { status: 500 }
    );
  }
}
