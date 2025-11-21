"use client";

import type { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider defaultOpen={true}>
      {/* Main container - flex row layout */}
      <div className="flex min-h-screen w-full flex-row bg-gradient-to-br from-[#f8fbff] via-[#eef2f8] to-[#e5ebf5]">
        {/* Sidebar - fixed on left */}
        <AppSidebar />
        
        {/* Main content area - takes remaining space */}
        <main className="flex min-h-screen w-full flex-1 flex-col md:ml-[var(--sidebar-width)]">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
