import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type DataTableProps<T> = {
  title?: string;
  description?: string;
  data: T[];
  loading?: boolean;
};

export function DataTable<T extends Record<string, unknown>>({
  title,
  description,
  data,
  loading,
}: DataTableProps<T>) {
  return (
    <Card className="overflow-hidden rounded-2xl border-gm-border bg-white/90 shadow-gm-soft">
      <div className="border-b border-gm-border/70 bg-gradient-to-r from-white to-gm-panel/40 px-4 py-3">
        {title && (
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col">
              <p className="text-sm font-semibold text-foreground">{title}</p>
              {description && <p className="text-xs text-gm-muted">{description}</p>}
            </div>
            <span className="rounded-full bg-gm-primary/10 px-2 py-1 text-[11px] font-semibold uppercase text-gm-secondary">
              Live
            </span>
          </div>
        )}
      </div>

      {loading ? (
        <div className="space-y-2 px-4 py-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-9 w-full animate-pulse rounded-lg bg-gm-panel" />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table className="min-w-full">
            <TableCaption className="text-xs text-gm-muted">
              {data.length === 0
                ? "No rows to display"
                : `${data.length} records in view`}
            </TableCaption>
            <TableHeader>
              <TableRow className="bg-gm-panel/80 text-sm font-semibold text-gm-secondary">
                {data[0] &&
                  Object.keys(data[0]).map((key) => (
                    <TableHead key={key} className="px-4 py-3 uppercase tracking-wide">
                      {key}
                    </TableHead>
                  ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  className="text-sm transition hover:bg-gm-primary/5 even:bg-gm-panel/40"
                >
                  {Object.keys(row).map((key) => (
                    <TableCell key={key} className="px-4 py-3 text-gm-muted">
                      {String(row[key])}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </Card>
  );
}
