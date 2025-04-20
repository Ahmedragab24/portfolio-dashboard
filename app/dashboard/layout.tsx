"use client";

import type { ReactNode } from "react";
import { useAuth } from "@/contexts/auth-context";
import { SideNav } from "@/components/side-nav";
import { UserNav } from "@/components/user-nav";
import { Loader2 } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <SidebarProvider className="flex min-h-screen w-full">
      {/* Sidebar */}
      <SideNav />

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
          <SidebarTrigger />
          <div className="flex flex-1 justify-end">
            <UserNav />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 md:p-8">{children}</main>
      </div>
    </SidebarProvider>
  );
}
