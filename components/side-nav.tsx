"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  Tag,
  MessageSquare,
  Users,
  BookOpenCheck,
  ChartNoAxesCombined,
  FileUser,
  ScrollText,
  ListTodo,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

export function SideNav() {
  const pathname = usePathname();

  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      isActive: pathname === "/dashboard",
    },
    {
      title: "About Me",
      href: "/dashboard/about",
      icon: FileUser,
      isActive: pathname.includes("/dashboard/about"),
    },
    {
      title: "Statistics",
      href: "/dashboard/statistics",
      icon: ChartNoAxesCombined,
      isActive: pathname.includes("/dashboard/statistics"),
    },

    {
      title: "Projects",
      href: "/dashboard/projects",
      icon: FolderKanban,
      isActive: pathname.includes("/dashboard/projects"),
    },

    {
      title: "Categories",
      href: "/dashboard/categories",
      icon: Tag,
      isActive: pathname.includes("/dashboard/categories"),
    },
    {
      title: "Messages",
      href: "/dashboard/messages",
      icon: MessageSquare,
      isActive: pathname.includes("/dashboard/messages"),
    },
    {
      title: "Reviews",
      href: "/dashboard/reviews",
      icon: Users,
      isActive: pathname.includes("/dashboard/reviews"),
    },
    {
      title: "Experience",
      href: "/dashboard/experience",
      icon: BookOpenCheck,
      isActive: pathname.includes("/dashboard/experience"),
    },
    {
      title: "Certificates",
      href: "/dashboard/certificates",
      icon: ScrollText,
      isActive: pathname.includes("/dashboard/certificates"),
    },
    {
      title: "Todo App",
      href: "/dashboard/todoList",
      icon: ListTodo,
      isActive: pathname.includes("/dashboard/todoList"),
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex h-14 items-center px-4">
          <Link href="/dashboard" className="flex items-center font-semibold">
            <span className="text-lg">Portfolio Dashboard</span>
          </Link>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="px-4">
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={item.isActive}
                tooltip={item.title}
              >
                <Link
                  href={item.href}
                  className={cn("flex items-center gap-3")}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
