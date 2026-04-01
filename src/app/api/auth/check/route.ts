import { NextRequest, NextResponse } from "next/server";
import { getRole } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  const role = getRole(request);
  return NextResponse.json({ admin: role !== null, role });
}
