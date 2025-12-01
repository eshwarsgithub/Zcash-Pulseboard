import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import type { DailyMetric } from "../hooks/useMetrics";

interface TrendChartProps {
  data: DailyMetric[];
}

export function TrendChart({ data }: TrendChartProps) {
  return (
    <div className="h-72 w-full rounded-xl bg-panel p-4 shadow-sm shadow-black/40">
      <h3 className="text-lg font-semibold text-white">Transaction Volume Trend</h3>
      <ResponsiveContainer width="100%" height="90%">
        <AreaChart data={data} margin={{ top: 16, right: 24, left: 0, bottom: 24 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2435" />
          <XAxis
            dataKey="date"
            stroke="#9ca3af"
            tickFormatter={(value: string) => value.slice(5)}
          />
          <YAxis
            stroke="#9ca3af"
            tickFormatter={(value: number) => `${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip
            contentStyle={{ backgroundColor: "#10131f", borderColor: "#24dbb5" }}
            labelStyle={{ color: "#fff" }}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="shielded_transactions"
            stroke="#24dbb5"
            fill="#24dbb5"
            fillOpacity={0.3}
            name="Shielded Tx"
          />
          <Area
            type="monotone"
            dataKey="transparent_transactions"
            stroke="#60a5fa"
            fill="#60a5fa"
            fillOpacity={0.25}
            name="Transparent Tx"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
