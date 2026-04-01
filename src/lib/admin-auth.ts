import { NextRequest } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";

const SECRET = process.env.ADMIN_PASSWORD || "";
const TOKEN_TTL = 7 * 24 * 60 * 60; // 7 days in seconds

export type AdminRole = "admin" | "seo";

/** Create a signed admin token: role.timestamp.signature */
export function createAdminToken(role: AdminRole = "admin"): string {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const payload = `${role}.${timestamp}`;
  const sig = createHmac("sha256", SECRET).update(payload).digest("hex");
  return `${role}.${timestamp}.${sig}`;
}

/** Verify a signed admin token from cookie. Returns role or null. */
export function verifyAdminToken(token: string): AdminRole | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const [role, timestamp, sig] = parts;
  if (role !== "admin" && role !== "seo") return null;

  const ts = parseInt(timestamp, 10);
  if (isNaN(ts)) return null;

  // Check expiry
  const now = Math.floor(Date.now() / 1000);
  if (now - ts > TOKEN_TTL) return null;

  // Verify signature with timing-safe comparison
  const payload = `${role}.${timestamp}`;
  const expected = createHmac("sha256", SECRET).update(payload).digest("hex");
  try {
    const valid = timingSafeEqual(Buffer.from(sig, "hex"), Buffer.from(expected, "hex"));
    return valid ? (role as AdminRole) : null;
  } catch {
    return null;
  }
}

/** Check if a request has a valid admin session */
export function isAuthenticated(request: NextRequest): boolean {
  return getRole(request) !== null;
}

/** Get the role from the admin session cookie */
export function getRole(request: NextRequest): AdminRole | null {
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(/admin_session=([^;]+)/);
  if (!match) return null;
  return verifyAdminToken(decodeURIComponent(match[1]));
}
