import { type NextRequest, NextResponse } from "next/server"
import { incrementVisitorCount } from "@/lib/appwrite"

export async function POST(request: NextRequest) {
  try {
    // Check for a secret key to prevent abuse (optional)
    const { authorization } = request.headers
    const expectedSecret = process.env.VISITOR_TRACKING_SECRET

    // If a secret is configured, validate it
    if (expectedSecret && authorization !== `Bearer ${expectedSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the referrer to potentially track traffic sources
    const referrer = request.headers.get("referer") || "direct"

    // Increment the visitor count
    await incrementVisitorCount()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error tracking visit:", error)
    return NextResponse.json({ error: "Failed to track visit" }, { status: 500 })
  }
}
