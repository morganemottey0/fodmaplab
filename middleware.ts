import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const protectedRoutes = ["/", "/scanner", "/meal-plan", "/chat", "/journal", "/favorites", "/patients"];
  const isProtected = protectedRoutes.some((r) => pathname === r || pathname.startsWith(r + "/"));

  if (!isProtected) {
    return NextResponse.next();
  }

  const sessionToken =
    req.cookies.get("next-auth.session-token")?.value ||
    req.cookies.get("__Secure-next-auth.session-token")?.value ||
    req.cookies.get("authjs.session-token")?.value ||
    req.cookies.get("__Secure-authjs.session-token")?.value;

  if (!sessionToken) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/scanner", "/meal-plan", "/chat", "/journal", "/favorites", "/patients/:path*"],
};