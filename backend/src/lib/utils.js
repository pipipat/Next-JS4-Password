import { NextResponse } from "next/server";
import corsHeaders from "./cors";

export function printExceptionLog(logMessage, error) {
  console.log(`==>${logMessage} Exception`);
  console.log(error);
}

export function errorResponse(message, status = 400) {
  return NextResponse.json(
    { message: message },
    { status: status, headers: corsHeaders }
  );
}

export function successResponse(jsonData, status = 200) {
  return NextResponse.json(jsonData, {
    status: status,
    headers: corsHeaders,
  });
}