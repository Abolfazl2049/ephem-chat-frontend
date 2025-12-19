import { NextResponse, NextRequest } from "next/server";
import { fetchMyUserData } from "./features/user/service/fetch.util";
import { reInitFetch } from "./libs/ofetch";
import { USER_TOKEN } from "./features/auth/shared/service/utils/auth";

let isInitialized = false;
// Public routes that don't require authentication
const PUBLIC_ROUTES = ["/auth/create-session", "/auth/submit-token"];
// Auth proxy - handles authentication checks
async function authProxy(request: NextRequest) {
  const sessionToken = request.cookies.get("token")?.value;

  if (PUBLIC_ROUTES.includes(request.nextUrl.pathname)) {
    return NextResponse.next();
  }
  console.log(sessionToken);
  if (!sessionToken) {
    return NextResponse.redirect(new URL("/auth/create-session", request.url));
  }

  return NextResponse.next();
}

// User data proxy - fetches and validates user data
async function userDataProxy(request: NextRequest) {
  const sessionToken = request.cookies.get("token")?.value;
  console.log(sessionToken);

  if (!PUBLIC_ROUTES.includes(request.nextUrl.pathname) && sessionToken) {
    try {
      const user = await fetchMyUserData();
      console.log("User data fetched:", user);
      // You can attach user data to the response headers if needed
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      return NextResponse.redirect(new URL("/auth/create-session", request.url));
    }
  }

  return NextResponse.next();
}

// Main middleware orchestrator
export async function proxy(request: NextRequest) {
  if (!USER_TOKEN) reInitFetch();
  isInitialized = true;
  // Run auth proxy first
  const authResponse = await authProxy(request);
  if (authResponse.status !== 200) {
    return authResponse;
  }

  // Run user data proxy
  const userDataResponse = await userDataProxy(request);
  if (userDataResponse.status !== 200) {
    return userDataResponse;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    {
      source: "/((?!api|_next/static|_next/image|.*\\.png$).*)",
    },
  ],
};
