"use client";

import type { ReactNode } from "react";
import { useState } from "react";

import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { SidebarMobile } from "@/components/layout/sidebar-mobile";
import { AppShell } from "@/components/ui/app-shell";

export default function AppLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AppShell
      sidebar={<Sidebar />}
      sidebarMobile={<SidebarMobile open={sidebarOpen} onOpenChange={setSidebarOpen} />}
      navbar={<Navbar onOpenSidebar={() => setSidebarOpen(true)} />}
      className="bg-gradient-to-br from-white via-muted/60 to-white"
    >
      <div className="mx-auto w-full max-w-7xl space-y-8">{children}</div>
    </AppShell>
  );
}
