import { getVisitorStats } from "@/lib/appwrite";
import { formatDate } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, RefreshCw } from "lucide-react";

// Force dynamic rendering to always get fresh data
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function VisitorStats() {
  const stats = await getVisitorStats();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
        <Users className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {stats.total_visits.toLocaleString()}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Last updated: {formatDate(stats.last_updated)}
        </p>
      </CardContent>
    </Card>
  );
}
