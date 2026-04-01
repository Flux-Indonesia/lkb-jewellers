import { NextRequest, NextResponse } from "next/server";
import { createAdminToken, type AdminRole } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  const adminPassword = process.env.ADMIN_PASSWORD;
  const seoPassword = process.env.SEO_PASSWORD;

  if (!adminPassword) {
    return NextResponse.json({ error: "Server not configured" }, { status: 500 });
  }

  let role: AdminRole | null = null;

  if (password === adminPassword) {
    role = "admin";
  } else if (seoPassword && password === seoPassword) {
    role = "seo";
  }

  if (!role) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  }

  const token = createAdminToken(role);

  const res = NextResponse.json({ success: true, role });
  res.cookies.set("admin_session", token, {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });

  return res;
}
