import { NextResponse, type NextRequest } from "next/server";

// Simple in-memory rate limiter for middleware (Edge runtime compatible)
const hits = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = hits.get(ip);

  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }

  entry.count++;
  return entry.count <= limit;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rate limit API routes
  if (pathname.startsWith("/api/")) {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    // Stricter limits for sensitive endpoints
    let limit = 30;
    let windowMs = 60_000;

    if (pathname === "/api/auth" || pathname === "/api/auth/login") {
      limit = 5; // 5 attempts per minute for login
      windowMs = 60_000;
    } else if (pathname === "/api/checkout") {
      limit = 10; // 10 checkout attempts per minute
      windowMs = 60_000;
    } else if (pathname.startsWith("/api/design-generator")) {
      limit = 5; // 5 AI generations per minute
      windowMs = 60_000;
    } else if (pathname === "/api/enquiry" || pathname === "/api/newsletter" || pathname === "/api/sell-submission") {
      limit = 5; // 5 form submissions per minute
      windowMs = 60_000;
    }

    if (!checkRateLimit(`${pathname}:${ip}`, limit, windowMs)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*", "/dashboard/:path*"],
};
