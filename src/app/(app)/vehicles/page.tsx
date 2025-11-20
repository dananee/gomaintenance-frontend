"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { apiFetch } from "@/lib/api-client";
import { SiteHeader } from "@/components/site-header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
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

      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-4">
          {error && (
            <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <Card className="w-full rounded-2xl border-gm-border bg-gm-card px-4 py-3 md:px-6 md:py-4">
            <div className="overflow-x-auto">
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
                  {/* Loading skeleton */}
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

                  {/* Empty state */}
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

                  {/* Data rows */}
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
          </Card>
        </div>
      </main>
    </>
  );
}
