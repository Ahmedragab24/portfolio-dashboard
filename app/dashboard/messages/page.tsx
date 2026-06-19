import { Suspense } from "react"

import { MessagesTable } from "@/components/messages-table"
import { Skeleton } from "@/components/ui/skeleton"

export default function MessagesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
      </div>
      <Suspense fallback={<MessagesTableSkeleton />}>
        <MessagesTable />
      </Suspense>
    </div>
  )
}

function MessagesTableSkeleton() {
  return (
    <div className="rounded-md border">
      <div className="border-b px-4 py-3">
        <Skeleton className="h-8 w-full" />
      </div>
      <div className="p-4">
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  )
}
