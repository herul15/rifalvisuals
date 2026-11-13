import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { readBody } from "@/lib/api";
import { trackingSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = await readBody(request, trackingSchema);
    const { packageName, variantLabel, price, location } = body;

    // Log the click event to TrackingEvent
    await prisma.trackingEvent.create({
      data: {
        eventType: "WHATSAPP_CLICK",
        metadata: JSON.stringify({
          packageName,
          variantLabel,
          price,
          location,
          timestamp: new Date().toISOString(),
        }),
        userAgent: request.headers.get("user-agent")?.slice(0, 500) || undefined,
      },
    });

    return NextResponse.json({ success: true, message: "Click logged" });
  } catch (error) {
    console.error("Error logging WhatsApp click:", error);
    // Return 200 so user flow is never disrupted even if analytics fails
    return NextResponse.json({ success: false }, { status: 200 });
  }
}
