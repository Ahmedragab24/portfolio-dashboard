"use client"

import { useEffect } from "react"

export function VisitorTrackingScript() {
  useEffect(() => {
    // Only track visits in production and once per session
    if (process.env.NODE_ENV === "production" && !sessionStorage.getItem("visit-tracked")) {
      const trackVisit = async () => {
        try {
          // Replace with your actual dashboard URL
          const dashboardUrl = process.env.NEXT_PUBLIC_DASHBOARD_URL || "https://your-dashboard-url.com"

          await fetch(`${dashboardUrl}/api/track-visit`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              // Optional: Add a secret key for security
              // "Authorization": `Bearer ${process.env.NEXT_PUBLIC_VISITOR_TRACKING_SECRET}`
            },
          })

          // Mark this visit as tracked for this session
          sessionStorage.setItem("visit-tracked", "true")
        } catch (error) {
          console.error("Failed to track visit:", error)
        }
      }

      trackVisit()
    }
  }, [])

  return null
}
