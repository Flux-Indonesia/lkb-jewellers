import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  return NextResponse.json({ admin: isAuthenticated(request) });
}
