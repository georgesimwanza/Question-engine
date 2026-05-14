// src/middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const isAuthPage = req.nextUrl.pathname.startsWith("/AuthPage") ||
                     req.nextUrl.pathname.startsWith("/authpage");

  const isPublicApi = req.nextUrl.pathname.startsWith("/api/auth") ||
                      req.nextUrl.pathname.startsWith("/api/register");

  if (isAuthPage || isPublicApi) {
    return NextResponse.next();
  }

  if (!token) {
    const loginUrl = new URL("/AuthPage", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};