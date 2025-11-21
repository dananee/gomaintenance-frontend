import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { useState, type ReactNode } from "react";

import { AppNavbar } from "@/components/layout/AppNavbar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarMobile } from "@/components/layout/SidebarMobile";
import { AuthProvider } from "@/hooks/useAuth";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-sans",
});

export const metadata: Metadata = {
  title: "GoMaintenance",
  description: "Vehicle maintenance GMAO powered by Go",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} min-h-screen bg-background text-foreground`}>
        <AuthProvider>
          <AppLayoutShell>{children}</AppLayoutShell>
        </AuthProvider>
      </body>
    </html>
  );
}

function AppLayoutShell({ children }: { children: ReactNode }) {
  "use client";

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
