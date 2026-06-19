import AboutTable from "@/components/about-table";
import { Skeleton } from "@/components/ui/skeleton";
import React, { Suspense } from "react";

export default function () {
  return (
    <div className="flex flex-col gap-6">
      <Suspense fallback={<StatisticsTableSkeleton />}>
        <AboutTable />
      </Suspense>
    </div>
  );
}

function StatisticsTableSkeleton() {
  return (
    <div className="rounded-md border">
      <div className="border-b px-4 py-3">
        <Skeleton className="h-8 w-full" />
      </div>
      <div className="p-4">
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  );
}
