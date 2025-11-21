"use client";

import { useMemo, useState } from "react";
import { Plus, Wrench, ClipboardList, Save, Trash2 } from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const seedTemplates = [
  {
    id: 1,
    name: "Quarterly safety inspection",
    interval: "90 days",
    vehicles: "All light trucks",
    operations: ["Inspect brakes", "Check fluids", "Test lights"],
    parts: ["Brake cleaner", "Cabin filter"],
  },
  {
    id: 2,
    name: "Oil & filters",
    interval: "15,000 km",
    vehicles: "High mileage tractors",
    operations: ["Replace oil", "Replace air filter", "Reset service"],
    parts: ["15w40 oil", "Oil filter"],
  },
];

export default function MaintenancePlansPage() {
  const [templates, setTemplates] = useState(seedTemplates);
  const [draft, setDraft] = useState({
    name: "",
    interval: "30 days",
    vehicles: "All",
    operations: "",
    parts: "",
  });
  const coverage = useMemo(
    () => `${templates.length} active templates`,
    [templates.length]
  );

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader
        title="Maintenance Plans"
        description="Standardize recurring maintenance with reusable templates."
      />

      <div className="flex-1 space-y-6 overflow-auto bg-gradient-to-br from-[#f8fbff] via-[#eef2f8] to-[#e5ebf5] px-4 py-6 md:px-6 md:py-8">
        <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
          <Card className="rounded-2xl border-gm-border bg-gm-card/50 p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Template library
                </p>
                <p className="text-xs text-gm-muted">{coverage}</p>
              </div>
              <Button className="gap-2 bg-gm-primary text-black hover:bg-gm-primary/90">
                <Plus className="h-4 w-4" /> New template
              </Button>
            </div>

            <div className="mt-4 grid gap-3">
              {templates.map((tpl) => (
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
                      <p className="text-xs text-gm-muted">{tpl.vehicles}</p>
                      <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-wide text-gm-muted">
                        <Badge className="border-gm-border bg-gm-border/10 text-foreground">
                          {tpl.interval}
                        </Badge>
                        <Badge className="border-gm-border bg-gm-border/10 text-foreground">
                          {tpl.operations.length} ops
                        </Badge>
                        <Badge className="border-gm-border bg-gm-border/10 text-foreground">
                          {tpl.parts.length} parts
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gm-muted">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gm-muted hover:text-foreground"
                      >
                        <Save className="h-4 w-4" /> Save
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gm-muted hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" /> Delete
                      </Button>
                    </div>
                  </div>
                  <Separator className="my-3 border-gm-border/50" />
                  <div className="grid gap-3 md:grid-cols-2 md:gap-6">
                    <div className="space-y-2 text-sm text-gm-muted">
                      <p className="text-xs uppercase tracking-wide text-gm-muted">
                        Operations
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {tpl.operations.map((op) => (
                          <Badge
                            key={op}
                            className="rounded-full bg-gm-panel text-foreground"
                          >
                            <Wrench className="mr-1 h-3 w-3" /> {op}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-gm-muted">
                      <p className="text-xs uppercase tracking-wide text-gm-muted">
                        Spare parts
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {tpl.parts.map((part) => (
                          <Badge
                            key={part}
                            className="rounded-full bg-gm-panel text-foreground"
                          >
                            {part}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>

          <Card className="rounded-2xl border-gm-border bg-gm-card/60 p-5">
            <p className="text-sm font-semibold text-foreground">
              Create template
            </p>
            <p className="text-xs text-gm-muted">
              Draft a reusable maintenance recipe.
            </p>

            <Tabs defaultValue="details" className="mt-4">
              <TabsList className="rounded-xl bg-gm-panel">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="operations">Operations</TabsTrigger>
                <TabsTrigger value="parts">Spare parts</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="space-y-3 pt-3 text-sm">
                <Input
                  placeholder="Template name"
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                  className="border-gm-border bg-gm-panel text-foreground"
                />
                <Input
                  placeholder="Interval (e.g., 15,000 km or 90 days)"
                  value={draft.interval}
                  onChange={(e) =>
                    setDraft({ ...draft, interval: e.target.value })
                  }
                  className="border-gm-border bg-gm-panel text-foreground"
                />
                <Input
                  placeholder="Applicable vehicles"
                  value={draft.vehicles}
                  onChange={(e) =>
                    setDraft({ ...draft, vehicles: e.target.value })
                  }
                  className="border-gm-border bg-gm-panel text-foreground"
                />
              </TabsContent>
              <TabsContent
                value="operations"
                className="space-y-3 pt-3 text-sm"
              >
                <label className="text-xs text-gm-muted">
                  Operations (comma separated)
                </label>
                <Input
                  placeholder="Oil change, Brake check, ..."
                  value={draft.operations}
                  onChange={(e) =>
                    setDraft({ ...draft, operations: e.target.value })
                  }
                  className="border-gm-border bg-gm-panel text-foreground"
                />
              </TabsContent>
              <TabsContent value="parts" className="space-y-3 pt-3 text-sm">
                <label className="text-xs text-gm-muted">
                  Spare parts (comma separated)
                </label>
                <Input
                  placeholder="Oil filter, Brake cleaner"
                  value={draft.parts}
                  onChange={(e) =>
                    setDraft({ ...draft, parts: e.target.value })
                  }
                  className="border-gm-border bg-gm-panel text-foreground"
                />
              </TabsContent>
            </Tabs>

            <div className="mt-4 flex items-center justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-gm-muted"
                onClick={() =>
                  setDraft({
                    name: "",
                    interval: "30 days",
                    vehicles: "All",
                    operations: "",
                    parts: "",
                  })
                }
              >
                Clear
              </Button>
              <Button
                size="sm"
                className="bg-gm-primary text-black hover:bg-gm-primary/90"
                onClick={() => {
                  setTemplates((prev) => [
                    ...prev,
                    {
                      id: prev.length + 1,
                      name: draft.name || `Template ${prev.length + 1}`,
                      interval: draft.interval,
                      vehicles: draft.vehicles,
                      operations: draft.operations
                        ? draft.operations
                            .split(",")
                            .map((v) => v.trim())
                            .filter(Boolean)
                        : [],
                      parts: draft.parts
                        ? draft.parts
                            .split(",")
                            .map((v) => v.trim())
                            .filter(Boolean)
                        : [],
                    },
                  ]);
                  setDraft({
                    name: "",
                    interval: "30 days",
                    vehicles: "All",
                    operations: "",
                    parts: "",
                  });
                }}
              >
                Save template
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
