"use client";

import type { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar"; // ⬅️ named export from shadcn block

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-transparent text-foreground">
        <AppSidebar />
        <div className="flex flex-1 flex-col bg-gradient-to-br from-[#f8fbff]/80 via-[#eef2f8]/70 to-[#e5ebf5]/80">
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
}
