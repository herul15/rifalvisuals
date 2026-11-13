import { NextResponse, type NextRequest } from "next/server";
import { verifySessionToken } from "@/lib/auth";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookie = request.cookies.get("rifal_admin_session")?.value;
  const session = cookie ? verifySessionToken(cookie) : null;
  const valid = session && ["ADMIN", "SUPER_ADMIN"].includes(session.role);
  if (pathname === "/admin/login") return NextResponse.next();
  if (!valid) {
    const url = new URL("/admin/login", request.url);
    url.searchParams.set("from", pathname);
    const response = NextResponse.redirect(url);
    if (cookie) response.cookies.delete("rifal_admin_session");
    return response;
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };
