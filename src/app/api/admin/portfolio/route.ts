import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifySessionToken } from "@/lib/auth";

export async function GET() {
  try {
    const items = await prisma.portfolio.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    console.error("Error fetching admin portfolio:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memuat data portofolio." },
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
    const { title, location, mediaUrl, caption, clientConsent, isFeatured } = body;

    if (!title || !location || !mediaUrl) {
      return NextResponse.json(
        { success: false, error: "Judul, lokasi, dan URL media wajib diisi." },
        { status: 400 }
      );
    }

    const newItem = await prisma.portfolio.create({
      data: {
        title,
        location,
        mediaUrl,
        caption: caption || null,
        clientConsent: typeof clientConsent === "boolean" ? clientConsent : true,
        isFeatured: typeof isFeatured === "boolean" ? isFeatured : false,
        isActive: true,
      },
    });

    await prisma.auditLog.create({
      data: {
        adminId: session.userId,
        action: "CREATE_PORTFOLIO",
        entityType: "Portfolio",
        entityId: newItem.id,
        oldValue: null,
        newValue: JSON.stringify(newItem),
      },
    });

    return NextResponse.json({
      success: true,
      data: newItem,
      message: "Media portofolio berhasil ditambahkan.",
    });
  } catch (error) {
    console.error("Error creating portfolio item:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menambahkan media portofolio." },
      { status: 500 }
    );
  }
}
