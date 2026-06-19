import { Suspense } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CategoriesTable } from "@/components/categories-table";
import { Skeleton } from "@/components/ui/skeleton";
import AddCategory from "@/components/add-category";

export default function CategoriesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
        <AddCategory>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </AddCategory>
      </div>
      <Suspense fallback={<CategoriesTableSkeleton />}>
        <CategoriesTable />
      </Suspense>
    </div>
  );
}

function CategoriesTableSkeleton() {
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
