"use client";

import React from "react";
import { motion } from "framer-motion";
import { Bell, ChevronsUpDown, Search, Sparkles } from "lucide-react";

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
    <header className="sticky top-0 z-30 w-full border-b border-gm-border/60 bg-white/85 px-4 py-4 backdrop-blur-xl shadow-gm-soft md:px-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-gm-muted">
            <span className="inline-flex h-6 items-center rounded-full bg-gm-primary/10 px-3 text-[11px] font-semibold text-gm-secondary">Fleet control</span>
            <span className="text-gm-muted">/</span>
            <span className="font-semibold text-gm-secondary">Operations</span>
          </div>
          <h1 className="text-2xl font-semibold leading-tight tracking-tight text-foreground md:text-3xl">
            {title}
          </h1>
          {description && (
            <p className="max-w-3xl text-sm text-gm-muted md:text-base">{description}</p>
          )}
        </div>

        <div className="flex flex-1 flex-col items-stretch gap-3 md:max-w-xl md:flex-row md:items-center md:justify-end">
          <div className="flex w-full items-center gap-2 rounded-2xl border border-gm-border bg-white px-3 py-2.5 text-sm shadow-gm-soft focus-within:ring-2 focus-within:ring-gm-primary/50">
            <Search className="h-4 w-4 text-gm-muted" />
            <Input
              placeholder="Search vehicles, orders, technicians..."
              className="border-0 bg-transparent px-0 text-sm text-foreground placeholder:text-gm-muted focus-visible:ring-0"
            />
            <kbd className="hidden rounded border border-gm-border/80 bg-gm-panel px-1.5 py-0.5 text-[10px] uppercase text-gm-muted md:inline-block">
              /
            </kbd>
          </div>

          <div className="flex items-center gap-2">
            <motion.div whileHover={{ y: -2 }}>
              <Button
                size="sm"
                variant="outline"
                className="hidden gap-2 rounded-xl border-gm-border bg-white px-4 text-sm font-medium text-foreground shadow-gm-soft hover:border-gm-primary hover:text-gm-secondary md:inline-flex"
              >
                <Sparkles className="h-4 w-4 text-gm-primary" />
                Quick action
              </Button>
            </motion.div>

            <Button
              size="icon"
              variant="ghost"
              className="rounded-full text-gm-muted hover:bg-gm-panel hover:text-gm-secondary"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
            </Button>

            {userName && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 rounded-full border border-gm-border bg-white px-2 py-1 text-xs text-foreground shadow-gm-soft hover:border-gm-primary"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-gm-primary to-gm-secondary text-xs font-bold text-white shadow-gm-soft">
                      {userName
                        .split(" ")
                        .map((p) => p[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </span>
                    <div className="hidden text-left md:block">
                      <p className="text-[11px] uppercase tracking-wide text-gm-muted">Logged in</p>
                      <p className="text-sm font-semibold text-foreground">{userName}</p>
                    </div>
                    <ChevronsUpDown className="h-4 w-4 text-gm-muted" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-xl border-gm-border bg-white/95 text-foreground shadow-gm-soft">
                  <DropdownMenuItem className="text-sm text-gm-muted hover:bg-gm-panel">View profile</DropdownMenuItem>
                  <DropdownMenuItem className="text-sm text-gm-muted hover:bg-gm-panel">Company settings</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
