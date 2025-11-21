"use client";

import React from "react";
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
    <header className="flex flex-col gap-3 border-b border-gm-border bg-black/30 px-4 py-3 backdrop-blur-md md:flex-row md:items-center md:justify-between md:px-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-lg font-semibold tracking-tight md:text-xl">
          {title}
        </h1>
        {description && (
          <p className="text-xs text-gm-muted md:text-sm">{description}</p>
        )}
      </div>

      <div className="flex flex-1 flex-col items-stretch gap-3 md:flex-row md:items-center md:justify-end">
        <div className="flex w-full items-center gap-2 rounded-xl border border-gm-border bg-gm-card px-3 py-2 text-sm text-gm-muted shadow-inner md:max-w-md">
          <Search className="h-4 w-4" />
          <Input
            placeholder="Search vehicles, orders, technicians..."
            className="border-0 bg-transparent px-0 text-sm text-white focus-visible:ring-0"
          />
          <kbd className="hidden rounded border border-gm-border/80 bg-black/30 px-1.5 py-0.5 text-[10px] uppercase text-gm-muted md:inline-block">
            /
          </kbd>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="hidden gap-2 rounded-lg border-gm-border bg-gm-card text-sm font-medium text-white hover:border-gm-primary hover:text-white md:inline-flex"
          >
            <Sparkles className="h-4 w-4 text-gm-primary" />
            Quick action
          </Button>

          <Button
            size="icon"
            variant="ghost"
            className="rounded-full text-gm-muted hover:bg-gm-card"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
          </Button>

          {userName && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 rounded-full border border-gm-border bg-gm-card px-2 py-1 text-xs text-white hover:border-gm-primary"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gm-primary text-xs font-bold text-black">
                    {userName
                      .split(" ")
                      .map((p) => p[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </span>
                  <div className="hidden text-left md:block">
                    <p className="text-xs text-gm-muted">Logged in as</p>
                    <p className="text-sm font-medium text-white">{userName}</p>
                  </div>
                  <ChevronsUpDown className="h-4 w-4 text-gm-muted" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-gm-card text-white">
                <DropdownMenuItem className="text-sm text-gm-muted hover:bg-gm-border/40">
                  View profile
                </DropdownMenuItem>
                <DropdownMenuItem className="text-sm text-gm-muted hover:bg-gm-border/40">
                  Company settings
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
