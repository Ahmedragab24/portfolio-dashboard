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
  ChartBar,
  FileUser,
  ScrollText,
  ListTodo,
  PanelsTopLeft,
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
      title: "Todo App",
      href: "/dashboard/todoList",
      icon: ListTodo,
      isActive: pathname.includes("/dashboard/todoList"),
    },
  ];

  const websiteSectionItems = [
    {
      title: "About Me",
      href: "/dashboard/about",
      icon: FileUser,
    },
    {
      title: "Statistics",
      href: "/dashboard/statistics",
      icon: ChartBar,
    },
    {
      title: "Projects",
      href: "/dashboard/projects",
      icon: FolderKanban,
    },
    {
      title: "Categories",
      href: "/dashboard/categories",
      icon: Tag,
    },
    {
      title: "Messages",
      href: "/dashboard/messages",
      icon: MessageSquare,
    },
    {
      title: "Reviews",
      href: "/dashboard/reviews",
      icon: Users,
    },
    {
      title: "Experience",
      href: "/dashboard/experience",
      icon: BookOpenCheck,
    },
    {
      title: "Certificates",
      href: "/dashboard/certificates",
      icon: ScrollText,
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex h-14 items-center px-4">
          <Link
            href="/dashboard"
            className="text-lg text-primary font-semibold"
          >
            Ahmed Elmadany
          </Link>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu className="px-4">
          {/* Main Navigation */}
          <div className="flex flex-col gap-2 mb-4">
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
          </div>

          {/* Website Section */}
          <p className="mb-2 px-2 text-sm font-medium text-muted-foreground">
            Website
          </p>
          <div className="space-y-1">
            {websiteSectionItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.includes(item.href)}
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
          </div>
        </SidebarMenu>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
