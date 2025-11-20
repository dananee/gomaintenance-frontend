"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Truck,
  Wrench,
  ClipboardList,
  ShieldCheck,
  Settings2,
} from "lucide-react";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const mainNav = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Vehicles",
    href: "/vehicles",
    icon: Truck,
  },
  {
    title: "Work Orders",
    href: "/maintenance/work-orders",
    icon: Wrench,
  },
  {
    title: "Maintenance Plans",
    href: "/maintenance/plans",
    icon: ClipboardList,
  },
  {
    title: "Inspections",
    href: "/inspections",
    icon: ShieldCheck,
  },
];

const secondaryNav = [
  {
    title: "Settings",
    href: "/settings",
    icon: Settings2,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-gm-border px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gm-primary text-xs font-extrabold text-black">
            GM
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">GoMaintenance</span>
            <span className="text-xs text-gm-muted">Fleet maintenance ERP</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-3">
        {/* Main navigation mapped to your backend resources */}
        <SidebarMenu className="mb-4">
          {mainNav.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === item.href
                : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={isActive}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition-colors",
                      isActive
                        ? "bg-gm-primary text-black"
                        : "text-gm-muted hover:bg-gm-card hover:text-white"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>

        {/* Secondary nav (settings etc.) */}
        <SidebarMenu>
          {secondaryNav.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={isActive}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 rounded-xl px-3 py-2 text-xs transition-colors",
                      isActive
                        ? "bg-gm-card text-white"
                        : "text-gm-muted hover:bg-gm-card hover:text-white"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t border-gm-border px-4 py-3 text-xs">
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-gm-muted">Logged in as</span>
            <span className="font-medium">
              {user?.full_name ?? user?.email ?? "User"}
            </span>
          </div>
          {user && (
            <span className="rounded-full bg-gm-card px-2 py-1 text-[10px] uppercase text-gm-muted">
              {user.role}
            </span>
          )}
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
