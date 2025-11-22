import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export type VehicleCardProps = {
  title: string;
  subtitle?: string;
  status?: string;
  mileage?: string;
  actions?: Array<{ label: string; onClick: () => void }>;
};

export function VehicleCard({
  title,
  subtitle,
  status,
  mileage,
  actions,
}: VehicleCardProps) {
  return (
    <Card className="flex flex-col gap-4 rounded-xl border-border bg-red px-5 py-5 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-foreground">{title}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        {status && (
          <Badge
            variant="outline"
            className={`${statusStyle(status)} ring-1 ring-border/50`}
          >
            {status}
          </Badge>
        )}
      </div>

      <Separator className="border-border/60" />

      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
        {mileage && (
          <span className="rounded-full bg-muted/60 px-3 py-1 ring-1 ring-border/40">
            Mileage: {mileage}
          </span>
        )}
        {status && (
          <span className="rounded-full bg-surface-2 px-3 py-1 text-foreground ring-1 ring-border/40">
            Service {status}
          </span>
        )}
      </div>

      {actions && actions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {actions.map((action) => (
            <Button
              key={action.label}
              size="sm"
              variant="outline"
              onClick={action.onClick}
              className="border-border text-foreground hover:border-primary hover:text-primary"
            >
              {action.label}
            </Button>
          ))}
        </div>
      )}
    </Card>
  );
}

function statusStyle(status: string) {
  if (status === "active")
    return "bg-green-500/15 text-green-300 border-green-500/50";
  if (status === "critical")
    return "bg-destructive/15 text-destructive border-destructive/40";
  return "border-border text-muted-foreground bg-muted/60";
}
