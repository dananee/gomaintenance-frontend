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
    <Card className="overflow-hidden rounded-xl border-border bg-card shadow-sm">
      <div className="border-b border-border/70 bg-card/80 px-6 py-4">
        {title && (
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col">
              <p className="text-sm font-semibold text-foreground">{title}</p>
              {description && <p className="text-xs text-muted-foreground">{description}</p>}
            </div>
            <span className="rounded-full bg-surface-2 px-3 py-1 text-[11px] font-semibold uppercase text-foreground ring-1 ring-border/60">
              Live
            </span>
          </div>
        )}
      </div>

      {loading ? (
        <div className="space-y-2 px-6 py-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-9 w-full animate-pulse rounded-lg bg-muted/70" />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table className="min-w-full">
            <TableCaption className="text-xs text-muted-foreground">
              {data.length === 0
                ? "No rows to display"
                : `${data.length} records in view`}
            </TableCaption>
            <TableHeader>
              <TableRow className="bg-muted/60 text-sm font-semibold text-foreground">
                {data[0] &&
                  Object.keys(data[0]).map((key) => (
                    <TableHead key={key} className="px-6 py-3 uppercase tracking-wide">
                      {key}
                    </TableHead>
                  ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  className="text-sm transition hover:bg-muted/40 even:bg-muted/30"
                >
                  {Object.keys(row).map((key) => (
                    <TableCell key={key} className="px-6 py-3 text-muted-foreground">
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
