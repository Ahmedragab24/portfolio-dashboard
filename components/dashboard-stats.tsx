import { getProjects, getCategories, getMessages } from "@/lib/appwrite"

export async function DashboardStats({ type }: { type?: string }) {
  try {
    const projects = await getProjects()
    const categories = await getCategories()
    const messages = await getMessages()

    if (type === "projects") {
      return <>{projects.length}</>
    }

    if (type === "categories") {
      return <>{categories.length}</>
    }

    if (type === "messages") {
      return <>{messages.length}</>
    }

    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <p className="text-sm font-medium">Total Projects</p>
          </div>
          <div className="text-2xl font-bold">{projects.length}</div>
        </div>
        <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <p className="text-sm font-medium">Total Categories</p>
          </div>
          <div className="text-2xl font-bold">{categories.length}</div>
        </div>
        <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <p className="text-sm font-medium">Unread Messages</p>
          </div>
          <div className="text-2xl font-bold">{messages.length}</div>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error in DashboardStats:", error)

    // Return a fallback UI when there's an error
    if (type) {
      return <>0</>
    }

    return (
      <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <p className="text-sm font-medium">Configuration Error</p>
        </div>
        <div className="text-sm text-muted-foreground">
          Please check your environment variables and Appwrite configuration.
        </div>
      </div>
    )
  }
}
