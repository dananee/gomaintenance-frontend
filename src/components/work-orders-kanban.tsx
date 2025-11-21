"use client";

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  UniqueIdentifier,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
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

  useEffect(() => {
    setBoard(items);
  }, [items]);

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
    if (!over) {
      setActiveId(null);
      return;
    }

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
      setActiveId(null);
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
    setActiveId(null);
  };

  const findContainer = (id: UniqueIdentifier) => {
    if (columns.some((c) => c.key === id))
      return id as WorkOrdersKanbanProps["items"] extends Record<infer K, unknown> ? K : never;
    return columns.find((column) => board[column.key].some((item) => item.id === id))?.key;
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid gap-6 lg:grid-cols-4">
        {columns.map((column) => (
          <DroppableColumn key={column.key} column={column} count={board[column.key].length}>
            <SortableContext items={board[column.key].map((c) => c.id)} strategy={rectSortingStrategy}>
              {board[column.key].map((card) => (
                <KanbanSortableCard key={card.id} id={card.id}>
                  <KanbanCard card={card} />
                </KanbanSortableCard>
              ))}
            </SortableContext>
          </DroppableColumn>
        ))}
      </div>

      <DragOverlay dropAnimation={{ duration: 180, easing: "ease-out" }}>
        {activeCard ? (
          <div className="w-72 rounded-xl border border-border/80 bg-card shadow-xl">
            <KanbanCard card={activeCard} floating />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

function DroppableColumn({
  column,
  count,
  children,
}: {
  column: (typeof columns)[number];
  count: number;
  children: ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: column.key });

  return (
    <Card
      ref={setNodeRef}
      className={`flex min-h-[360px] flex-col rounded-xl border-border bg-card shadow-sm transition ${
        isOver ? "border-primary/50 shadow-md" : ""
      }`}
    >
      <div className="flex items-center justify-between border-b border-border/70 px-5 py-4 text-sm font-semibold text-foreground">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-accent ring-2 ring-border/50" />
          <span>{column.title}</span>
        </div>
        <Badge variant="outline" className="border-border bg-muted/60 text-foreground ring-1 ring-border/50">
          {count} {count === 1 ? "item" : "items"}
        </Badge>
      </div>
      <div className={`h-full overflow-y-auto ${isOver ? "bg-muted/40" : ""}`}>
        <div className="flex flex-1 flex-col gap-3 p-3">{children}</div>
      </div>
    </Card>
  );
}

function KanbanCard({ card, floating }: { card: WorkOrderCard; floating?: boolean }) {
  const priorityStyle = {
    high: "bg-red-500/15 text-red-300 border-red-500/50",
    medium: "bg-amber-400/20 text-foreground border-amber-300/60",
    low: "bg-emerald-500/15 text-emerald-300 border-emerald-400/50",
  }[card.priority];

  return (
    <motion.div
      layout
      className={`flex flex-col gap-3 rounded-xl border border-border/80 bg-card p-3 text-sm shadow-sm transition-transform ${
        floating ? "scale-[1.02]" : "hover:-translate-y-1 hover:shadow-md"
      }`}
      whileHover={{ y: -4 }}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="rounded-full bg-muted/60 px-3 py-1 text-xs font-semibold text-foreground ring-1 ring-border/40">
          {card.code}
        </span>
        <Badge className={`${priorityStyle} ring-1 ring-border/50`}>{card.priority}</Badge>
      </div>
      <p className="text-base font-semibold text-foreground">{card.title}</p>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="rounded-full bg-muted/50 px-2 py-1 ring-1 ring-border/40">{card.vehicle}</span>
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8 ring-1 ring-border/50">
            <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground mix-blend-lighten">
              {card.assignee
                .split(" ")
                .map((p) => p[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-2 rounded-full bg-surface-2 px-3 py-1 text-foreground ring-1 ring-border/40">
            <span>💬 {card.comments ?? 0}</span>
            <span>📎 {card.attachments ?? 0}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
