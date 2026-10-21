import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifySessionToken } from "@/lib/auth";

export async function GET() {
  try {
    const items = await prisma.testimonial.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memuat testimoni." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
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
    const { clientName, originCity, packageTaken, rating, comment, consentGiven } = body;

    if (!clientName || !packageTaken || !comment) {
      return NextResponse.json(
        { success: false, error: "Nama jamaah, nama paket, dan ulasan wajib diisi." },
        { status: 400 }
      );
    }

    const newItem = await prisma.testimonial.create({
      data: {
        clientName,
        originCity: originCity || null,
        packageTaken,
        rating: typeof rating === "number" ? Math.min(Math.max(rating, 1), 5) : 5,
        comment,
        consentGiven: typeof consentGiven === "boolean" ? consentGiven : true,
        isApproved: true,
      },
    });

    await prisma.auditLog.create({
      data: {
        adminId: session.userId,
        action: "CREATE_TESTIMONIAL",
        entityType: "Testimonial",
        entityId: newItem.id,
        oldValue: null,
        newValue: JSON.stringify(newItem),
      },
    });

    return NextResponse.json({
      success: true,
      data: newItem,
      message: "Testimoni jamaah berhasil ditambahkan.",
    });
  } catch (error) {
    console.error("Error creating testimonial:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menambahkan testimoni." },
      { status: 500 }
    );
  }
}
