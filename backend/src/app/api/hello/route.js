import corsHeaders from "@/lib/cors";
import { NextResponse } from "next/server";

// Handle preflight OPTIONS requests (this stops the browser from blocking it)
export async function OPTIONS(req) {
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function GET() {
  const message = {
    message: "hello world"
  };

  return NextResponse.json(message, {
    headers: corsHeaders,
  });
}