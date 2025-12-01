import clsx from "clsx";

import type { KPICard } from "../hooks/useMetrics";

const trendColor: Record<"up" | "down" | "flat", string> = {
  up: "text-emerald-400",
  down: "text-rose-400",
  flat: "text-slate-300"
};

const statusBadge: Record<KPICard["status"], string> = {
  good: "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30",
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
  return (
    <div className="rounded-xl bg-panel p-4 shadow-sm shadow-black/40">
      <div className="flex items-center justify-between">
        <div className="text-sm uppercase tracking-wide text-slate-300">{card.name}</div>
        <span className={clsx("rounded-full px-2 py-0.5 text-xs font-semibold", statusBadge[card.status])}>
          {card.status.toUpperCase()}
        </span>
      </div>
      <div className="mt-2 text-3xl font-semibold text-white">
        {formatValue(card.value, card.unit)}
      </div>
      <div className="mt-1 text-sm text-slate-400">{card.insight}</div>
      {card.delta_percent !== undefined && card.delta_percent !== null && card.trend && (
        <div className={clsx("mt-2 text-sm", trendColor[card.trend])}>
          {formatDelta(card.delta_percent, card.trend, card.unit)}
        </div>
      )}
    </div>
  );
}
