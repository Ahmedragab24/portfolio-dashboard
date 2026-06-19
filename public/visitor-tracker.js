// Visitor tracking script for your portfolio
;(() => {
  // Only track visits once per session
  if (sessionStorage.getItem("visit-tracked")) return

  // Track the visit
  fetch("https://your-dashboard-url.com/api/track-visit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Optional: Add a secret key for security
      // 'Authorization': 'Bearer your-secret-key'
    },
  })
    .then((response) => {
      if (response.ok) {
        // Mark this visit as tracked for this session
        sessionStorage.setItem("visit-tracked", "true")
      }
    })
    .catch((error) => {
      console.error("Failed to track visit:", error)
    })
})()
