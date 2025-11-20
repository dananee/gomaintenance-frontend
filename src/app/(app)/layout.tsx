"use client";

import type { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar"; // ⬅️ named export from shadcn block

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gm-bg text-white">
        <AppSidebar />
        <div className="flex flex-1 flex-col">{children}</div>
      </div>
    </SidebarProvider>
  );
}
