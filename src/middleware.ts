import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect admin pages
  if (pathname.startsWith("/admin")) {
    const sessionCookie = request.cookies.get("rifal_admin_session")?.value;
    const isLoginPage = pathname === "/admin/login";

    // Fast structural validation for edge runtime
    const hasValidTokenStructure = Boolean(
      sessionCookie &&
        sessionCookie.includes(".") &&
        sessionCookie.split(".").length === 2 &&
        sessionCookie.split(".")[0].length > 10
    );

    // If logged in and trying to access /admin/login, redirect to /admin/dashboard
    if (isLoginPage && hasValidTokenStructure) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }

    // If not logged in and accessing protected admin routes, redirect to /admin/login
    if (!isLoginPage && !hasValidTokenStructure) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
