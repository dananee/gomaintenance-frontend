"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { apiFetch } from "@/lib/api-client";

import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";

// ---- Types matching your Go API (adjust if needed) ----

type WorkOrder = {
  id: number;
  order_number?: string;
  vehicle_id?: number;
  order_type: string;
  status: string;
  priority: string;
  reported_date: string;
  planned_start_date?: string | null;
};

type Vehicle = {
  id: number;
  name: string;
  plate_number?: string | null;
};

// For DataTable block: adjust shape if your block expects something else
type WorkOrderRow = {
  id: number;
  orderNumber: string;
  vehicle: string;
  type: string;
  status: string;
  priority: string;
  reportedDate: string;
  plannedStart: string;
};

// For SectionCards block
type StatCard = {
  title: string;
  value: string | number;
  trend?: string;
  accent?: "primary" | "danger" | "muted";
};

// For ChartAreaInteractive block
type ChartPoint = {
  date: string;
  value: number;
};

export default function DashboardPage() {
  const { token, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const [woData, vData] = await Promise.all([
          apiFetch<WorkOrder[]>("/maintenance/work-orders", {}, token),
          apiFetch<Vehicle[]>("/vehicles", {}, token),
        ]);
        setWorkOrders(Array.isArray(woData) ? woData : []);
        setVehicles(Array.isArray(vData) ? vData : []);
      } catch (e) {
        console.error(e);
        setError("Failed to load dashboard data");
        setWorkOrders([]); // 🛡️ ensure array
        setVehicles([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token]);

  // Map vehicle id -> label
  const vehicleMap = useMemo(() => {
    const map = new Map<number, string>();
    vehicles.forEach((v) => {
      const label = v.plate_number ? `${v.name} (${v.plate_number})` : v.name;
      map.set(v.id, label);
    });
    return map;
  }, [vehicles]);

  // Compute stats for SectionCards
  const stats: StatCard[] = useMemo(() => {
    const open = workOrders.filter(
      (w) => w.status === "open" || w.status === "in_progress"
    ).length;
    const overdue = workOrders.filter((w) => {
      if (!w.planned_start_date) return false;
      const planned = new Date(w.planned_start_date);
      return (
        planned < new Date() && w.status !== "done" && w.status !== "cancelled"
      );
    }).length;
    const doneThisWeek = workOrders.filter((w) => {
      if (!w.reported_date) return false;
      const d = new Date(w.reported_date);
      const now = new Date();
      const diff = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
      return diff <= 7;
    }).length;

    return [
      {
        title: "Open work orders",
        value: open,
        trend: open > 0 ? "Check technician workload" : "All clear",
        accent: "primary",
      },
      {
        title: "Overdue maintenance",
        value: overdue,
        trend: overdue > 0 ? "Schedule ASAP" : "Up to date",
        accent: overdue > 0 ? "danger" : "muted",
      },
      {
        title: "New this week",
        value: doneThisWeek,
        trend: "Orders reported in last 7 days",
        accent: "muted",
      },
    ];
  }, [workOrders]);

  // Chart data: work orders per day (last 14 days)
  const chartData: ChartPoint[] = useMemo(() => {
    const counts = new Map<string, number>();
    workOrders.forEach((w) => {
      const d = new Date(w.reported_date);
      const key = d.toISOString().slice(0, 10); // YYYY-MM-DD
      counts.set(key, (counts.get(key) ?? 0) + 1);
    });
    const sortedKeys = Array.from(counts.keys()).sort();
    return sortedKeys.map((k) => ({ date: k, value: counts.get(k) ?? 0 }));
  }, [workOrders]);

  // Table data for DataTable
  const tableData: WorkOrderRow[] = useMemo(
    () =>
      workOrders.map((w) => ({
        id: w.id,
        orderNumber: w.order_number || `WO-${w.id}`,
        vehicle: w.vehicle_id
          ? vehicleMap.get(w.vehicle_id) || `#${w.vehicle_id}`
          : "N/A",
        type: w.order_type,
        status: w.status,
        priority: w.priority,
        reportedDate: new Date(w.reported_date).toLocaleDateString(),
        plannedStart: w.planned_start_date
          ? new Date(w.planned_start_date).toLocaleDateString()
          : "-",
      })),
    [workOrders, vehicleMap]
  );

  return (
    <>
      <SiteHeader
        title="Dashboard"
        description="Monitor fleet health and maintenance activity."
        userName={user?.full_name ?? "User"}
      />

      <main className="flex-1 space-y-8 overflow-x-hidden px-4 py-6 md:px-6 md:py-8 lg:px-10 lg:py-10">
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-gm-soft">
            {error}
          </div>
        )}

        {/* Top stats cards */}
        <SectionCards cards={stats} loading={loading} />

        {/* Chart + table layout */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          <ChartAreaInteractive
            title="Work orders per day"
            description="New maintenance orders created over time."
            data={chartData}
            loading={loading}
          />
          <DataTable
            title="Recent work orders"
            description="Latest maintenance activity across your fleet."
            data={tableData}
            loading={loading}
          />
        </div>
      </main>
    </>
  );
}
