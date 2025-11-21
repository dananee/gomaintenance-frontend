"use client";

import { usePathname } from "next/navigation";
import { PanelLeft } from "lucide-react";

import { SidebarItem } from "@/components/layout/sidebar-item";
import { mainNavigation, secondaryNavigation } from "@/components/layout/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

type SidebarMobileProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function SidebarMobile({ open, onOpenChange }: SidebarMobileProps) {
  const pathname = usePathname();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-72 p-0">
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
                    onNavigate={() => onOpenChange(false)}
                  />
                ))}
              </ul>
            </div>

            <Separator />

            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Workspace</p>
              <ul className="space-y-1">
                {secondaryNavigation.map((item) => (
                  <SidebarItem
                    key={item.href}
                    href={item.href}
                    label={item.title}
                    icon={item.icon}
                    isActive={pathname.startsWith(item.href)}
                    onNavigate={() => onOpenChange(false)}
                  />
                ))}
              </ul>
            </div>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}
