import NextAuth from "next-auth";
import { authConfig } from "./lib/auth.config";
import type { NextRequest } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;

  const isApiRoute = pathname.startsWith("/api/");
  // API yang boleh tanpa login: register + next-auth itself
  const isPublicApi =
    pathname.startsWith("/api/auth/");

  const isProtectedRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/codex") ||
    pathname.startsWith("/import") ||
    (isApiRoute && !isPublicApi);

  const isAuthRoute =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register");

  // API protection: return 401 JSON, bukan redirect
  if (isProtectedRoute && !isLoggedIn) {
    if (isApiRoute) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    return Response.redirect(new URL("/login", nextUrl));
  }

  if (isAuthRoute && isLoggedIn) {
    return Response.redirect(new URL("/dashboard", nextUrl));
  }

  return;
});

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
    "/codex/:path*",
    "/import",
    "/import/:path*",
    "/login",
    "/register",
    "/api/:path*",
  ],
};
