import { X_HEADER_USER_EMAIL, X_HEADER_USER_NAME } from "@/lib/constant";
// src/app/api/item/route.js
import { getClientPromise } from "@/lib/mongodb";
import { errorResponse, printExceptionLog, successResponse } from "@/lib/utils";
import corsHeaders from "@/lib/cors";

export async function OPTIONS(request) {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function GET(request) {
  try {
    const client = await getClientPromise();
    const db = client.db(process.env.DB_NAME);
    
    // Filter to only find ACTIVE items
    const itemList = await db
      .collection("item")
      .find({ status: "ACTIVE" })
      .toArray();
    
    return successResponse({ itemList }, 200);
  } catch (error) {
    printExceptionLog("GET Items", error);
    return errorResponse("GET Item Internal Error", 500);
  }
}



export async function POST(request) {
  try {
    const data = await request.json();
    const name = data.name;
    const category = data.category;
    const price = data.price;
    const amount = data.amount;

    const client = await getClientPromise();
    const db = client.db(process.env.DB_NAME);
    
    const insertResult = await db.collection("item").insertOne({
      name: name,
      category: category,
      price: price,
      amount: amount,
      status: "ACTIVE", // Set default status for new items
    });

    // --- Audit Log ---
    const userEmail = request.headers.get(X_HEADER_USER_EMAIL) || "unknown";
    const userName = request.headers.get(X_HEADER_USER_NAME) || "unknown";
    await db.collection("audit_log").insertOne({
      action: "ADD_ITEM",
      itemId: insertResult.insertedId,
      itemName: name,
      userEmail: userEmail,
      userName: userName,
      timestamp: new Date()
    });
    // -----------------

    return successResponse(
      {
        id: insertResult.insertedId,
      },
      201
    );
  } catch (error) {
    printExceptionLog("POST Items", error);
    return errorResponse("POST Item Internal Error", 500);
  }
}