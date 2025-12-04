import { motion } from "framer-motion";
import CountUp from "react-countup";
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02, rotateY: 2 }}
      className={clsx(
        "group relative rounded-xl bg-gradient-to-br backdrop-blur-sm p-5 shadow-lg shadow-black/40",
        "border border-white/5 hover:border-accent/30 transition-all duration-300",
        "hover:shadow-2xl hover:shadow-accent/20",
        gradientMap[card.status]
      )}
    >
      {/* Animated shine effect */}
      <motion.div
        className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/5 to-transparent"
        animate={{
          x: ["-200%", "200%"],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatDelay: 5,
          ease: "linear",
        }}
      />

      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-accent/0 via-accent/10 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xs uppercase tracking-wider text-slate-400 font-medium"
          >
            {card.name}
          </motion.div>
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className={clsx(
              "rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide",
              "shadow-sm transition-all duration-200",
              statusBadge[card.status]
            )}
          >
            {card.status}
          </motion.span>
        </div>

        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
          className="text-3xl font-bold text-white mb-2 tracking-tight"
        >
          {card.unit === "%" ? (
            <>
              <CountUp end={card.value} decimals={2} duration={2} />%
            </>
          ) : card.unit === "ZEC" ? (
            <>
              <CountUp end={card.value} decimals={5} duration={2} /> ZEC
            </>
          ) : card.value >= 1000 ? (
            <>
              <CountUp end={card.value / 1000} decimals={1} duration={2} />k
            </>
          ) : (
            <CountUp end={card.value} duration={2} />
          )}
        </motion.div>

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
    </motion.div>
  );
}
