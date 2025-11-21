"use client";

import React from "react";
import { motion } from "framer-motion";
import { Bell, ChevronsUpDown, Search, Sparkles } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

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
    <header className="flex h-16 shrink-0 items-center border-b bg-white/95 px-4 backdrop-blur-xl transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="mx-auto flex w-full max-w-7xl items-center gap-2">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex flex-col">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage className="line-clamp-1 text-lg font-semibold">
                    {title}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            {description && (
              <p className="text-xs text-gm-muted">{description}</p>
            )}
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          {/* Search bar - hidden on mobile */}
          <div className="hidden items-center gap-2 rounded-xl border border-gm-border bg-white px-4 py-2 text-sm shadow-sm transition-all focus-within:border-gm-primary focus-within:ring-2 focus-within:ring-gm-primary/20 md:flex md:w-72 lg:w-96">
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
              size="sm"
              variant="outline"
              className="hidden gap-2 rounded-xl border-gm-border bg-white px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-all hover:border-gm-primary hover:bg-gm-primary/5 hover:shadow-md lg:inline-flex"
            >
              <Sparkles className="h-4 w-4 text-gm-primary" />
              Quick action
            </Button>
          </motion.div>

          {/* Notifications */}
          <Button
            size="icon"
            variant="ghost"
            className="h-9 w-9 rounded-xl text-gm-muted transition-all hover:bg-gm-primary/10 hover:text-gm-primary"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
          </Button>

          {/* User menu */}
          {userName && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex h-10 items-center gap-2 rounded-xl border border-gm-border bg-white px-2 text-sm text-foreground shadow-sm transition-all hover:border-gm-primary hover:bg-gm-primary/5 hover:shadow-md"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-gm-primary to-gm-secondary text-xs font-bold text-white shadow-sm">
                    {userName
                      .split(" ")
                      .map((p) => p[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </span>
                  <div className="hidden text-left lg:block">
                    <p className="text-sm font-medium text-foreground">
                      {userName}
                    </p>
                  </div>
                  <ChevronsUpDown className="h-3.5 w-3.5 text-gm-muted" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 rounded-xl border-gm-border bg-white/98 p-2 text-foreground shadow-xl backdrop-blur-sm"
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
