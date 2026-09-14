import corsHeaders from "@/lib/cors";
import { getClientPromise } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { isAdmin } from "@/lib/auth";
import { errorResponse, successResponse } from "@/lib/utils";
import { ObjectId } from "mongodb";

export async function OPTIONS(request) {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function PUT(request) {
  if (!isAdmin(request)) {
    return errorResponse("Unauthorized Request", 403);
  }

  try {
    const data = await request.json();
    const userId = data.userId;
    const newPassword = data.newPassword;

    if (!userId || !newPassword) {
      return errorResponse("Missing user ID or new password", 400);
    }

    const client = await getClientPromise();
    const db = client.db(process.env.DB_NAME);
    
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    const result = await db.collection("user").updateOne(
      { _id: new ObjectId(userId) },
      { $set: { password: hashedPassword } }
    );

    if (result.matchedCount === 0) {
      return errorResponse("User not found", 404);
    }

    return successResponse({ message: "Password updated successfully" }, 200);
  } catch (error) {
    console.log("==>PUT password exception");
    console.log(error);
    return errorResponse("Internal Server Error", 500);
  }
}
