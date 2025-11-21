"use client";

import { useCallback, useMemo, useState } from "react";
import {
  ArrowUpDown,
  CalendarClock,
  Filter,
  LayoutGrid,
  ListOrdered,
  Plus,
} from "lucide-react";

import { WorkOrdersKanban, WorkOrderCard } from "@/components/work-orders-kanban";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const columnKeys = ["new", "in_progress", "in_review", "completed"] as const;
type ColumnKey = (typeof columnKeys)[number];

const sampleBoard: Record<ColumnKey, WorkOrderCard[]> = {
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
  const [statusFilter, setStatusFilter] = useState<"all" | ColumnKey>("all");
  const [priorityFilter, setPriorityFilter] = useState<"all" | WorkOrderCard["priority"]>("all");
  const [newOrderOpen, setNewOrderOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [newOrder, setNewOrder] = useState({
    title: "",
    vehicle: "",
    priority: "medium" as WorkOrderCard["priority"],
    assignee: "Unassigned",
  });

  const filterItem = useCallback(
    (item: WorkOrderCard, columnKey: ColumnKey) => {
      if (statusFilter !== "all" && statusFilter !== columnKey) return false;
      if (priorityFilter !== "all" && priorityFilter !== item.priority) return false;
      const haystack = `${item.code} ${item.vehicle} ${item.title} ${item.assignee}`.toLowerCase();
      return haystack.includes(search.toLowerCase());
    },
    [priorityFilter, search, statusFilter]
  );

  const filteredBoard = useMemo(
    () =>
      Object.fromEntries(
        columnKeys.map((column) => [
          column,
          board[column].filter((item) => filterItem(item, column)),
        ])
      ) as Record<ColumnKey, WorkOrderCard[]>,
    [board, filterItem]
  );

  const tableRows = useMemo(
    () =>
      columnKeys.flatMap((column) =>
        board[column]
          .filter((row) => filterItem(row, column))
          .map((row) => ({ ...row, status: column }))
      ),
    [board, filterItem]
  );

  const handleBoardChange = (nextBoard: Record<ColumnKey, WorkOrderCard[]>) => {
    setBoard((prev) => {
      const hidden = columnKeys.reduce<Record<ColumnKey, WorkOrderCard[]>>((acc, column) => {
        acc[column] = prev[column].filter((item) => !filterItem(item, column));
        return acc;
      }, { new: [], in_progress: [], in_review: [], completed: [] });

      return columnKeys.reduce<Record<ColumnKey, WorkOrderCard[]>>((acc, column) => {
        acc[column] = [...nextBoard[column], ...hidden[column]];
        return acc;
      }, { new: [], in_progress: [], in_review: [], completed: [] });
    });
  };

  const createNewOrder = () => {
    const id = `WO-${Math.floor(Math.random() * 9000 + 1000)}`;
    const card: WorkOrderCard = {
      id,
      code: `#${id}`,
      title: newOrder.title || "New maintenance order",
      vehicle: newOrder.vehicle || "Unassigned vehicle",
      priority: newOrder.priority,
      assignee: newOrder.assignee || "Unassigned",
      comments: 0,
    };

    setBoard((prev) => ({
      ...prev,
      new: [card, ...prev.new],
    }));
    setNewOrder({ title: "", vehicle: "", priority: "medium", assignee: "Unassigned" });
    setNewOrderOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 rounded-2xl border border-gm-border bg-gm-card/40 p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-2 text-sm text-gm-muted">
          <Badge className="rounded-full bg-gm-primary/10 text-gm-primary">18 open</Badge>
          <Badge className="rounded-full border border-gm-border bg-gm-panel text-foreground">
            SLA: 6 due today
          </Badge>
          <span className="hidden text-xs text-gm-muted md:inline">Updated 3 minutes ago</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2 border-gm-border text-foreground"
            onClick={() => setFiltersOpen(true)}
          >
            <Filter className="h-4 w-4" /> Filters
          </Button>
          <Button variant="outline" size="sm" className="gap-2 border-gm-border text-foreground">
            <CalendarClock className="h-4 w-4" />
            Plan calendar
          </Button>
          <Button
            className="gap-2 bg-gm-primary text-black hover:bg-gm-primary/90"
            onClick={() => setNewOrderOpen(true)}
          >
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
            <Button variant="outline" size="icon" className="border-gm-border text-gm-muted">
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <TabsContent value="kanban" className="space-y-4">
          <WorkOrdersKanban items={filteredBoard} onChange={handleBoardChange} />
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
                    <TableCell className="text-gm-muted">{row.vehicle}</TableCell>
                    <TableCell className="text-gm-muted">{row.title}</TableCell>
                    <TableCell>
                      <Badge className={`rounded-full border px-2 py-0.5 text-[11px] uppercase tracking-wide ${priorityTone(row.priority)}`}>
                        {row.priority}
                      </Badge>
                    </TableCell>
                    <TableCell className="capitalize text-gm-muted">
                      {row.status.replace("_", " ")}
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

      <Dialog open={newOrderOpen} onOpenChange={setNewOrderOpen}>
        <DialogContent className="bg-gm-card text-foreground">
          <DialogHeader>
            <DialogTitle>Create work order</DialogTitle>
          </DialogHeader>

          <div className="grid gap-3">
            <div className="space-y-2">
              <Label htmlFor="order-title">Title</Label>
              <Input
                id="order-title"
                value={newOrder.title}
                onChange={(event) => setNewOrder((prev) => ({ ...prev, title: event.target.value }))}
                placeholder="Replace brake pads and bleed system"
                className="border-gm-border bg-gm-panel"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="order-vehicle">Vehicle</Label>
              <Input
                id="order-vehicle"
                value={newOrder.vehicle}
                onChange={(event) => setNewOrder((prev) => ({ ...prev, vehicle: event.target.value }))}
                placeholder="Ford Transit • 58k km"
                className="border-gm-border bg-gm-panel"
              />
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="order-priority">Priority</Label>
                <select
                  id="order-priority"
                  value={newOrder.priority}
                  onChange={(event) =>
                    setNewOrder((prev) => ({
                      ...prev,
                      priority: event.target.value as WorkOrderCard["priority"],
                    }))
                  }
                  className="h-10 rounded-lg border border-gm-border bg-gm-panel px-3 text-sm"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="order-assignee">Assignee</Label>
                <Input
                  id="order-assignee"
                  value={newOrder.assignee}
                  onChange={(event) => setNewOrder((prev) => ({ ...prev, assignee: event.target.value }))}
                  placeholder="Alex Johnson"
                  className="border-gm-border bg-gm-panel"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button variant="ghost" onClick={() => setNewOrderOpen(false)} className="text-gm-muted">
              Cancel
            </Button>
            <Button className="bg-gm-primary text-black hover:bg-gm-primary/90" onClick={createNewOrder}>
              Add work order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
        <SheetContent className="bg-gm-card text-foreground">
          <SheetHeader className="pb-2">
            <SheetTitle>Filters</SheetTitle>
            <p className="text-sm text-gm-muted">Refine the Kanban board and table views.</p>
          </SheetHeader>

          <div className="space-y-4 p-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <div className="grid grid-cols-2 gap-2">
                {["all", ...columnKeys].map((status) => (
                  <Button
                    key={status}
                    variant={statusFilter === status ? "default" : "outline"}
                    className={`justify-start ${statusFilter === status ? "bg-gm-primary text-black" : "border-gm-border"}`}
                    onClick={() => setStatusFilter(status as typeof statusFilter)}
                  >
                    {status === "all" ? "All" : status.replace("_", " ")}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Priority</Label>
              <div className="grid grid-cols-3 gap-2">
                {["all", "high", "medium", "low"].map((priority) => (
                  <Button
                    key={priority}
                    variant={priorityFilter === priority ? "default" : "outline"}
                    className={`justify-start ${
                      priorityFilter === priority ? "bg-gm-primary text-black" : "border-gm-border"
                    }`}
                    onClick={() =>
                      setPriorityFilter(priority as typeof priorityFilter)
                    }
                  >
                    {priority === "all" ? "All" : priority}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <SheetFooter className="flex-row items-center justify-between border-t border-gm-border bg-gm-panel/40">
            <Button
              variant="ghost"
              className="text-gm-muted"
              onClick={() => {
                setStatusFilter("all");
                setPriorityFilter("all");
                setFiltersOpen(false);
              }}
            >
              Clear filters
            </Button>
            <Button onClick={() => setFiltersOpen(false)} className="bg-gm-primary text-black hover:bg-gm-primary/90">
              Apply
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );

}

function priorityTone(priority: WorkOrderCard["priority"]) {
  if (priority === "high")
    return "bg-red-500/15 text-red-200 border-red-500/40";
  if (priority === "medium")
    return "bg-amber-500/15 text-amber-200 border-amber-500/40";
  return "bg-emerald-500/15 text-emerald-200 border-emerald-500/40";
}
