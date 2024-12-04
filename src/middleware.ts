import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";
import { i18nRouter } from "next-i18n-router";
import i18nConfig from "../i18nConfig";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process?.env?.NEXTAUTH_SECRET,
  });

  if (!token) {
    const currentPath = request.nextUrl.pathname;
    if (!["/login", "/register"].includes(currentPath)) {
      return NextResponse.redirect(new URL("/login", request.nextUrl.origin));
    }
  }

  return i18nRouter(request, i18nConfig);
}

export const config = {
  matcher: "/((?!api|static|.*\\..*|_next).*)",
};
