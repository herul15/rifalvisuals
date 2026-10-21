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

    // Check admin session
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
    const { isActive, variantUpdates, imageUrl, name, tagline, description } = body;

    // Find current package
    const existingPackage = await prisma.package.findUnique({
      where: { id },
      include: { variants: true },
    });

    if (!existingPackage) {
      return NextResponse.json(
        { success: false, error: "Paket tidak ditemukan." },
        { status: 404 }
      );
    }

    // 1. Update package fields if provided
    if (
      typeof isActive === "boolean" ||
      typeof imageUrl === "string" ||
      typeof name === "string" ||
      typeof tagline === "string" ||
      typeof description === "string"
    ) {
      await prisma.package.update({
        where: { id },
        data: {
          isActive: typeof isActive === "boolean" ? isActive : undefined,
          imageUrl: typeof imageUrl === "string" ? imageUrl : undefined,
          name: typeof name === "string" ? name : undefined,
          tagline: typeof tagline === "string" ? tagline : undefined,
          description: typeof description === "string" ? description : undefined,
        },
      });

      // Log to AuditLog
      await prisma.auditLog.create({
        data: {
          adminId: session.userId,
          action: "UPDATE_PACKAGE",
          entityType: "Package",
          entityId: id,
          oldValue: JSON.stringify({
            isActive: existingPackage.isActive,
            imageUrl: existingPackage.imageUrl,
            name: existingPackage.name,
          }),
          newValue: JSON.stringify({ isActive, imageUrl, name }),
          packageId: id,
        },
      });
    }

    // 2. Update variant prices if provided
    if (Array.isArray(variantUpdates)) {
      for (const update of variantUpdates) {
        const { variantId, price, durationMinutes, editedPhotosCount } = update;
        const currentVariant = existingPackage.variants.find(
          (v) => v.id === variantId
        );

        if (currentVariant) {
          const updatedVariant = await prisma.packageVariant.update({
            where: { id: variantId },
            data: {
              price: typeof price === "number" ? Math.round(price) : undefined,
              durationMinutes: typeof durationMinutes === "number" ? durationMinutes : undefined,
              editedPhotosCount: typeof editedPhotosCount === "number" ? editedPhotosCount : undefined,
            },
          });

          // Log price change to AuditLog
          await prisma.auditLog.create({
            data: {
              adminId: session.userId,
              action: "UPDATE_PRICE",
              entityType: "PackageVariant",
              entityId: variantId,
              oldValue: JSON.stringify({
                price: currentVariant.price,
                durationMinutes: currentVariant.durationMinutes,
              }),
              newValue: JSON.stringify({
                price: updatedVariant.price,
                durationMinutes: updatedVariant.durationMinutes,
              }),
              packageId: id,
            },
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Data paket berhasil diperbarui.",
    });
  } catch (error) {
    console.error("Error updating package:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memperbarui data paket." },
      { status: 500 }
    );
  }
}
