"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
import { useAuth } from "@/hooks/useAuth";
import { apiFetch } from "@/lib/api-client";

const columnKeys = ["new", "in_progress", "in_review", "completed"] as const;
type ColumnKey = (typeof columnKeys)[number];

type WorkOrder = {
  id: number;
  order_number?: string;
  vehicle_id?: number | null;
  order_type?: string | null;
  status?: string | null;
  priority?: string | null;
  reported_date?: string | null;
  planned_start_date?: string | null;
};

type Vehicle = {
  id: number;
  name: string;
  plate_number?: string | null;
};

const emptyBoard: Record<ColumnKey, WorkOrderCard[]> = {
  new: [],
  in_progress: [],
  in_review: [],
  completed: [],
};

export default function WorkOrdersPage() {
  const { token } = useAuth();
  const [board, setBoard] = useState(emptyBoard);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | ColumnKey>("all");
  const [priorityFilter, setPriorityFilter] = useState<"all" | WorkOrderCard["priority"]>("all");
  const [newOrderOpen, setNewOrderOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [newOrder, setNewOrder] = useState({
    title: "",
    vehicleId: "",
    priority: "medium" as WorkOrderCard["priority"],
    assignee: "Unassigned",
    plannedStart: "",
  });

  useEffect(() => {
    if (!token) return;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const [ordersData, vehiclesData] = await Promise.all([
          apiFetch<WorkOrder[]>("/maintenance/work-orders", {}, token),
          apiFetch<Vehicle[]>("/vehicles", {}, token),
        ]);

        setWorkOrders(Array.isArray(ordersData) ? ordersData : []);
        setVehicles(Array.isArray(vehiclesData) ? vehiclesData : []);
      } catch (err) {
        console.error(err);
        setError("Failed to load work orders");
        setWorkOrders([]);
        setVehicles([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [token]);

  useEffect(() => {
    setBoard(toBoard(workOrders, vehicles));
  }, [workOrders, vehicles]);

  const filterItem = useCallback(
    (item: WorkOrderCard, columnKey: ColumnKey) => {
      if (statusFilter !== "all" && columnKey !== statusFilter) return false;
      if (priorityFilter !== "all" && item.priority !== priorityFilter)
        return false;
      if (search) {
        const term = search.toLowerCase();
        return (
          item.title.toLowerCase().includes(term) ||
          item.vehicle.toLowerCase().includes(term) ||
          item.assignee.toLowerCase().includes(term)
        );
      }
      return true;
    },
    [statusFilter, priorityFilter, search]
  );

  const filteredBoard = useMemo(
    () =>
      columnKeys.reduce(
        (acc, column) => ({
          ...acc,
          [column]: board[column].filter((item) => filterItem(item, column)),
        }),
        { ...board }
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
      const hidden = columnKeys.reduce<Record<ColumnKey, WorkOrderCard[]>>(
        (acc, column) => {
          acc[column] = prev[column].filter((item) => !filterItem(item, column));
          return acc;
        },
        { ...emptyBoard }
      );

      return columnKeys.reduce<Record<ColumnKey, WorkOrderCard[]>>(
        (acc, column) => {
          acc[column] = [...nextBoard[column], ...hidden[column]];
          return acc;
        },
        { ...emptyBoard }
      );
    });
  };

  const createNewOrder = () => {
    if (!token) return;

    const vehicle_id = newOrder.vehicleId ? Number(newOrder.vehicleId) : undefined;

    const save = async () => {
      try {
        setSaving(true);
        setError(null);

        await apiFetch(
          "/maintenance/work-orders",
          {
            method: "POST",
            body: JSON.stringify({
              vehicle_id,
              order_type: newOrder.title || "Maintenance",
              status: "open",
              priority: newOrder.priority,
              reported_date: new Date().toISOString(),
              planned_start_date: newOrder.plannedStart
                ? new Date(newOrder.plannedStart).toISOString()
                : undefined,
            }),
          },
          token
        );

        const refreshed = await apiFetch<WorkOrder[]>(
          "/maintenance/work-orders",
          {},
          token
        );

        setWorkOrders(Array.isArray(refreshed) ? refreshed : []);
        setNewOrder({
          title: "",
          vehicleId: "",
          priority: "medium",
          assignee: "Unassigned",
          plannedStart: "",
        });
        setNewOrderOpen(false);
      } catch (err) {
        console.error(err);
        setError("Failed to create work order");
      } finally {
        setSaving(false);
      }
    };

    save();
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-gm-soft">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-3 rounded-2xl border border-gm-border bg-gm-card/40 p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-2 text-sm text-gm-muted">
          <Badge className="rounded-full bg-gm-primary/10 text-gm-primary">
            {workOrders.length} open
          </Badge>
          <Badge className="rounded-full border border-gm-border bg-gm-panel text-foreground">
            Loaded {vehicles.length} vehicles
          </Badge>
          <span className="hidden text-xs text-gm-muted md:inline">
            Updated just now
          </span>
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
          {loading && (
            <p className="text-center text-sm text-gm-muted">Loading work orders…</p>
          )}
          {!loading && workOrders.length === 0 && (
            <p className="text-center text-sm text-gm-muted">
              No work orders yet. Create one to match your backend /maintenance/work-orders endpoint.
            </p>
          )}
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
                {!loading && tableRows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-sm text-gm-muted">
                      No work orders to display.
                    </TableCell>
                  </TableRow>
                )}
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
              <select
                id="order-vehicle"
                value={newOrder.vehicleId}
                onChange={(event) => setNewOrder((prev) => ({ ...prev, vehicleId: event.target.value }))}
                className="h-10 rounded-lg border border-gm-border bg-gm-panel px-3 text-sm"
              >
                <option value="">Unassigned vehicle</option>
                {vehicles.map((vehicle) => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicleLabel(vehicle)}
                  </option>
                ))}
              </select>
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
            <div className="space-y-2">
              <Label htmlFor="planned-start">Planned start date</Label>
              <Input
                id="planned-start"
                type="date"
                value={newOrder.plannedStart}
                onChange={(event) => setNewOrder((prev) => ({ ...prev, plannedStart: event.target.value }))}
                className="border-gm-border bg-gm-panel"
              />
            </div>
          </div>

          <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button variant="ghost" onClick={() => setNewOrderOpen(false)} className="text-gm-muted">
              Cancel
            </Button>
            <Button
              className="bg-gm-primary text-black hover:bg-gm-primary/90"
              onClick={createNewOrder}
              disabled={saving}
            >
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

function toBoard(orders: WorkOrder[], vehicles: Vehicle[]): Record<ColumnKey, WorkOrderCard[]> {
  if (!orders || orders.length === 0)
    return {
      ...emptyBoard,
    };

  const vehicleLookup = new Map<number, Vehicle>();
  vehicles.forEach((v) => vehicleLookup.set(v.id, v));

  const board: Record<ColumnKey, WorkOrderCard[]> = {
    new: [],
    in_progress: [],
    in_review: [],
    completed: [],
  };

  orders.forEach((order) => {
    const column = statusToColumn(order.status);
    const vehicleName =
      (order.vehicle_id && vehicleLookup.get(order.vehicle_id)) || undefined;

    const card: WorkOrderCard = {
      id: order.id,
      code: order.order_number ? `#${order.order_number}` : `WO-${order.id}`,
      vehicle: vehicleName ? vehicleLabel(vehicleName) : "Unassigned vehicle",
      title: order.order_type || "Maintenance",
      priority: normalizePriority(order.priority),
      assignee: "Unassigned",
      comments: 0,
    };

    board[column].push(card);
  });

  return board;
}

function vehicleLabel(vehicle: Vehicle) {
  return vehicle.plate_number
    ? `${vehicle.name} (${vehicle.plate_number})`
    : vehicle.name;
}

function normalizePriority(priority?: string | null): WorkOrderCard["priority"] {
  const value = (priority || "").toLowerCase();
  if (value === "high") return "high";
  if (value === "low") return "low";
  return "medium";
}

function statusToColumn(status?: string | null): ColumnKey {
  const normalized = (status || "").toLowerCase().replace(/\s+/g, "_");
  if (normalized === "in_progress") return "in_progress";
  if (normalized === "in_review") return "in_review";
  if (normalized === "completed" || normalized === "done") return "completed";
  return "new";
}
