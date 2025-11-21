"use client";

import React from "react";
import { motion } from "framer-motion";
import { Bell, ChevronsUpDown, Search, Sparkles } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type SiteHeaderProps = {
  title: string;
  description?: string;
  userName?: string;
};

export function SiteHeader({ title, description, userName }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gm-border/60 bg-white/95 backdrop-blur-xl shadow-sm">
      <div className="flex h-20 items-center justify-between gap-6 px-6 lg:px-8">
        {/* Left Section: Mobile Trigger + Title */}
        <div className="flex min-w-0 flex-1 items-center gap-4">
          {/* Mobile hamburger - only show on mobile/tablet */}
          <div className="flex items-center gap-3 lg:hidden">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="h-6" />
          </div>

          {/* Title and Breadcrumb */}
          <div className="flex min-w-0 flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-6 items-center rounded-full bg-gm-primary/10 px-3 text-[11px] font-semibold uppercase tracking-wider text-gm-secondary">
                Fleet control
              </span>
            </div>
            <h1 className="truncate text-2xl font-bold leading-tight tracking-tight text-foreground lg:text-3xl">
              {title}
            </h1>
            {description && (
              <p className="hidden truncate text-sm text-gm-muted lg:block">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Right Section: Actions */}
        <div className="flex items-center gap-3">
          {/* Search bar - hidden on mobile */}
          <div className="hidden items-center gap-2 rounded-xl border border-gm-border bg-white px-4 py-2.5 text-sm shadow-sm transition-all focus-within:border-gm-primary focus-within:ring-2 focus-within:ring-gm-primary/20 md:flex md:w-72 lg:w-96">
            <Search className="h-4 w-4 flex-shrink-0 text-gm-muted" />
            <Input
              placeholder="Search vehicles, orders, plans..."
              className="border-0 bg-transparent px-0 text-sm text-foreground placeholder:text-gm-muted focus-visible:ring-0"
            />
            <kbd className="hidden flex-shrink-0 rounded border border-gm-border/80 bg-gm-panel px-2 py-1 text-[10px] font-semibold uppercase text-gm-muted lg:inline-block">
              ⌘K
            </kbd>
          </div>

          {/* Quick action button */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              size="default"
              variant="outline"
              className="hidden gap-2 rounded-xl border-gm-border bg-white px-4 py-2.5 text-sm font-medium text-foreground shadow-sm transition-all hover:border-gm-primary hover:bg-gm-primary/5 hover:shadow-md lg:inline-flex"
            >
              <Sparkles className="h-4 w-4 text-gm-primary" />
              Quick action
            </Button>
          </motion.div>

          {/* Notifications */}
          <Button
            size="icon"
            variant="ghost"
            className="h-10 w-10 rounded-xl text-gm-muted transition-all hover:bg-gm-primary/10 hover:text-gm-primary"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
          </Button>

          {/* User menu */}
          {userName && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex h-12 items-center gap-3 rounded-xl border border-gm-border bg-white px-3 text-sm text-foreground shadow-sm transition-all hover:border-gm-primary hover:bg-gm-primary/5 hover:shadow-md"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-gm-primary to-gm-secondary text-xs font-bold text-white shadow-sm">
                    {userName
                      .split(" ")
                      .map((p) => p[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </span>
                  <div className="hidden text-left lg:block">
                    <p className="text-sm font-semibold text-foreground">
                      {userName}
                    </p>
                    <p className="text-xs text-gm-muted">Admin</p>
                  </div>
                  <ChevronsUpDown className="h-4 w-4 text-gm-muted" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-64 rounded-xl border-gm-border bg-white/98 p-2 text-foreground shadow-xl backdrop-blur-sm"
              >
                <div className="mb-2 px-3 py-2">
                  <p className="text-sm font-semibold text-foreground">{userName}</p>
                  <p className="text-xs text-gm-muted">admin@gomaintenance.io</p>
                </div>
                <Separator className="my-2" />
                <DropdownMenuItem className="cursor-pointer rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-gm-primary/10">
                  View profile
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-gm-primary/10">
                  Company settings
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-gm-primary/10">
                  Preferences
                </DropdownMenuItem>
                <Separator className="my-2" />
                <DropdownMenuItem className="cursor-pointer rounded-lg px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50">
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
