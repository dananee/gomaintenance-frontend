"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Plus, Wrench, ClipboardList, Save, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { apiFetch } from "@/lib/api-client";

import { cn } from "@/lib/utils";

type TemplateLine = {
  id: number;
  operation_type_id?: number;
  spare_part_id?: number;
  quantity?: number;
  estimated_duration_hours?: number;
};

type Template = {
  id: number;
  name: string;
  trigger_type?: string | null;
  mileage_interval?: number | null;
  time_interval_days?: number | null;
  is_active?: boolean | null;
  vehicle_type_id?: number | null;
  lines?: TemplateLine[];
};

const defaultDraft: Omit<Template, "id"> = {
  name: "",
  trigger_type: "mileage",
  mileage_interval: 0,
  time_interval_days: 0,
  is_active: true,
  vehicle_type_id: 1,
  lines: [],
};

export default function MaintenancePlansPage() {
  const { token } = useAuth();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [draft, setDraft] = useState({ ...defaultDraft });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const activeCoverage = useMemo(
    () => `${templates.filter((tpl) => tpl.is_active !== false).length} active templates`,
    [templates]
  );

  useEffect(() => {
    if (!token) return;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiFetch<Template[]>("/templates", {}, token);
        setTemplates(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
        setError("Failed to load maintenance templates");
        setTemplates([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [token]);

  const intervalLabel = (tpl: Template) => {
    const parts = [] as string[];
    if (tpl.mileage_interval) parts.push(`${tpl.mileage_interval.toLocaleString()} km`);
    if (tpl.time_interval_days) parts.push(`${tpl.time_interval_days} days`);
    return parts.length > 0 ? parts.join(" · ") : "No interval set";
  };

  const triggerLabel = (tpl: Template) => tpl.trigger_type || "custom";

  const handleSave = async () => {
    if (!token) return;

    try {
      setLoading(true);
      setError(null);
      await apiFetch(
        "/templates",
        {
          method: "POST",
          body: JSON.stringify({
            name: draft.name,
            vehicle_type_id: draft.vehicle_type_id,
            trigger_type: draft.trigger_type,
            mileage_interval: draft.mileage_interval || undefined,
            time_interval_days: draft.time_interval_days || undefined,
            is_active: draft.is_active,
          }),
        },
        token
      );

      const refreshed = await apiFetch<Template[]>("/templates", {}, token);
      setTemplates(Array.isArray(refreshed) ? refreshed : []);
      setDraft({ ...defaultDraft });
    } catch (err) {
      console.error(err);
      setError("Failed to save template");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-gm-soft">
          {error}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <Card className="rounded-2xl border-gm-border bg-gm-card/60 p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-foreground">Template library</p>
              <p className="text-xs text-gm-muted">{activeCoverage}</p>
            </div>
            <Button
              className="gap-2 bg-gm-primary text-black hover:bg-gm-primary/90"
              onClick={() => {
                setDraft({ ...defaultDraft });
                formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
                setTimeout(() => nameInputRef.current?.focus(), 150);
              }}
            >
              <Plus className="h-4 w-4" /> New template
            </Button>
          </div>

          <div className="mt-4 grid gap-3">
            {loading &&
              Array.from({ length: 3 }).map((_, idx) => (
                <Card
                  key={idx}
                  className="h-28 animate-pulse rounded-2xl border-gm-border/70 bg-gm-panel"
                />
              ))}

            {!loading && templates.length === 0 && (
              <Card className="rounded-2xl border-gm-border/70 bg-gm-panel p-4 text-sm text-gm-muted">
                No templates yet. Create one using the form on the right to match your backend /templates endpoint.
              </Card>
            )}

            {!loading &&
              templates.map((tpl) => (
                <Card
                  key={tpl.id}
                  className="rounded-2xl border-gm-border/70 bg-gm-panel p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-gm-primary/60"
                >
                  <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-foreground">
                        <ClipboardList className="h-4 w-4 text-gm-primary" />
                        <span className="font-semibold">{tpl.name}</span>
                      </div>
                      <p className="text-xs text-gm-muted">Vehicle type ID {tpl.vehicle_type_id ?? "-"}</p>
                      <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-wide text-gm-muted">
                        <Badge className="border-gm-border bg-gm-border/10 text-foreground">
                          {triggerLabel(tpl)}
                        </Badge>
                        <Badge className="border-gm-border bg-gm-border/10 text-foreground">
                          {intervalLabel(tpl)}
                        </Badge>
                        <Badge className="border-gm-border bg-gm-border/10 text-foreground">
                          {tpl.lines?.length || 0} lines
                        </Badge>
                        <Badge
                          className={cn(
                            "border-gm-border bg-gm-border/10 text-foreground",
                            tpl.is_active === false && "border-red-500/40 bg-red-500/15 text-red-200"
                          )}
                        >
                          {tpl.is_active === false ? "Inactive" : "Active"}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gm-muted">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gm-muted hover:text-foreground"
                        disabled
                      >
                        <Save className="h-4 w-4" /> Save
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gm-muted hover:text-red-300"
                        disabled
                      >
                        <Trash2 className="h-4 w-4" /> Delete
                      </Button>
                    </div>
                  </div>
                  <Separator className="my-3 border-gm-border/50" />
                  <div className="grid gap-3 md:grid-cols-2 md:gap-6">
                    <div className="space-y-2 text-sm text-gm-muted">
                      <p className="text-xs uppercase tracking-wide text-gm-muted">Operations</p>
                      <div className="flex flex-wrap gap-2">
                        {tpl.lines && tpl.lines.length > 0 ? (
                          tpl.lines.map((line) => (
                            <Badge
                              key={line.id}
                              className="rounded-full bg-gm-card text-foreground"
                            >
                              <Wrench className="mr-1 h-3 w-3" /> Operation {line.operation_type_id || line.id}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-xs text-gm-muted">No lines provided</span>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-gm-muted">
                      <p className="text-xs uppercase tracking-wide text-gm-muted">Details</p>
                      <div className="flex flex-wrap gap-2">
                        <Badge className="rounded-full bg-gm-card text-foreground">
                          Trigger: {triggerLabel(tpl)}
                        </Badge>
                        <Badge className="rounded-full bg-gm-card text-foreground">
                          Interval: {intervalLabel(tpl)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        </Card>

        <Card ref={formRef} className="rounded-2xl border-gm-border bg-gm-card/60 p-5">
          <Tabs defaultValue="details">
            <TabsList className="grid grid-cols-2 rounded-xl bg-gm-panel">
              <TabsTrigger value="details">Template</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-3 pt-4">
              <Input
                placeholder="Template name"
                value={draft.name}
                ref={nameInputRef}
                onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                className="border-gm-border bg-gm-panel text-foreground"
              />
              <Input
                placeholder="Vehicle type ID"
                type="number"
                value={draft.vehicle_type_id ?? ""}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, vehicle_type_id: Number(e.target.value) }))
                }
                className="border-gm-border bg-gm-panel text-foreground"
              />
              <label className="flex items-center gap-2 text-sm text-gm-muted">
                <input
                  type="checkbox"
                  checked={draft.is_active ?? true}
                  onChange={(e) => setDraft((d) => ({ ...d, is_active: e.target.checked }))}
                  className="h-4 w-4 rounded border-gm-border bg-gm-panel"
                />
                Active template
              </label>
            </TabsContent>

            <TabsContent value="schedule" className="space-y-3 pt-4">
              <div className="grid gap-3 md:grid-cols-2 md:gap-4">
                <div className="grid gap-1">
                  <label className="text-xs uppercase tracking-wide text-gm-muted">Trigger type</label>
                  <select
                    value={draft.trigger_type || "mileage"}
                    onChange={(e) => setDraft((d) => ({ ...d, trigger_type: e.target.value }))}
                    className="rounded-md border border-gm-border bg-gm-panel px-3 py-2 text-sm text-foreground"
                  >
                    <option value="mileage">Mileage</option>
                    <option value="time">Time</option>
                    <option value="combined">Combined</option>
                  </select>
                </div>
                <div className="grid gap-1">
                  <label className="text-xs uppercase tracking-wide text-gm-muted">Mileage interval (km)</label>
                  <Input
                    type="number"
                    value={draft.mileage_interval ?? ""}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, mileage_interval: Number(e.target.value) }))
                    }
                    className="border-gm-border bg-gm-panel text-foreground"
                  />
                </div>
                <div className="grid gap-1">
                  <label className="text-xs uppercase tracking-wide text-gm-muted">Time interval (days)</label>
                  <Input
                    type="number"
                    value={draft.time_interval_days ?? ""}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, time_interval_days: Number(e.target.value) }))
                    }
                    className="border-gm-border bg-gm-panel text-foreground"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-4 flex justify-end">
            <Button
              className="gap-2 bg-gm-primary text-black hover:bg-gm-primary/90"
              onClick={handleSave}
              disabled={!draft.name}
            >
              Save template
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
