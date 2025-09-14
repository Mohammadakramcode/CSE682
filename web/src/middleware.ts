import { NextResponse, NextRequest } from "next/server";
import { getTokenCookieName } from "@/lib/auth";

const PUBLIC_PATHS = new Set<string>([
  "/",
  "/login",
  "/signup",
  "/api/auth/login",
  "/api/auth/signup",
]);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_PATHS.has(pathname) || pathname.startsWith("/api/public")) {
    return NextResponse.next();
  }

  const tokenCookie = request.cookies.get(getTokenCookieName());
  if (!tokenCookie?.value) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)).*)",
  ],
};
