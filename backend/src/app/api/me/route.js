import { verifyJWT } from "@/lib/auth";
import corsHeaders from "@/lib/cors";
import { NextResponse } from "next/server";

export function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export function GET(request) {
  const user = verifyJWT(request);

  if (!user) {
    return NextResponse.json(
      { message: "Unauthorized Request", user: null },
      { status: 200, headers: corsHeaders }
    );
  }

  return NextResponse.json({ user }, {
    status: 200,
    headers: corsHeaders,
  });
}