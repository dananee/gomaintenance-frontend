"use client";

import { useMemo, useState } from "react";
import {
  ArrowUpDown,
  CalendarClock,
  Filter,
  LayoutGrid,
  ListOrdered,
  Plus,
} from "lucide-react";

import {
  WorkOrdersKanban,
  WorkOrderCard,
} from "@/components/work-orders-kanban";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const sampleBoard: Record<
  "new" | "in_progress" | "in_review" | "completed",
  WorkOrderCard[]
> = {
  new: [
    {
      id: "WO-3021",
      code: "#WO-3021",
      vehicle: "Ford Transit • 58k km",
      title: "Brake pads replacement & rotor inspection",
      priority: "high",
      assignee: "Alex Johnson",
      comments: 5,
      attachments: 2,
    },
    {
      id: "WO-3022",
      code: "#WO-3022",
      vehicle: "Volvo FH16 • 210k km",
      title: "Check coolant leak from radiator",
      priority: "medium",
      assignee: "Dana Smith",
      comments: 1,
    },
  ],
  in_progress: [
    {
      id: "WO-3010",
      code: "#WO-3010",
      vehicle: "Mercedes Actros • 180k km",
      title: "Engine oil + filters replacement",
      priority: "medium",
      assignee: "Nathan Reyes",
      comments: 3,
      attachments: 1,
    },
    {
      id: "WO-3001",
      code: "#WO-3001",
      vehicle: "Iveco Daily • 75k km",
      title: "Diagnose ABS warning light",
      priority: "high",
      assignee: "Pat Cooper",
      comments: 4,
    },
  ],
  in_review: [
    {
      id: "WO-2995",
      code: "#WO-2995",
      vehicle: "Scania R450 • 320k km",
      title: "Tire rotation and balancing",
      priority: "low",
      assignee: "Alex Johnson",
      comments: 2,
    },
  ],
  completed: [
    {
      id: "WO-2980",
      code: "#WO-2980",
      vehicle: "Renault Master • 140k km",
      title: "DPF regeneration + diagnostics",
      priority: "medium",
      assignee: "Floyd Miles",
      comments: 1,
      attachments: 1,
    },
  ],
};

export default function WorkOrdersPage() {
  const [board, setBoard] = useState(sampleBoard);
  const [search, setSearch] = useState("");
  const tableRows = useMemo(
    () =>
      Object.values(board)
        .flat()
        .filter((row) =>
          `${row.code} ${row.vehicle} ${row.title}`
            .toLowerCase()
            .includes(search.toLowerCase())
        ),
    [board, search]
  );

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader
        title="Work Orders"
        description="Prioritize, assign, and track maintenance tasks across the fleet."
      />

      <div className="flex-1 space-y-6 overflow-auto bg-gradient-to-br from-[#f8fbff] via-[#eef2f8] to-[#e5ebf5] px-4 py-6 md:px-6 md:py-8">
        <div className="flex flex-col gap-3 rounded-2xl border border-gm-border bg-gm-card/40 p-4 shadow-sm md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2 text-sm text-gm-muted">
            <Badge className="rounded-full bg-gm-primary/10 text-gm-primary">
              18 open
            </Badge>
            <Badge className="rounded-full border border-gm-border bg-gm-panel text-foreground">
              SLA: 6 due today
            </Badge>
            <span className="hidden text-xs text-gm-muted md:inline">
              Updated 3 minutes ago
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 border-gm-border text-foreground"
            >
              <Filter className="h-4 w-4" /> Filters
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 border-gm-border text-foreground"
            >
              <CalendarClock className="h-4 w-4" />
              Plan calendar
            </Button>
            <Button className="gap-2 bg-gm-primary text-black hover:bg-gm-primary/90">
              <Plus className="h-4 w-4" /> New work order
            </Button>
          </div>
        </div>

        <Tabs defaultValue="kanban" className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <TabsList className="rounded-xl bg-gm-panel">
              <TabsTrigger value="kanban" className="flex items-center gap-2">
                <LayoutGrid className="h-4 w-4" /> Kanban
              </TabsTrigger>
              <TabsTrigger value="table" className="flex items-center gap-2">
                <ListOrdered className="h-4 w-4" /> Table
              </TabsTrigger>
            </TabsList>
            <div className="flex flex-1 items-center justify-end gap-2 md:max-w-sm">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search work orders"
                className="rounded-xl border-gm-border bg-gm-card text-sm text-foreground"
              />
              <Button
                variant="outline"
                size="icon"
                className="border-gm-border text-gm-muted"
              >
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <TabsContent value="kanban" className="space-y-4">
            <WorkOrdersKanban items={board} onChange={setBoard} />
          </TabsContent>

          <TabsContent value="table">
            <Card className="overflow-hidden rounded-2xl border-gm-border bg-gm-card">
              <Table>
                <TableHeader className="bg-gm-panel">
                  <TableRow>
                    <TableHead>Order</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead className="w-24">Priority</TableHead>
                    <TableHead className="w-32">Status</TableHead>
                    <TableHead className="w-28 text-right">Comments</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tableRows.map((row) => (
                    <TableRow key={row.id} className="hover:bg-gm-panel">
                      <TableCell className="font-semibold text-foreground">
                        {row.code}
                      </TableCell>
                      <TableCell className="text-gm-muted">
                        {row.vehicle}
                      </TableCell>
                      <TableCell className="text-gm-muted">
                        {row.title}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`rounded-full border px-2 py-0.5 text-[11px] uppercase tracking-wide ${priorityTone(
                            row.priority
                          )}`}
                        >
                          {row.priority}
                        </Badge>
                      </TableCell>
                      <TableCell className="capitalize text-gm-muted">
                        {findStatus(row.id)}
                      </TableCell>
                      <TableCell className="text-right text-gm-muted">
                        {row.comments ?? 0}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );

  function findStatus(id: string | number) {
    const entry = Object.entries(board).find(([, items]) =>
      items.some((item) => item.id === id)
    );
    return entry ? entry[0].replace("_", " ") : "";
  }
}

function priorityTone(priority: WorkOrderCard["priority"]) {
  if (priority === "high")
    return "bg-red-500/15 text-red-200 border-red-500/40";
  if (priority === "medium")
    return "bg-amber-500/15 text-amber-200 border-amber-500/40";
  return "bg-emerald-500/15 text-emerald-200 border-emerald-500/40";
}
