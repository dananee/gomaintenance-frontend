"use client";

import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import { useMemo, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { KanbanSortableCard } from "./work-orders-sortable-card";

export type WorkOrderCard = {
  id: UniqueIdentifier;
  code: string;
  vehicle: string;
  title: string;
  priority: "low" | "medium" | "high";
  assignee: string;
  comments?: number;
  attachments?: number;
};

const columns = [
  { key: "new", title: "New" },
  { key: "in_progress", title: "In Progress" },
  { key: "in_review", title: "In Review" },
  { key: "completed", title: "Completed" },
] as const;

type WorkOrdersKanbanProps = {
  items: Record<(typeof columns)[number]["key"], WorkOrderCard[]>;
  onChange?: (next: Record<(typeof columns)[number]["key"], WorkOrderCard[]>) => void;
};

export function WorkOrdersKanban({ items, onChange }: WorkOrdersKanbanProps) {
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [board, setBoard] = useState(items);
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 4 } })
  );

  const activeCard = useMemo(() => {
    for (const col of columns) {
      const match = board[col.key].find((c) => c.id === activeId);
      if (match) return match;
    }
    return null;
  }, [activeId, board]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeContainer = findContainer(active.id);
    const overContainer = findContainer(over.id);

    if (!activeContainer || !overContainer) return;

    if (activeContainer === overContainer) {
      const oldIndex = board[activeContainer].findIndex((i) => i.id === active.id);
      const newIndex = board[overContainer].findIndex((i) => i.id === over.id);
      const updated = {
        ...board,
        [overContainer]: arrayMove(board[overContainer], oldIndex, newIndex),
      } as WorkOrdersKanbanProps["items"];
      setBoard(updated);
      onChange?.(updated);
      return;
    }

    const activeItem = board[activeContainer].find((i) => i.id === active.id);
    if (!activeItem) return;

    const updated = { ...board } as WorkOrdersKanbanProps["items"];
    updated[activeContainer] = updated[activeContainer].filter((i) => i.id !== active.id);
    const overIndex = updated[overContainer].findIndex((i) => i.id === over.id);
    const insertAt = overIndex >= 0 ? overIndex : updated[overContainer].length;
    updated[overContainer] = [
      ...updated[overContainer].slice(0, insertAt),
      activeItem,
      ...updated[overContainer].slice(insertAt),
    ];

    setBoard(updated);
    onChange?.(updated);
  };

  const findContainer = (id: UniqueIdentifier) => {
    if (columns.some((c) => c.key === id)) return id as WorkOrdersKanbanProps["items"] extends Record<infer K, unknown>
      ? K
      : never;
    return columns.find((column) => board[column.key].some((item) => item.id === id))?.key;
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToParentElement]}
    >
      <div className="grid gap-4 lg:grid-cols-4">
        {columns.map((column) => (
          <Card
            key={column.key}
            className="flex min-h-[360px] flex-col rounded-2xl border-gm-border bg-gm-card/60 shadow-sm"
          >
            <div className="flex items-center justify-between border-b border-gm-border px-3 py-3 text-sm font-semibold text-white">
              <span>{column.title}</span>
              <Badge variant="outline" className="border-gm-border bg-black/30 text-gm-muted">
                {board[column.key].length} items
              </Badge>
            </div>
            <div className="h-full overflow-y-auto">
              <div className="flex flex-1 flex-col gap-3 p-3">
                <SortableContext
                  items={board[column.key].map((c) => c.id)}
                  strategy={rectSortingStrategy}
                >
                  {board[column.key].map((card) => (
                    <KanbanSortableCard key={card.id} id={card.id}>
                      <KanbanCard card={card} />
                    </KanbanSortableCard>
                  ))}
                </SortableContext>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {activeCard && (
        <div className="pointer-events-none fixed inset-0 z-50 flex items-start justify-start p-6 md:p-12">
          <div className="w-72 rounded-2xl border border-gm-primary/50 bg-gm-card/90 shadow-2xl">
            <KanbanCard card={activeCard} floating />
          </div>
        </div>
      )}
    </DndContext>
  );
}

function KanbanCard({ card, floating }: { card: WorkOrderCard; floating?: boolean }) {
  return (
    <div
      className={`flex flex-col gap-3 rounded-2xl border border-gm-border/80 bg-black/30 p-3 text-sm shadow-sm transition-transform ${
        floating ? "scale-[1.02]" : "hover:-translate-y-0.5 hover:border-gm-primary/60"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-semibold text-white">{card.code}</span>
        <Badge
          className={
            card.priority === "high"
              ? "bg-red-500/15 text-red-200 border-red-500/40"
              : card.priority === "medium"
                ? "bg-amber-500/15 text-amber-200 border-amber-500/40"
                : "bg-emerald-500/15 text-emerald-200 border-emerald-500/40"
          }
        >
          {card.priority}
        </Badge>
      </div>
      <p className="text-gm-muted">{card.title}</p>
      <div className="flex items-center justify-between text-xs text-gm-muted">
        <span className="rounded-full bg-gm-border/20 px-2 py-1">{card.vehicle}</span>
        <div className="flex items-center gap-2">
          <Avatar className="h-7 w-7 border border-gm-border/50">
            <AvatarFallback className="bg-gm-primary text-black">
              {card.assignee
                .split(" ")
                .map((p) => p[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-black/30 px-2 py-1">💬 {card.comments ?? 0}</span>
            <span className="rounded-lg bg-black/30 px-2 py-1">📎 {card.attachments ?? 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
