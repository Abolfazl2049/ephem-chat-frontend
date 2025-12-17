import { NextResponse, NextRequest, ProxyConfig } from "next/server";

export function proxy(request: NextRequest) {
  const sessionToken = request.headers.get("session-token") || request.cookies.get("session-token")?.value;
  if (request.nextUrl.pathname === "/auth/create-session") return NextResponse.next();
  if (!sessionToken) {
    return NextResponse.redirect(new URL("/auth/create-session", request.url));
  }
}

export const config: ProxyConfig = {
  matcher: [
    {
      source: "/((?!api|_next/static|_next/image|.*\\.png$).*)",

      missing: [
        {
          type: "cookie",
          key: "session-token",
        },
      ],
    },
  ],
};
