import clsx from "clsx";

import type { KPICard } from "../hooks/useMetrics";

const trendColor: Record<"up" | "down" | "flat", string> = {
  up: "text-emerald-400",
  down: "text-rose-400",
  flat: "text-slate-300"
};

const statusBadge: Record<KPICard["status"], string> = {
  good: "bg-accent/15 text-accent border border-accent/30",
  warning: "bg-warning/15 text-warning border border-warning/30",
  critical: "bg-danger/15 text-danger border border-danger/30"
};

const formatValue = (value: number, unit: string) => {
  if (unit === "%") {
    return `${value.toFixed(2)}%`;
  }
  if (unit === "ZEC") {
    return `${value.toFixed(5)} ZEC`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}k`;
  }
  return `${value}`;
};

const formatDelta = (delta?: number, trend?: KPICard["trend"], unit?: string) => {
  if (delta === undefined || delta === null || trend === null || trend === undefined) {
    return "";
  }
  const prefix = trend === "up" ? "+" : trend === "down" ? "−" : "";
  const absDelta = Math.abs(delta);
  const suffix = unit === "%" ? "pp" : "%";
  return `${prefix}${absDelta.toFixed(2)}${suffix}`;
};

interface MetricCardProps {
  card: KPICard;
}

export function MetricCard({ card }: MetricCardProps) {
  const gradientMap = {
    good: "from-accent/5 to-accent/0",
    warning: "from-amber-500/5 to-amber-500/0",
    critical: "from-rose-500/5 to-rose-500/0"
  };

  return (
    <div className={clsx(
      "group relative rounded-xl bg-gradient-to-br backdrop-blur-sm p-5 shadow-lg shadow-black/40",
      "border border-white/5 hover:border-white/10 transition-all duration-300",
      "hover:shadow-xl hover:shadow-black/60 hover:-translate-y-0.5",
      gradientMap[card.status]
    )}>
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-accent/0 via-accent/5 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs uppercase tracking-wider text-slate-400 font-medium">{card.name}</div>
          <span className={clsx(
            "rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide",
            "shadow-sm transition-all duration-200",
            statusBadge[card.status]
          )}>
            {card.status}
          </span>
        </div>

        <div className="text-3xl font-bold text-white mb-2 tracking-tight">
          {formatValue(card.value, card.unit)}
        </div>

        <div className="text-xs text-slate-400 leading-relaxed min-h-[32px]">{card.insight}</div>

        {card.delta_percent !== undefined && card.delta_percent !== null && card.trend && (
          <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-white/5">
            <span className={clsx(
              "text-sm font-semibold flex items-center gap-1",
              trendColor[card.trend]
            )}>
              {card.trend === "up" && "↗"}
              {card.trend === "down" && "↘"}
              {card.trend === "flat" && "→"}
              {formatDelta(card.delta_percent, card.trend, card.unit)}
            </span>
            <span className="text-[10px] text-slate-500">vs previous</span>
          </div>
        )}
      </div>
    </div>
  );
}
