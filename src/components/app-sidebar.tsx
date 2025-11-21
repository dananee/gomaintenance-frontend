"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Truck,
  Wrench,
  ClipboardList,
  ShieldCheck,
  Settings2,
  PanelsTopLeft,
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const animationId = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(animationId);
  }, []);

  // Use consistent fallback during SSR/hydration
  const displayName = mounted
    ? user?.full_name ?? user?.email ?? "Guest"
    : "Guest";
  const displayInitial = mounted
    ? user?.full_name?.[0]?.toUpperCase() ?? "G"
    : "G";
  const displayRole = mounted && user ? user.role : null;

  return (
    <Sidebar className="border-r border-gm-border/70 bg-sidebar text-sidebar-foreground shadow-md backdrop-blur-xl">
      <SidebarHeader className="border-b border-gm-border/70 px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-gm-primary to-gm-secondary text-sm font-extrabold text-white shadow-gm">
            GM
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2 text-sm font-semibold tracking-tight">
              <PanelsTopLeft className="h-4 w-4 text-gm-accent" />
              GoMaintenance
            </div>
            <span className="text-xs text-gm-muted">
              Fleet performance control
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4 space-y-6">
        <div className="rounded-xl border border-gm-border/80 bg-white/70 p-3 shadow-gm-soft">
          <p className="text-[11px] uppercase tracking-wide text-gm-muted mb-3">
            Navigation
          </p>
          <SidebarMenu className="flex flex-col gap-1">
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
                        "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                        isActive
                          ? "bg-gradient-to-r from-gm-primary to-gm-secondary text-white shadow-md"
                          : "text-gm-muted hover:bg-gm-primary/10 hover:text-gm-secondary hover:shadow-sm"
                      )}
                    >
                      <motion.span
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-3"
                      >
                        <Icon
                          className={cn(
                            "h-4.5 w-4.5",
                            isActive ? "text-white" : "text-gm-secondary"
                          )}
                        />
                        <span>{item.title}</span>
                      </motion.span>
                      {isActive && (
                        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white shadow-sm" />
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </div>

        <div className="rounded-xl border border-gm-border/80 bg-white/60 p-3 shadow-gm-soft">
          <p className="text-[11px] uppercase tracking-wide text-gm-muted mb-2">
            Workspace
          </p>
          <SidebarMenu className="flex flex-col gap-1">
            {secondaryNav.map((item) => {
              const isActive = pathname.startsWith(item.href);
              const Icon = item.icon;

              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={isActive}>
                    <Link
                      href={item.href}
                      className={cn(
                        "group flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-all duration-200",
                        isActive
                          ? "bg-gm-secondary text-white shadow-md"
                          : "text-gm-muted hover:bg-gm-primary/10 hover:text-gm-secondary hover:shadow-sm"
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-4 w-4",
                          isActive ? "text-white" : "text-gm-secondary"
                        )}
                      />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </div>
      </SidebarContent>

      <SidebarFooter className="border-t border-gm-border/70 px-4 py-4 text-xs">
        <div className="flex items-center justify-between gap-3 rounded-xl bg-white/70 px-3 py-2 shadow-gm-soft">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gm-primary/15 text-sm font-semibold text-gm-secondary">
              {displayInitial}
            </span>
            <div className="flex flex-col">
              <span className="text-[11px] uppercase tracking-wide text-gm-muted">
                Logged in as
              </span>
              <span className="text-sm font-semibold text-foreground">
                {displayName}
              </span>
            </div>
          </div>
          {displayRole && (
            <span className="rounded-full bg-gm-panel px-2 py-1 text-[10px] font-semibold uppercase text-gm-secondary">
              {displayRole}
            </span>
          )}
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
