import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("jwt_token");

  const pathName = request.nextUrl.pathname;

  if (pathName.startsWith("/auth")) {
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
