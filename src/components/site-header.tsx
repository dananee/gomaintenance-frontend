"use client";

import React from "react";

type SiteHeaderProps = {
  title: string;
  description?: string;
  userName?: string;
};

export function SiteHeader({ title, description, userName }: SiteHeaderProps) {
  return (
    <header className="flex items-center justify-between gap-4 border-b border-gm-border bg-black/40 px-4 py-3 backdrop-blur-md md:px-6">
      <div>
        <h1 className="text-lg font-semibold tracking-tight md:text-xl">
          {title}
        </h1>
        {description && (
          <p className="text-xs text-gm-muted md:text-sm">{description}</p>
        )}
      </div>
      {userName && (
        <div className="flex items-center gap-3 text-right">
          <div className="flex flex-col">
            <span className="text-xs text-gm-muted">Logged in as</span>
            <span className="text-sm font-medium">{userName}</span>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gm-primary text-xs font-bold text-black">
            {userName
              .split(" ")
              .map((p) => p[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </div>
        </div>
      )}
    </header>
  );
}
