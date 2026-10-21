import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifySessionToken } from "@/lib/auth";

export async function GET() {
  try {
    const settings = await prisma.siteSetting.findUnique({
      where: { id: "default" },
    });
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memuat pengaturan situs." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
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
    const {
      companyName,
      tagline,
      whatsappNumber,
      emailAddress,
      instagramHandle,
      tiktokHandle,
      address,
      meetingPointNabawi,
      meetingPointHaram,
      meetingPointJabal,
      dpPercentage,
      announcementText,
      heroImageUrl,
      aboutImageUrl,
    } = body;

    const existingSettings = await prisma.siteSetting.findUnique({
      where: { id: "default" },
    });

    const updated = await prisma.siteSetting.upsert({
      where: { id: "default" },
      update: {
        companyName: companyName ?? undefined,
        tagline: tagline ?? undefined,
        whatsappNumber: whatsappNumber ?? undefined,
        emailAddress: emailAddress ?? undefined,
        instagramHandle: instagramHandle ?? undefined,
        tiktokHandle: tiktokHandle ?? undefined,
        address: address ?? undefined,
        meetingPointNabawi: meetingPointNabawi ?? undefined,
        meetingPointHaram: meetingPointHaram ?? undefined,
        meetingPointJabal: meetingPointJabal ?? undefined,
        dpPercentage: typeof dpPercentage === "number" ? dpPercentage : undefined,
        announcementText: announcementText !== undefined ? announcementText : undefined,
        heroImageUrl: heroImageUrl !== undefined ? heroImageUrl : undefined,
        aboutImageUrl: aboutImageUrl !== undefined ? aboutImageUrl : undefined,
      },
      create: {
        id: "default",
        companyName: companyName || "Rifalvisuals Indonesia",
        tagline: tagline || "Mengabadikan Perjalanan Ibadah, Menjaga Kenangan Selamanya.",
        whatsappNumber: whatsappNumber || "62881080522136",
        emailAddress: emailAddress || "Rifalvisuals2024@gmail.com",
        instagramHandle: instagramHandle || "rifalvisuals",
        tiktokHandle: tiktokHandle || "rifaal_dii",
        address: address || "Mekkah - Madinah - Indonesia",
        meetingPointNabawi: meetingPointNabawi || "Pintu 333 / 310 Masjid Nabawi",
        meetingPointHaram: meetingPointHaram || "WC 3 Pelataran Masjidil Haram",
        meetingPointJabal: meetingPointJabal || "Lobby Hotel Al Shohada",
        dpPercentage: typeof dpPercentage === "number" ? dpPercentage : 50,
        announcementText: announcementText || null,
        heroImageUrl: heroImageUrl || "/images/hero/hero-makkah.jpeg",
        aboutImageUrl: aboutImageUrl || "/images/hero/about-rifal.jpeg",
      },
    });

    await prisma.auditLog.create({
      data: {
        adminId: session.userId,
        action: "UPDATE_SITE_SETTINGS",
        entityType: "SiteSetting",
        entityId: "default",
        oldValue: JSON.stringify(existingSettings),
        newValue: JSON.stringify(updated),
      },
    });

    return NextResponse.json({
      success: true,
      data: updated,
      message: "Pengaturan situs berhasil disimpan.",
    });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memperbarui pengaturan situs." },
      { status: 500 }
    );
  }
}
