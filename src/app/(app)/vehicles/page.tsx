"use client";

import { useEffect, useState } from "react";

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
import { useAuth } from "@/hooks/useAuth";
import { apiFetch } from "@/lib/api-client";

type Vehicle = {
  id: number;
  internal_code?: string | null;
  plate_number?: string | null;
  brand?: string | null;
  model?: string | null;
  year?: number | null;
  mileage?: number | null;
  hours_meter?: number | null;
  status?: string | null;
  vehicle_type_id?: number | null;
};

export default function VehiclesPage() {
  const { token } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [draft, setDraft] = useState<
    Omit<Vehicle, "id"> & { status?: string | null }
  >({
    internal_code: "",
    plate_number: "",
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    mileage: 0,
    hours_meter: 0,
    status: "active",
    vehicle_type_id: 1,
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

  const formatOdo = (v?: number | null) =>
    typeof v === "number" ? `${Math.round(v)} km` : "-";

  const formatHours = (v?: number | null) =>
    typeof v === "number" ? `${v} h` : "-";

  const statusClass = (status: string) => {
    const s = status.toLowerCase();
    if (s === "active")
      return "bg-emerald-500/15 text-emerald-300 border-emerald-500/40";
    if (s === "maintenance")
      return "bg-amber-500/15 text-amber-300 border-amber-500/40";
    if (s === "out_of_service" || s === "inactive")
      return "bg-red-500/15 text-red-300 border-red-500/40";
    return "border-gm-border text-gm-muted bg-gm-panel";
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-gm-soft">
          {error}
        </div>
      )}

      <Card className="w-full rounded-2xl border-gm-border bg-gm-card px-4 py-4 md:px-6 md:py-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground">Fleet inventory</p>
            <p className="text-xs text-gm-muted">{vehicles.length} vehicles loaded</p>
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
                <TableHead>Code</TableHead>
                <TableHead>Plate</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Model</TableHead>
                <TableHead className="w-[90px]">Year</TableHead>
                <TableHead className="w-[130px]">Mileage</TableHead>
                <TableHead className="w-[130px]">Hours</TableHead>
                <TableHead className="w-[110px]">Status</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading &&
                Array.from({ length: 4 }).map((_, i) => (
                  <TableRow key={i} className="animate-pulse">
                    {Array.from({ length: 9 }).map((__, j) => (
                      <TableCell key={j}>
                        <div className="h-4 w-full rounded bg-gm-border/60" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}

              {!loading && vehicles.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center text-sm text-gm-muted">
                    No vehicles found. Make sure your backend <code>/vehicles</code> returns a list.
                  </TableCell>
                </TableRow>
              )}

              {!loading &&
                vehicles.length > 0 &&
                vehicles.map((v) => (
                  <TableRow key={v.id}>
                    <TableCell className="font-mono text-xs">{v.id}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      {v.internal_code || v.plate_number || "-"}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">{v.plate_number || "-"}</TableCell>
                    <TableCell>{v.brand || "-"}</TableCell>
                    <TableCell>{v.model || "-"}</TableCell>
                    <TableCell>{v.year || "-"}</TableCell>
                    <TableCell>{formatOdo(v.mileage)}</TableCell>
                    <TableCell>{formatHours(v.hours_meter)}</TableCell>
                    <TableCell>
                      {v.status ? (
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
                            statusClass(v.status)
                          )}
                        >
                          {v.status}
                        </span>
                      ) : (
                        <span className="text-xs text-gm-muted">n/a</span>
                      )}
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
                className="h-24 animate-pulse rounded-xl border border-gm-border/60 bg-gm-border/20"
              />
            ))}
          {!loading &&
            vehicles.map((v) => (
              <VehicleCard
                key={v.id}
                title={v.plate_number || v.internal_code || `Vehicle ${v.id}`}
                subtitle={
                  [v.brand, v.model].filter(Boolean).join(" ") || undefined
                }
                status={v.status || undefined}
                mileage={formatOdo(v.mileage)}
              />
            ))}
        </div>
      </Card>

      <Card className="w-full rounded-2xl border-gm-border bg-gm-card px-5 py-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground">Vehicle grid</p>
            <p className="text-xs text-gm-muted">Quick overview cards</p>
          </div>
          <Button variant="ghost" size="sm" className="text-gm-muted">
            Configure view
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              title={vehicle.plate_number || vehicle.internal_code || `Vehicle ${vehicle.id}`}
              subtitle={
                [vehicle.brand, vehicle.model].filter(Boolean).join(" ") || undefined
              }
              status={vehicle.status || undefined}
              mileage={formatOdo(vehicle.mileage)}
            />
          ))}
        </div>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-gm-card text-foreground">
          <DialogHeader>
            <DialogTitle>Add a vehicle</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 text-sm">
            <div className="grid gap-1 md:grid-cols-2 md:gap-3">
              <div className="grid gap-1">
                <label className="text-gm-muted">Internal code</label>
                <Input
                  value={draft.internal_code ?? ""}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, internal_code: e.target.value }))
                  }
                  className="border-gm-border bg-gm-panel text-foreground"
                />
              </div>
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
            </div>
            <div className="grid gap-1 md:grid-cols-2 md:gap-3">
              <div className="grid gap-1">
                <label className="text-gm-muted">Brand</label>
                <Input
                  value={draft.brand ?? ""}
                  onChange={(e) => setDraft((d) => ({ ...d, brand: e.target.value }))}
                  className="border-gm-border bg-gm-panel text-foreground"
                />
              </div>
              <div className="grid gap-1">
                <label className="text-gm-muted">Model</label>
                <Input
                  value={draft.model ?? ""}
                  onChange={(e) => setDraft((d) => ({ ...d, model: e.target.value }))}
                  className="border-gm-border bg-gm-panel text-foreground"
                />
              </div>
            </div>
            <div className="grid gap-1 md:grid-cols-3 md:gap-3">
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
                <label className="text-gm-muted">Mileage (km)</label>
                <Input
                  type="number"
                  value={draft.mileage ?? ""}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, mileage: Number(e.target.value) }))
                  }
                  className="border-gm-border bg-gm-panel text-foreground"
                />
              </div>
              <div className="grid gap-1">
                <label className="text-gm-muted">Hours meter</label>
                <Input
                  type="number"
                  value={draft.hours_meter ?? ""}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, hours_meter: Number(e.target.value) }))
                  }
                  className="border-gm-border bg-gm-panel text-foreground"
                />
              </div>
            </div>
            <div className="grid gap-1">
              <label className="text-gm-muted">Vehicle type ID</label>
              <Input
                type="number"
                value={draft.vehicle_type_id ?? ""}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d,
                    vehicle_type_id: Number(e.target.value),
                  }))
                }
                className="border-gm-border bg-gm-panel text-foreground"
              />
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
                  const save = async () => {
                    try {
                      setLoading(true);
                      await apiFetch(
                        "/vehicles",
                        {
                          method: "POST",
                          body: JSON.stringify({
                            internal_code: draft.internal_code,
                            plate_number: draft.plate_number,
                            brand: draft.brand,
                            model: draft.model,
                            year: draft.year,
                            mileage: draft.mileage,
                            hours_meter: draft.hours_meter,
                            vehicle_type_id: draft.vehicle_type_id,
                            status: draft.status,
                          }),
                        },
                        token
                      );

                      const refreshed = await apiFetch<Vehicle[]>(
                        "/vehicles",
                        {},
                        token
                      );
                      setVehicles(Array.isArray(refreshed) ? refreshed : []);
                      setDialogOpen(false);
                      setDraft({
                        internal_code: "",
                        plate_number: "",
                        brand: "",
                        model: "",
                        year: new Date().getFullYear(),
                        mileage: 0,
                        hours_meter: 0,
                        status: "active",
                        vehicle_type_id: 1,
                      });
                    } catch (err) {
                      console.error(err);
                      setError("Failed to save vehicle");
                    } finally {
                      setLoading(false);
                    }
                  };

                  save();
                }}
              >
                Save vehicle
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
