import { NextRequest } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";

const SECRET = process.env.ADMIN_PASSWORD || "";
const TOKEN_TTL = 7 * 24 * 60 * 60; // 7 days in seconds

/** Create a signed admin token: timestamp.signature */
export function createAdminToken(): string {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const sig = createHmac("sha256", SECRET).update(timestamp).digest("hex");
  return `${timestamp}.${sig}`;
}

/** Verify a signed admin token from cookie */
export function verifyAdminToken(token: string): boolean {
  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [timestamp, sig] = parts;
  const ts = parseInt(timestamp, 10);
  if (isNaN(ts)) return false;

  // Check expiry
  const now = Math.floor(Date.now() / 1000);
  if (now - ts > TOKEN_TTL) return false;

  // Verify signature with timing-safe comparison
  const expected = createHmac("sha256", SECRET).update(timestamp).digest("hex");
  try {
    return timingSafeEqual(Buffer.from(sig, "hex"), Buffer.from(expected, "hex"));
  } catch {
    return false;
  }
}

/** Check if a request has a valid admin session */
export function isAuthenticated(request: NextRequest): boolean {
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(/admin_session=([^;]+)/);
  if (!match) return false;
  return verifyAdminToken(decodeURIComponent(match[1]));
}
