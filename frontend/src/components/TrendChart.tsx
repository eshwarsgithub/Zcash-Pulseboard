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
    <div className="group h-80 w-full rounded-xl bg-gradient-to-br from-panel/80 to-panel/40 backdrop-blur-sm p-6 shadow-lg shadow-black/40 border border-white/5 hover:border-white/10 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white">Transaction Volume Trend</h3>
        <div className="flex gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-accent"></div>
            <span className="text-slate-400">Shielded</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-blue-400"></div>
            <span className="text-slate-400">Transparent</span>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height="85%">
        <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
          <defs>
            <linearGradient id="shieldedGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F3B724" stopOpacity={0.6}/>
              <stop offset="95%" stopColor="#F3B724" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="transparentGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#60a5fa" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" strokeOpacity={0.5} />
          <XAxis
            dataKey="date"
            stroke="#6b7280"
            tick={{ fill: '#9ca3af', fontSize: 12 }}
            tickFormatter={(value: string) => value.slice(5)}
          />
          <YAxis
            stroke="#6b7280"
            tick={{ fill: '#9ca3af', fontSize: 12 }}
            tickFormatter={(value: number) => `${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1A0D11",
              borderColor: "#F3B724",
              borderRadius: "8px",
              border: "1px solid",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.3)"
            }}
            labelStyle={{ color: "#fff", fontWeight: "600", marginBottom: "4px" }}
            itemStyle={{ color: "#cbd5e1", fontSize: "13px" }}
          />
          <Area
            type="monotone"
            dataKey="shielded_transactions"
            stroke="#F3B724"
            strokeWidth={2}
            fill="url(#shieldedGradient)"
            name="Shielded Tx"
          />
          <Area
            type="monotone"
            dataKey="transparent_transactions"
            stroke="#60a5fa"
            strokeWidth={2}
            fill="url(#transparentGradient)"
            name="Transparent Tx"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
