"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PanelsTopLeft } from "lucide-react";

import { mainNavigation, secondaryNavigation } from "./navigation";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

type AppSidebarProps = {
  className?: string;
};

export function AppSidebar({ className }: AppSidebarProps) {
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
      className={cn(
        "fixed left-0 top-0 z-40 hidden h-full w-64 flex-col border-r border-border bg-card text-foreground shadow-sm lg:flex xl:w-72",
        className,
      )}
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
        <nav className="space-y-6">
          <div className="space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Navigation</p>
            <ul className="space-y-1">
              {mainNavigation.map((item) => {
                const active =
                  item.href === "/dashboard"
                    ? pathname === item.href
                    : pathname.startsWith(item.href);

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors",
                        active
                          ? "bg-primary/10 text-primary shadow-sm"
                          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      <span className={cn("truncate", active && "font-medium")}>{item.title}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Workspace</p>
            <ul className="space-y-1">
              {secondaryNavigation.map((item) => {
                const active = pathname.startsWith(item.href);

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors",
                        active
                          ? "bg-primary/10 text-primary shadow-sm"
                          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      <span className={cn("truncate", active && "font-medium")}>{item.title}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>
      </div>

      <div className="border-t border-border px-4 py-4">
        <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/40 px-3 py-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold text-primary">
            {initials}
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground">Workspace</span>
            <span className="text-sm font-semibold text-foreground">
              {user?.full_name ?? user?.email ?? "Guest"}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
