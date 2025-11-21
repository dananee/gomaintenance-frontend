"use client";

import type { ReactNode } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider className="bg-gradient-to-br from-white/90 via-[#f0f4fa] to-white/80">
      <AppSidebar />
      <SidebarInset className="flex min-h-svh flex-1">
        <div className="flex flex-1 flex-col gap-6 px-4 pb-8 pt-4 md:px-8">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
