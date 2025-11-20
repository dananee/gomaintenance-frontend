"use client";

import { ReactNode, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/vehicles", label: "Vehicles" },
  { href: "/maintenance/work-orders", label: "Work Orders" },
  { href: "/maintenance/plans", label: "Plans" },
];

export function AppShell({ children }: { children: ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-gm-muted">Loading GoMaintenance…</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gm-bg text-white">
      {/* Sidebar */}
      <aside className="w-64 border-r border-gm-border bg-black/40 backdrop-blur-md hidden md:flex flex-col">
        <div className="px-5 py-4 border-b border-gm-border flex items-center gap-2">
          <div className="h-9 w-9 rounded-2xl bg-gm-primary flex items-center justify-center text-black font-bold">
            GM
          </div>
          <div>
            <p className="font-semibold text-sm">GoMaintenance</p>
            <p className="text-xs text-gm-muted">Fleet GMAO</p>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <motion.div key={link.href} whileHover={{ x: 4 }}>
                <Link
                  href={link.href}
                  className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition-colors ${
                    active
                      ? "bg-gm-primary text-black"
                      : "text-gm-muted hover:bg-gm-card hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              </motion.div>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gm-border text-xs text-gm-muted">
          Logged in as <span className="text-white">{user.full_name}</span>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col">
        <header className="h-14 border-b border-gm-border flex items-center justify-between px-4 bg-black/40 backdrop-blur-md">
          <h1 className="text-sm font-medium text-gm-muted">
            Welcome back,{" "}
            <span className="text-white font-semibold">{user.full_name}</span>
          </h1>
          <div className="flex items-center gap-3">
            <span className="text-xs px-2 py-1 rounded-full bg-gm-card text-gm-muted uppercase">
              {user.role}
            </span>
            <Button
              variant="outline"
              size="sm"
              className="border-gm-border text-gm-muted hover:bg-gm-card"
              onClick={() => logout()}
            >
              Logout
            </Button>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 bg-gradient-to-br from-gm-bg via-black to-gm-bg">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
