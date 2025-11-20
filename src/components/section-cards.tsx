"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export type StatCard = {
  title: string;
  value: string | number;
  trend?: string;
  accent?: "primary" | "danger" | "muted";
};

type SectionCardsProps = {
  cards: StatCard[];
  loading?: boolean;
};

export function SectionCards({ cards, loading }: SectionCardsProps) {
  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card
            key={i}
            className="h-24 animate-pulse rounded-2xl border-gm-border bg-gm-card/60"
          >
            <CardContent className="h-full" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {cards.map((card) => {
        let accentClasses = "border-gm-border bg-gm-card";
        if (card.accent === "primary") {
          accentClasses = "border-gm-primary/40 bg-gm-card";
        } else if (card.accent === "danger") {
          accentClasses = "border-red-500/40 bg-red-500/10";
        }

        return (
          <Card
            key={card.title}
            className={`rounded-2xl transition-all hover:-translate-y-1 hover:border-gm-primary ${accentClasses}`}
          >
            <CardContent className="p-4">
              <p className="mb-2 text-xs font-medium uppercase text-gm-muted">
                {card.title}
              </p>
              <p className="text-2xl font-semibold">{card.value}</p>
              {card.trend && (
                <p className="mt-1 text-xs text-gm-muted">{card.trend}</p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
