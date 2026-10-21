import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.packageCategory.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        packages: {
          where: { isActive: true },
          orderBy: { sortOrder: "asc" },
          include: {
            variants: {
              where: { isActive: true },
            },
          },
        },
      },
    });

    const addOns = await prisma.addOn.findMany({
      where: { isActive: true },
    });

    return NextResponse.json({
      success: true,
      data: {
        categories,
        addOns,
      },
    });
  } catch (error) {
    console.error("Error fetching packages:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch packages" },
      { status: 500 }
    );
  }
}
