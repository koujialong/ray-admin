import { getToken } from "next-auth/jwt";
import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process?.env?.NEXTAUTH_SECRET,
  });

  if (!token) {
    return  NextResponse.redirect(new URL("/login", request.nextUrl.origin));
  }

  return  NextResponse.next();
}

export const config = {
  matcher: ["/:locale/main/:path*"],
};
