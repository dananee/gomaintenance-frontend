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

export function VehicleCard({ title, subtitle, status, mileage, actions }: VehicleCardProps) {
  return (
    <Card className="flex flex-col gap-3 rounded-2xl border-gm-border bg-white/90 px-4 py-4 shadow-gm-soft">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-foreground">{title}</p>
          {subtitle && <p className="text-xs text-gm-muted">{subtitle}</p>}
        </div>
        {status && (
          <Badge variant="outline" className={statusStyle(status)}>
            {status}
          </Badge>
        )}
      </div>

      <Separator className="border-gm-border/80" />

      <div className="flex flex-wrap gap-3 text-xs text-gm-muted">
        {mileage && <span className="rounded-full bg-gm-panel px-2 py-1">Mileage: {mileage}</span>}
        {status && <span className="rounded-full bg-gm-primary/10 px-2 py-1 text-gm-secondary">Service {status}</span>}
      </div>

      {actions && actions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {actions.map((action) => (
            <Button
              key={action.label}
              size="sm"
              variant="outline"
              onClick={action.onClick}
              className="border-gm-border text-foreground hover:border-gm-primary hover:text-gm-secondary"
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
  if (status === "active") return "bg-gm-success/10 text-gm-success border-gm-success/30";
  if (status === "critical") return "bg-gm-danger/10 text-gm-danger border-gm-danger/30";
  return "border-gm-border text-gm-muted bg-gm-panel";
}
