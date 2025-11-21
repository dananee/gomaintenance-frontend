"use client";

import type { ReactNode } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarInset className="bg-gradient-to-br from-[#f8fbff] via-[#eef2f8] to-[#e5ebf5]">
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
