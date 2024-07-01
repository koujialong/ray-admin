import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { i18nRouter } from 'next-i18n-router';
// import i18nConfig from './i18nConfig';

export async function middleware(request: NextRequest) {
  console.log('中间件app');
  const token = await getToken({
    req: request,
    secret: process?.env?.NEXTAUTH_SECRET,
  });

  if (!token) {
    return  NextResponse.redirect(new URL("/login", request.nextUrl.origin));
  }

  return  NextResponse.next();
  // console.error('i18n =>',i18nRouter(request, i18nConfig));
  // return i18nRouter(request, i18nConfig);
}

export const config = {
  matcher: ["/:locale/main/:path*"],
  // matcher: '/((?!api|static|.*\\..*|_next).*)'
};
