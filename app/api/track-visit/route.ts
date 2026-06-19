import { type NextRequest, NextResponse } from "next/server"
import { incrementVisitorCount } from "../../../lib/api"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  })
}

export async function POST(request: NextRequest) {
  try {
    // Check for a secret key to prevent abuse (optional)
    const authorization = request.headers.get("authorization")
    const expectedSecret = process.env.VISITOR_TRACKING_SECRET

    // If a secret is configured, validate it
    if (expectedSecret && authorization !== `Bearer ${expectedSecret}`) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: corsHeaders,
      })
    }

    // Increment the visitor count
    await incrementVisitorCount()

    return new NextResponse(JSON.stringify({ success: true }), {
      status: 200,
      headers: corsHeaders,
    })
  } catch (error) {
    console.error("Error tracking visit:", error)
    return new NextResponse(JSON.stringify({ error: "Failed to track visit" }), {
      status: 500,
      headers: corsHeaders,
    })
  }
}
