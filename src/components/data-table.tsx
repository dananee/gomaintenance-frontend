"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type WorkOrderRow = {
  id: number;
  orderNumber: string;
  vehicle: string;
  type: string;
  status: string;
  priority: string;
  reportedDate: string;
  plannedStart: string;
};

type DataTableProps = {
  title?: string;
  description?: string;
  data: WorkOrderRow[];
  loading?: boolean;
};

export function DataTable({
  title = "Recent work orders",
  description,
  data,
  loading,
}: DataTableProps) {
  return (
    <Card className="rounded-2xl border-gm-border bg-gm-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">{title}</CardTitle>
        {description && <p className="text-xs text-gm-muted">{description}</p>}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-8 w-full animate-pulse rounded bg-gm-border/60"
              />
            ))}
          </div>
        ) : data.length === 0 ? (
          <div className="py-6 text-center text-xs text-gm-muted">
            No work orders yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[90px]">Order #</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Reported</TableHead>
                  <TableHead>Planned start</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-mono text-xs">
                      {row.orderNumber}
                    </TableCell>
                    <TableCell className="text-xs">{row.vehicle}</TableCell>
                    <TableCell className="text-xs capitalize">
                      {row.type}
                    </TableCell>
                    <TableCell className="text-xs capitalize">
                      {row.status}
                    </TableCell>
                    <TableCell className="text-xs capitalize">
                      {row.priority}
                    </TableCell>
                    <TableCell className="text-xs">
                      {row.reportedDate}
                    </TableCell>
                    <TableCell className="text-xs">
                      {row.plannedStart}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
