"use client";

import { useState, type ReactNode } from "react";

import { AppNavbar } from "@/components/layout/AppNavbar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarMobile } from "@/components/layout/SidebarMobile";

export function AppLayoutShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar className="hidden lg:flex" />
      <SidebarMobile open={open} onOpenChange={setOpen} />
      <div className="flex min-h-screen flex-1 flex-col lg:ml-64 xl:ml-72">
        <AppNavbar onOpenSidebar={() => setOpen(true)} />
        <main className="flex-1 w-full p-6 lg:p-10 xl:p-12">{children}</main>
      </div>
    </div>
  );
}
