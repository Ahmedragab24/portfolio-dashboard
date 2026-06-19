import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import StatisticsTable from "@/components/statisticsTable";

export default function StatisticsPage() {
  return (
    <div className="flex flex-col gap-6">
      <Suspense fallback={<StatisticsTableSkeleton />}>
        <StatisticsTable />
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
