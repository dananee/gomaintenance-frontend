"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { Bell, Menu, Search, Sparkles } from "lucide-react";

import { routeMeta } from "./navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

type AppNavbarProps = {
  onOpenSidebar: () => void;
};

export function AppNavbar({ onOpenSidebar }: AppNavbarProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  const currentMeta = useMemo(() => {
    return (
      routeMeta.find((route) => pathname.startsWith(route.match)) ?? {
        title: "Overview",
        description: "Fleet workspace",
      }
    );
  }, [pathname]);

  const initials = user?.full_name
    ? user.full_name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "GM";

  return (
    <header className="sticky top-0 z-50 flex h-16 w-full items-center border-b border-border bg-card/80 px-6 backdrop-blur-md lg:px-10">
      <div className="flex w-full items-center justify-between gap-4">
        <div className="flex items-center gap-3 lg:gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="-ml-2 lg:hidden"
            onClick={onOpenSidebar}
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Fleet workspace
            </span>
            <span className="text-base font-semibold leading-tight text-foreground">
              {currentMeta.title}
            </span>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-end gap-2 lg:gap-4">
          <div className="hidden min-w-[260px] items-center gap-2 rounded-xl border border-border bg-background/60 px-3 py-2 text-sm shadow-sm transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15 md:flex">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search vehicles, orders, plans..."
              className="border-0 bg-transparent px-0 text-sm text-foreground placeholder:text-muted-foreground focus-visible:ring-0"
            />
            <kbd className="hidden rounded border border-border/80 bg-muted px-2 py-1 text-[10px] font-semibold text-muted-foreground lg:inline-block">
              ⌘K
            </kbd>
          </div>

          <Button
            size="sm"
            variant="secondary"
            className="hidden items-center gap-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 lg:inline-flex"
          >
            <Sparkles className="h-4 w-4" />
            Quick action
          </Button>

          <Button
            size="icon"
            variant="ghost"
            className="h-9 w-9 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex h-10 items-center gap-3 rounded-xl border border-border bg-background/60 px-2 text-sm text-foreground shadow-sm transition hover:border-primary hover:bg-primary/5"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                  {initials}
                </span>
                <div className="hidden text-left sm:block">
                  <p className="text-sm font-semibold leading-tight">{user?.full_name ?? "Guest"}</p>
                  <p className="text-xs text-muted-foreground">{user?.email ?? "admin@gomaintenance.io"}</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-xl border border-border bg-card p-2 shadow-lg">
              <div className="px-3 py-2">
                <p className="text-sm font-semibold text-foreground">{user?.full_name ?? "Guest"}</p>
                <p className="text-xs text-muted-foreground">{user?.email ?? "admin@gomaintenance.io"}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className={cn("cursor-pointer rounded-lg px-3 py-2")}>Profile</DropdownMenuItem>
              <DropdownMenuItem className={cn("cursor-pointer rounded-lg px-3 py-2")}>Settings</DropdownMenuItem>
              <DropdownMenuItem className={cn("cursor-pointer rounded-lg px-3 py-2 text-destructive")}>Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
