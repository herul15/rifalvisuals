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
    const { isApproved, consentGiven } = body;

    const existingItem = await prisma.testimonial.findUnique({
      where: { id },
    });

    if (!existingItem) {
      return NextResponse.json(
        { success: false, error: "Testimoni tidak ditemukan." },
        { status: 404 }
      );
    }

    const updated = await prisma.testimonial.update({
      where: { id },
      data: {
        isApproved: typeof isApproved === "boolean" ? isApproved : undefined,
        consentGiven: typeof consentGiven === "boolean" ? consentGiven : undefined,
      },
    });

    await prisma.auditLog.create({
      data: {
        adminId: session.userId,
        action: "UPDATE_TESTIMONIAL",
        entityType: "Testimonial",
        entityId: id,
        oldValue: JSON.stringify({
          isApproved: existingItem.isApproved,
          consentGiven: existingItem.consentGiven,
        }),
        newValue: JSON.stringify({
          isApproved: updated.isApproved,
          consentGiven: updated.consentGiven,
        }),
      },
    });

    return NextResponse.json({
      success: true,
      data: updated,
      message: "Status testimoni berhasil diperbarui.",
    });
  } catch (error) {
    console.error("Error updating testimonial:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memperbarui testimoni." },
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

    const existingItem = await prisma.testimonial.findUnique({
      where: { id },
    });

    if (!existingItem) {
      return NextResponse.json(
        { success: false, error: "Testimoni tidak ditemukan." },
        { status: 404 }
      );
    }

    await prisma.testimonial.delete({
      where: { id },
    });

    await prisma.auditLog.create({
      data: {
        adminId: session.userId,
        action: "DELETE_TESTIMONIAL",
        entityType: "Testimonial",
        entityId: id,
        oldValue: JSON.stringify(existingItem),
        newValue: null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Testimoni berhasil dihapus.",
    });
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menghapus testimoni." },
      { status: 500 }
    );
  }
}
