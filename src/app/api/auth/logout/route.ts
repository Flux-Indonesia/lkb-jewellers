import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export async function POST() {
  const supabase = await createClient();
  await supabase.auth.signOut();

  const res = NextResponse.json({ success: true });
  res.cookies.set("admin_session", "", {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
  });

  return res;
}
