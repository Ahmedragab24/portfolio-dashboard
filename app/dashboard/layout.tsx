"use client";

import type { ReactNode } from "react";
import { useAuth } from "@/contexts/auth-context";
import { SideNav } from "@/components/side-nav";
import { UserNav } from "@/components/user-nav";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Loading from "../login/loading";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { loading } = useAuth();

  if (loading) {
    return <Loading />;
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
