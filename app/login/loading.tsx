import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="w-full h-dvh flex items-center justify-center">
      <div className="flex items-center gap-4">
        <Loader2 className="h-6 w-6 text-primary animate-spin" />
        <h1 className="text-3xl font-bold tracking-tight">Loading...</h1>
      </div>
    </div>
  );
}
