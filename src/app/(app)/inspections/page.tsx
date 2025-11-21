"use client";

import { CalendarDays, AlertCircle, MapPin } from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const upcoming = [
  {
    id: 1,
    vehicle: "Ford Transit",
    date: "2024-07-05",
    location: "Depot A",
    status: "scheduled",
  },
  {
    id: 2,
    vehicle: "Volvo FH16",
    date: "2024-07-07",
    location: "On-site",
    status: "scheduled",
  },
];

const expired = [
  {
    id: 3,
    vehicle: "Iveco Daily",
    date: "2024-06-21",
    location: "Depot B",
    status: "overdue",
  },
];

const miniCalendar = [
  { day: "Mon", date: 1, label: "", state: "muted" },
  { day: "Tue", date: 2, label: "", state: "muted" },
  { day: "Wed", date: 3, label: "Hydraulics check", state: "busy" },
  { day: "Thu", date: 4, label: "", state: "free" },
  { day: "Fri", date: 5, label: "Transit inspection", state: "busy" },
  { day: "Sat", date: 6, label: "", state: "free" },
  { day: "Sun", date: 7, label: "", state: "muted" },
];

export default function InspectionsPage() {
  return (
    <>
      <SiteHeader
        title="Inspections"
        description="Track upcoming and expired inspections across the fleet."
      />

      <main className="flex-1 space-y-6 overflow-x-hidden px-4 py-6 md:px-6 md:py-8 lg:px-10 lg:py-10">
        <div className="grid gap-4 lg:grid-cols-[2fr_1.2fr]">
          <Card className="rounded-2xl border-gm-border bg-gm-card/60 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Upcoming inspections
                </p>
                <p className="text-xs text-gm-muted">
                  Proactive scheduling keeps compliance healthy.
                </p>
              </div>
              <Badge className="rounded-full bg-gm-primary/10 text-gm-primary">
                {upcoming.length} scheduled
              </Badge>
            </div>
            <div className="mt-4 grid gap-3">
              {upcoming.map((item) => (
                <Card
                  key={item.id}
                  className="rounded-2xl border-gm-border/60 bg-gm-panel p-4"
                >
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-foreground">
                        {item.vehicle}
                      </p>
                      <p className="text-xs text-gm-muted">{item.location}</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gm-muted">
                      <CalendarDays className="h-4 w-4" />
                      {new Date(item.date).toLocaleDateString()}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>

          <Card className="rounded-2xl border-gm-border bg-gm-card/60 p-5">
            <p className="text-sm font-semibold text-foreground">
              Calendar view
            </p>
            <p className="text-xs text-gm-muted">
              Week overview with quick badges.
            </p>
            <div className="mt-4 grid grid-cols-7 gap-2 text-center text-xs text-gm-muted">
              {miniCalendar.map((day) => (
                <div
                  key={day.date}
                  className={`flex flex-col items-center gap-1 rounded-xl border px-2 py-3 ${tileTone(
                    day.state
                  )}`}
                >
                  <span className="text-[11px] uppercase tracking-wide">
                    {day.day}
                  </span>
                  <span className="text-lg font-semibold text-foreground">
                    {day.date}
                  </span>
                  <span className="text-[11px] text-gm-muted">{day.label}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card className="rounded-2xl border-gm-border bg-gm-card/60 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground">
                Expired inspections
              </p>
              <p className="text-xs text-gm-muted">
                Take action on overdue safety checks.
              </p>
            </div>
            <Badge className="rounded-full bg-red-500/15 text-red-200">
              {expired.length} overdue
            </Badge>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {expired.map((item) => (
              <Card
                key={item.id}
                className="rounded-2xl border border-red-500/30 bg-gm-panel p-4"
              >
                <div className="flex items-center gap-2 text-red-200">
                  <AlertCircle className="h-4 w-4" /> Overdue
                </div>
                <p className="mt-2 text-sm font-semibold text-foreground">
                  {item.vehicle}
                </p>
                <p className="text-xs text-gm-muted">
                  {new Date(item.date).toLocaleDateString()}
                </p>
                <div className="mt-3 flex items-center gap-2 text-xs text-gm-muted">
                  <MapPin className="h-4 w-4" /> {item.location}
                </div>
              </Card>
            ))}
          </div>
        </Card>
      </main>
    </>
  );
}

function tileTone(state: "muted" | "busy" | "free") {
  if (state === "busy")
    return "border-gm-primary/50 bg-gm-primary/5 text-foreground";
  if (state === "free") return "border-gm-border/60 bg-black/20";
  return "border-gm-border/30 bg-black/10 text-gm-muted";
}
