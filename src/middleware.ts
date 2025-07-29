import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("jwt_token");

  const pathName = request.nextUrl.pathname;

  if (pathName.startsWith("/auth")) {
    // trying to access the Google login page
    if (pathName === "/auth/google") {
      const code = request.nextUrl.searchParams.get("code");
      const error = request.nextUrl.searchParams.get("error");
      if (!code && !error) {
        return NextResponse.redirect(new URL(`/auth/login`, request.url));
      }
    }
    // trying to access the login page and has a token
    if (token && token.value) {
      return NextResponse.redirect(new URL(`/`, request.url));
    }
  } else if (!token || !token.value) {
    return NextResponse.redirect(
      new URL(`/auth/login?next=${encodeURIComponent(pathName)}`, request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/cart/:path*", "/profile/:path*", "/auth/:path*"],
};
