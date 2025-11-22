"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, AlertCircle, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { apiFetch } from "@/lib/api-client";

type TechnicalVisit = {
  id: number;
  vehicle_id: number;
  visit_type?: string | null;
  planned_date?: string | null;
  actual_date?: string | null;
  result?: string | null;
  valid_until?: string | null;
};

export default function InspectionsPage() {
  const { token } = useAuth();
  const [visits, setVisits] = useState<TechnicalVisit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiFetch<TechnicalVisit[]>("/visits", {}, token);
        setVisits(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
        setError("Failed to load technical visits");
        setVisits([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [token]);

  const today = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
  }, []);

  const upcoming = useMemo(
    () =>
      visits.filter((visit) => {
        if (!visit.planned_date) return false;
        const planned = new Date(visit.planned_date);
        planned.setHours(0, 0, 0, 0);
        return planned >= today;
      }),
    [today, visits]
  );

  const expired = useMemo(
    () =>
      visits.filter((visit) => {
        const planned = visit.planned_date ? new Date(visit.planned_date) : null;
        const valid = visit.valid_until ? new Date(visit.valid_until) : null;
        if (visit.actual_date) return false;
        if (valid) {
          valid.setHours(0, 0, 0, 0);
          if (valid < today) return true;
        }
        if (planned) {
          planned.setHours(0, 0, 0, 0);
          return planned < today;
        }
        return false;
      }),
    [today, visits]
  );

  const miniCalendar = useMemo(() => {
    const days = [] as { day: string; date: number; label: string; state: "muted" | "busy" | "free" }[];
    for (let i = 0; i < 7; i += 1) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const labelVisit = visits.find((v) => {
        if (!v.planned_date) return false;
        const planned = new Date(v.planned_date);
        planned.setHours(0, 0, 0, 0);
        return planned.getTime() === d.getTime();
      });

        const label = labelVisit?.visit_type || labelVisit?.result || "";
        days.push({
          day: d.toLocaleDateString(undefined, { weekday: "short" }),
          date: d.getDate(),
          label,
          state: label ? "busy" : "free",
        });
      }
    return days;
  }, [today, visits]);

  const formatDate = (value?: string | null) =>
    value
      ? new Date(value).toLocaleDateString(undefined, {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
      : "n/a";

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-gm-soft">
          {error}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-[2fr_1.2fr]">
        <Card className="rounded-2xl border-gm-border bg-gm-card/60 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground">Upcoming inspections</p>
              <p className="text-xs text-gm-muted">
                Loaded from the backend /visits endpoint.
              </p>
            </div>
            <Badge className="rounded-full bg-gm-primary/10 text-gm-primary">
              {loading ? "Loading" : `${upcoming.length} scheduled`}
            </Badge>
          </div>
          <div className="mt-4 grid gap-3">
            {loading &&
              Array.from({ length: 2 }).map((_, i) => (
                <Card
                  key={i}
                  className="h-20 animate-pulse rounded-2xl border-gm-border/60 bg-gm-panel"
                />
              ))}
            {!loading && upcoming.length === 0 && (
              <Card className="rounded-2xl border-gm-border/60 bg-gm-panel p-4 text-sm text-gm-muted">
                No upcoming visits found.
              </Card>
            )}
            {!loading &&
              upcoming.map((item) => (
                <Card
                  key={item.id}
                  className="rounded-2xl border-gm-border/60 bg-gm-panel p-4"
                >
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-foreground">Vehicle #{item.vehicle_id}</p>
                      <p className="text-xs text-gm-muted">{item.visit_type || "Inspection"}</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gm-muted">
                      <CalendarDays className="h-4 w-4" />
                      {formatDate(item.planned_date)}
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        </Card>

        <Card className="rounded-2xl border-gm-border bg-gm-card/60 p-5">
          <p className="text-sm font-semibold text-foreground">Calendar view</p>
          <p className="text-xs text-gm-muted">Week overview with quick badges.</p>
          <div className="mt-4 grid grid-cols-7 gap-2 text-center text-xs text-gm-muted">
            {miniCalendar.map((day) => (
              <div
                key={`${day.day}-${day.date}`}
                className={`flex flex-col items-center gap-1 rounded-xl border px-2 py-3 ${tileTone(day.state)}`}
              >
                <span className="text-[11px] uppercase tracking-wide">{day.day}</span>
                <span className="text-lg font-semibold text-foreground">{day.date}</span>
                <span className="text-[11px] text-gm-muted">{day.label}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="rounded-2xl border-gm-border bg-gm-card/60 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground">Expired inspections</p>
            <p className="text-xs text-gm-muted">Take action on overdue safety checks.</p>
          </div>
          <Badge className="rounded-full bg-red-500/15 text-red-200">
            {loading ? "Loading" : `${expired.length} overdue`}
          </Badge>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {loading &&
            Array.from({ length: 3 }).map((_, i) => (
              <Card
                key={i}
                className="h-28 animate-pulse rounded-2xl border border-red-500/30 bg-gm-panel"
              />
            ))}
          {!loading && expired.length === 0 && (
            <Card className="rounded-2xl border border-red-500/30 bg-gm-panel p-4 text-sm text-gm-muted">
              All inspections are up to date.
            </Card>
          )}
          {!loading &&
            expired.map((item) => (
              <Card
                key={item.id}
                className="rounded-2xl border border-red-500/30 bg-gm-panel p-4"
              >
                <div className="flex items-center gap-2 text-red-200">
                  <AlertCircle className="h-4 w-4" /> Overdue
                </div>
                <p className="mt-2 text-sm font-semibold text-foreground">Vehicle #{item.vehicle_id}</p>
                <p className="text-xs text-gm-muted">
                  Planned {formatDate(item.planned_date)}
                </p>
                <div className="mt-3 flex items-center gap-2 text-xs text-gm-muted">
                  <MapPin className="h-4 w-4" /> {item.visit_type || "Inspection"}
                </div>
              </Card>
            ))}
        </div>
      </Card>
    </div>
  );
}

function tileTone(state: "muted" | "busy" | "free") {
  if (state === "busy")
    return "border-gm-primary/50 bg-gm-primary/5 text-foreground";
  if (state === "free") return "border-gm-border/60 bg-black/20";
  return "border-gm-border/30 bg-black/10 text-gm-muted";
}
