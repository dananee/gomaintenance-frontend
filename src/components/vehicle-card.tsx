import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type VehicleCardProps = {
  id: number;
  name: string;
  plate?: string | null;
  brand?: string | null;
  model?: string | null;
  year?: number | null;
  odometer?: number | null;
  status: string;
};

export function VehicleCard({
  id,
  name,
  plate,
  brand,
  model,
  year,
  odometer,
  status,
}: VehicleCardProps) {
  const statusTone = statusClass(status);

  return (
    <Card className="flex flex-col gap-3 rounded-2xl border-gm-border bg-gm-card px-4 py-3 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-semibold text-white">{name}</div>
        <Badge
          variant="outline"
          className={cn(
            "rounded-full border px-2 py-0.5 text-[11px] uppercase tracking-wide",
            statusTone
          )}
        >
          {status}
        </Badge>
      </div>

      <div className="flex flex-wrap gap-3 text-xs text-gm-muted">
        <span className="rounded-lg bg-black/30 px-2 py-1 font-mono text-[11px]">
          #{id}
        </span>
        <span className="rounded-lg bg-black/30 px-2 py-1">
          Plate: {plate || "—"}
        </span>
        <span className="rounded-lg bg-black/30 px-2 py-1">
          {brand || ""} {model || ""}
        </span>
        <span className="rounded-lg bg-black/30 px-2 py-1">{year || "-"}</span>
        <span className="rounded-lg bg-black/30 px-2 py-1">
          Odo: {odometer ? `${Math.round(odometer)} km` : "-"}
        </span>
      </div>
    </Card>
  );
}

function statusClass(status: string) {
  const s = status.toLowerCase();
  if (s === "active") return "border-emerald-500/40 text-emerald-200 bg-emerald-500/10";
  if (s === "maintenance") return "border-amber-500/40 text-amber-200 bg-amber-500/10";
  if (s === "out_of_service" || s === "inactive")
    return "border-red-500/40 text-red-200 bg-red-500/10";
  return "border-gm-border text-gm-muted bg-black/30";
}
