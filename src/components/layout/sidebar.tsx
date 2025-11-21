"use client";

import { usePathname } from "next/navigation";
import { PanelsTopLeft } from "lucide-react";

import { SidebarItem } from "@/components/layout/sidebar-item";
import { mainNavigation, secondaryNavigation } from "@/components/layout/navigation";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const initials = user?.full_name
    ? user.full_name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "GM";

  return (
    <aside
      className="fixed left-0 top-0 z-40 hidden h-full w-64 flex-col border-r border-border bg-card/95 backdrop-blur lg:flex xl:w-72"
      aria-label="Sidebar"
    >
      <div className="flex h-16 items-center gap-3 border-b border-border px-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-sm font-semibold text-primary-foreground shadow-sm">
          GM
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <PanelsTopLeft className="h-4 w-4 text-primary" />
            GoMaintenance
          </div>
          <p className="text-xs text-muted-foreground">Fleet performance control</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="space-y-6">
          <nav className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Navigation</p>
            <ul className="space-y-1">
              {mainNavigation.map((item) => (
                <SidebarItem
                  key={item.href}
                  href={item.href}
                  label={item.title}
                  icon={item.icon}
                  isActive={
                    item.href === "/dashboard"
                      ? pathname === item.href
                      : pathname.startsWith(item.href)
                  }
                />
              ))}
            </ul>
          </nav>

          <nav className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Workspace</p>
            <ul className="space-y-1">
              {secondaryNavigation.map((item) => (
                <SidebarItem
                  key={item.href}
                  href={item.href}
                  label={item.title}
                  icon={item.icon}
                  isActive={pathname.startsWith(item.href)}
                />
              ))}
            </ul>
          </nav>
        </div>
      </div>

      <div className="border-t border-border px-4 py-4">
        <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 px-3 py-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold text-primary">
            {initials}
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Logged in as</span>
            <span className="text-sm font-semibold text-foreground">
              {user?.full_name ?? user?.email ?? "Guest"}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}

export function SidebarRailPlaceholder({ className }: { className?: string }) {
  return <div className={cn("hidden w-64 xl:w-72 lg:block", className)} aria-hidden />;
}
