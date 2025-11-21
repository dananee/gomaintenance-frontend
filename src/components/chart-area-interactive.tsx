"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type ChartPoint = {
  date: string;
  value: number;
};

type ChartAreaInteractiveProps = {
  title: string;
  description?: string;
  data: ChartPoint[];
  loading?: boolean;
};

export function ChartAreaInteractive({
  title,
  description,
  data,
  loading,
}: ChartAreaInteractiveProps) {
  // Just a simple inline SVG area/sparkline chart for now
  // (you can later swap to Recharts if you want)
  if (loading) {
    return (
      <Card className="rounded-xl border-border bg-card">
        <CardHeader>
          <div className="h-6 w-32 animate-pulse rounded bg-muted/60" />
          <div className="mt-2 h-4 w-48 animate-pulse rounded bg-muted/60" />
        </CardHeader>
        <CardContent>
          <div className="h-40 animate-pulse rounded-xl bg-muted/50" />
        </CardContent>
      </Card>
    );
  }

  const max = data.length ? Math.max(...data.map((d) => d.value)) : 1;
  const min = 0;
  const width = 320;
  const height = 140;

  const points = data.map((d, i) => {
    const x = (i / Math.max(data.length - 1, 1)) * width;
    const normalized = max === min ? 0 : (d.value - min) / (max - min);
    const y = height - normalized * height;
    return { x, y };
  });

  const pathD =
    points.length > 0
      ? [
          `M 0 ${height}`,
          `L ${points.map((p) => `${p.x} ${p.y}`).join(" L ")}`,
          `L ${width} ${height}`,
          "Z",
        ].join(" ")
      : `M0 ${height} L${width} ${height} L${width} ${height} Z`;

  return (
    <Card className="rounded-xl border-border bg-card shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-foreground">{title}</CardTitle>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex h-40 items-center justify-center text-xs text-muted-foreground">
            No data yet. Create some work orders to see activity.
          </div>
        ) : (
          <div className="h-40 w-full overflow-hidden">
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="h-full w-full"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="gmAreaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FFC400" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#FFC400" stopOpacity="0.05" />
                </linearGradient>
              </defs>
              <path d={pathD} fill="url(#gmAreaGradient)" />
              <polyline
                fill="none"
                stroke="#FFC400"
                strokeWidth={2}
                points={points.map((p) => `${p.x},${p.y}`).join(" ")}
              />
            </svg>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
