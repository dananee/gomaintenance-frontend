"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { apiFetch } from "@/lib/api-client";
import { SiteHeader } from "@/components/site-header";
import { VehicleCard } from "@/components/vehicle-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Vehicle = {
  id: number;
  name: string;
  plate_number?: string | null;
  brand?: string | null;
  model?: string | null;
  year?: number | null;
  current_odometer?: number | null;
  status: string;
};

export default function VehiclesPage() {
  const { token } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [draft, setDraft] = useState<
    Omit<Vehicle, "id" | "status"> & { status?: string }
  >({
    name: "",
    plate_number: "",
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    current_odometer: 0,
    status: "active",
  });

  useEffect(() => {
    if (!token) return;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiFetch<Vehicle[]>("/vehicles", {}, token);
        setVehicles(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
        setError("Failed to load vehicles");
        setVehicles([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [token]);

  const formatOdo = (v?: number | null) => (v ? `${Math.round(v)} km` : "-");

  const statusClass = (status: string) => {
    const s = status.toLowerCase();
    if (s === "active")
      return "bg-emerald-500/15 text-emerald-300 border-emerald-500/40";
    if (s === "maintenance")
      return "bg-amber-500/15 text-amber-300 border-amber-500/40";
    if (s === "out_of_service" || s === "inactive")
      return "bg-red-500/15 text-red-300 border-red-500/40";
    return "bg-gm-card text-gm-muted border-gm-border/60";
  };

  return (
    <>
      <SiteHeader
        title="Vehicles"
        description="All vehicles synced from your GoMaintenance backend."
      />

      <main className="flex-1 overflow-x-hidden px-4 py-6 md:px-6 md:py-8 lg:px-10 lg:py-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4">
          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-gm-soft">
              {error}
            </div>
          )}

          <Card className="w-full rounded-2xl border-gm-border bg-gm-card px-4 py-4 md:px-6 md:py-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Fleet inventory
                </p>
                <p className="text-xs text-gm-muted">
                  {vehicles.length} vehicles loaded
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gm-border text-foreground"
                  onClick={() => setDialogOpen(true)}
                >
                  + Add vehicle
                </Button>
                <Button variant="ghost" size="sm" className="text-gm-muted">
                  Export CSV
                </Button>
              </div>
            </div>

            <div className="mt-4 hidden overflow-x-auto md:block">
              <Table className="w-full table-auto">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[60px]">ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Plate</TableHead>
                    <TableHead>Brand</TableHead>
                    <TableHead>Model</TableHead>
                    <TableHead className="w-[90px]">Year</TableHead>
                    <TableHead className="w-[150px]">Odometer</TableHead>
                    <TableHead className="w-[110px]">Status</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {loading &&
                    Array.from({ length: 4 }).map((_, i) => (
                      <TableRow key={i} className="animate-pulse">
                        {Array.from({ length: 8 }).map((__, j) => (
                          <TableCell key={j}>
                            <div className="h-4 w-full rounded bg-gm-border/60" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}

                  {!loading && vehicles.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="h-24 text-center text-sm text-gm-muted"
                      >
                        No vehicles found. Make sure your backend{" "}
                        <code>/vehicles</code> returns a list.
                      </TableCell>
                    </TableRow>
                  )}

                  {!loading &&
                    vehicles.length > 0 &&
                    vehicles.map((v) => (
                      <TableRow key={v.id}>
                        <TableCell className="font-mono text-xs">
                          {v.id}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {v.name}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {v.plate_number || "-"}
                        </TableCell>
                        <TableCell>{v.brand || "-"}</TableCell>
                        <TableCell>{v.model || "-"}</TableCell>
                        <TableCell>{v.year || "-"}</TableCell>
                        <TableCell>{formatOdo(v.current_odometer)}</TableCell>
                        <TableCell>
                          <span
                            className={cn(
                              "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
                              statusClass(v.status)
                            )}
                          >
                            {v.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>

            <div className="mt-4 grid gap-3 md:hidden">
              {loading &&
                Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-24 rounded-xl border border-gm-border/60 bg-gm-border/20 animate-pulse"
                  />
                ))}
              {!loading &&
                vehicles.map((v) => (
                  <VehicleCard
                    key={v.id}
                    id={v.id}
                    name={v.name}
                    plate={v.plate_number}
                    brand={v.brand}
                    model={v.model}
                    year={v.year}
                    odometer={v.current_odometer}
                    status={v.status}
                  />
                ))}
            </div>
          </Card>
        </div>
      </main>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-gm-card text-foreground">
          <DialogHeader>
            <DialogTitle>Add a vehicle</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 text-sm">
            <div className="grid gap-1">
              <label className="text-gm-muted">Name</label>
              <Input
                value={draft.name}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, name: e.target.value }))
                }
                className="border-gm-border bg-gm-panel text-foreground"
              />
            </div>
            <div className="grid gap-1 md:grid-cols-2 md:gap-3">
              <div className="grid gap-1">
                <label className="text-gm-muted">Plate</label>
                <Input
                  value={draft.plate_number ?? ""}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, plate_number: e.target.value }))
                  }
                  className="border-gm-border bg-gm-panel text-foreground"
                />
              </div>
              <div className="grid gap-1">
                <label className="text-gm-muted">Brand</label>
                <Input
                  value={draft.brand ?? ""}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, brand: e.target.value }))
                  }
                  className="border-gm-border bg-gm-panel text-foreground"
                />
              </div>
            </div>
            <div className="grid gap-1 md:grid-cols-3 md:gap-3">
              <div className="grid gap-1">
                <label className="text-gm-muted">Model</label>
                <Input
                  value={draft.model ?? ""}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, model: e.target.value }))
                  }
                  className="border-gm-border bg-gm-panel text-foreground"
                />
              </div>
              <div className="grid gap-1">
                <label className="text-gm-muted">Year</label>
                <Input
                  type="number"
                  value={draft.year ?? ""}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, year: Number(e.target.value) }))
                  }
                  className="border-gm-border bg-gm-panel text-foreground"
                />
              </div>
              <div className="grid gap-1">
                <label className="text-gm-muted">Odometer (km)</label>
                <Input
                  type="number"
                  value={draft.current_odometer ?? ""}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      current_odometer: Number(e.target.value),
                    }))
                  }
                  className="border-gm-border bg-gm-panel text-foreground"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-gm-muted"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                className="bg-gm-primary text-black hover:bg-gm-primary/90"
                onClick={() => {
                  setVehicles((prev) => [
                    ...prev,
                    {
                      id: prev.length + 1,
                      name: draft.name || "New vehicle",
                      plate_number: draft.plate_number,
                      brand: draft.brand,
                      model: draft.model,
                      year: draft.year,
                      current_odometer: draft.current_odometer,
                      status: draft.status || "active",
                    },
                  ]);
                  setDialogOpen(false);
                }}
              >
                Save vehicle
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
