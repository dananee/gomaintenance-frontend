"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PanelLeft } from "lucide-react";

import { mainNavigation, secondaryNavigation } from "./navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

type SidebarMobileProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function SidebarMobile({ open, onOpenChange }: SidebarMobileProps) {
  const pathname = usePathname();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-72 border-r border-border p-0">
        <SheetHeader className="sr-only">
          <SheetTitle>Navigation</SheetTitle>
        </SheetHeader>

        <div className="flex h-16 items-center gap-3 border-b border-border px-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() => onOpenChange(false)}
            aria-label="Close sidebar"
          >
            <PanelLeft className="h-4 w-4" />
          </Button>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">GoMaintenance</span>
            <span className="text-xs text-muted-foreground">Fleet performance control</span>
          </div>
        </div>

        <div className="h-[calc(100vh-4rem)] overflow-y-auto px-4 py-6">
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
                        onClick={() => onOpenChange(false)}
                      >
                        <item.icon className="h-4 w-4" />
                        <span className={cn("truncate", active && "font-medium")}>{item.title}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            <Separator />

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
                        onClick={() => onOpenChange(false)}
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
      </SheetContent>
    </Sheet>
  );
}
