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
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-28 animate-pulse rounded-2xl border border-gm-border bg-white/60 shadow-gm-soft"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {cards.map((card) => {
        let accentClasses = "border-gm-border bg-white/85";
        if (card.accent === "primary") accentClasses = "border-gm-primary/20 bg-gm-primary/5";
        if (card.accent === "danger") accentClasses = "border-gm-danger/30 bg-red-50";

        return (
          <motion.div
            key={card.title}
            whileHover={{ y: -6, scale: 1.01 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
          >
            <Card className={`gradient-border overflow-hidden ${accentClasses}`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-gm-border/70 bg-white/60 px-4 py-3">
                <CardTitle className="text-xs font-semibold uppercase tracking-[0.16em] text-gm-muted">
                  {card.title}
                </CardTitle>
                <span className="rounded-full bg-gm-primary/10 px-3 py-1 text-[11px] font-semibold text-gm-secondary">
                  KPI
                </span>
              </CardHeader>
              <CardContent className="px-4 pb-5 pt-4">
                <p className="text-3xl font-semibold text-foreground">{card.value}</p>
                {card.trend && <p className="mt-2 text-sm text-gm-muted">{card.trend}</p>}
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
