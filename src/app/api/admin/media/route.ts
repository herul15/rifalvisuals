import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import fs from "fs";
import path from "path";
import { verifySessionToken } from "@/lib/auth";

export async function GET() {
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

    const portfolioDir = path.join(process.cwd(), "public", "images", "portfolio");
    const heroDir = path.join(process.cwd(), "public", "images", "hero");

    const mediaList: Array<{
      id: string;
      filename: string;
      url: string;
      folder: "portfolio" | "hero";
      sizeBytes: number;
    }> = [];

    if (fs.existsSync(portfolioDir)) {
      const portfolioFiles = fs.readdirSync(portfolioDir);
      for (const file of portfolioFiles) {
        if (/\.(jpe?g|png|webp)$/i.test(file)) {
          const stats = fs.statSync(path.join(portfolioDir, file));
          mediaList.push({
            id: `portfolio-${file}`,
            filename: file,
            url: `/images/portfolio/${file}`,
            folder: "portfolio",
            sizeBytes: stats.size,
          });
        }
      }
    }

    if (fs.existsSync(heroDir)) {
      const heroFiles = fs.readdirSync(heroDir);
      for (const file of heroFiles) {
        if (/\.(jpe?g|png|webp)$/i.test(file)) {
          const stats = fs.statSync(path.join(heroDir, file));
          mediaList.push({
            id: `hero-${file}`,
            filename: file,
            url: `/images/hero/${file}`,
            folder: "hero",
            sizeBytes: stats.size,
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      total: mediaList.length,
      data: mediaList,
    });
  } catch (error) {
    console.error("Error reading media directory:", error);
    return NextResponse.json(
      { success: false, error: "Gagal membaca direktori aset media." },
      { status: 500 }
    );
  }
}
