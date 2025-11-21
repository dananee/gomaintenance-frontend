import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type SectionCard = {
  title: string;
  value: string | number;
  trend?: string;
  accent?: "primary" | "danger" | "muted";
};

type SectionCardsProps = {
  cards: SectionCard[];
  loading?: boolean;
};

export function SectionCards({ cards, loading }: SectionCardsProps) {
  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-28 animate-pulse rounded-xl border border-border/80 bg-card/70 shadow-sm"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {cards.map((card) => {
        let accentClasses = "border-border bg-card";
        if (card.accent === "primary") accentClasses = "border-border/80 bg-[color:var(--surface-1)] shadow-sm";
        if (card.accent === "danger") accentClasses = "border-destructive/40 bg-destructive/5";
        if (card.accent === "muted") accentClasses = "border-border/70 bg-muted/40";

        return (
          <motion.div
            key={card.title}
            whileHover={{ y: -6, scale: 1.01 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
          >
            <Card className={`overflow-hidden ${accentClasses}`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-border/70 bg-card/60 px-6 py-4">
                <CardTitle className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  {card.title}
                </CardTitle>
                <span className="rounded-full bg-surface-2 px-3 py-1 text-[11px] font-semibold text-foreground ring-1 ring-border/50">
                  KPI
                </span>
              </CardHeader>
              <CardContent className="px-6 pb-6 pt-5">
                <p className="text-3xl font-semibold text-foreground">{card.value}</p>
                {card.trend && <p className="mt-2 text-sm text-muted-foreground">{card.trend}</p>}
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
