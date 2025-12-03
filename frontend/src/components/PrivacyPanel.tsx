import { Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { usePrivacyMetrics } from "../hooks/useMetrics";

export function PrivacyPanel() {
  const { data, isLoading } = usePrivacyMetrics();

  if (isLoading) return <div className="rounded-xl bg-panel/60 p-6 animate-pulse h-80"></div>;
  if (!data) return null;

  const scoreColor = data.latest_score >= 45 ? "#F3B724" :
                     data.latest_score >= 35 ? "#f5a623" : "#ff5a5f";

  return (
    <div className="rounded-xl bg-gradient-to-br from-background-panel/80 to-background-panel/40 backdrop-blur-sm p-6 border border-accent/10 hover:border-accent/20 transition-all duration-300">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <span className="text-accent">🛡️</span>
        Privacy Metrics
      </h3>

      {/* Privacy Score Display */}
      <div className="flex items-center justify-between mb-6 p-4 bg-accent/5 rounded-lg border border-accent/20">
        <div>
          <div className="text-3xl font-bold" style={{ color: scoreColor }}>
            {data.latest_score.toFixed(1)}
          </div>
          <div className="text-xs text-slate-400 mt-1">Privacy Score</div>
        </div>
        <div className="text-right">
          <div className="text-xl font-semibold text-accent">{data.privacy_grade}</div>
          <div className="text-xs text-slate-400 mt-1">7-day avg: {data.avg_7d_score.toFixed(1)}</div>
        </div>
      </div>

      {/* Trend Chart */}
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data.trends} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <XAxis
            dataKey="date"
            stroke="#6b7280"
            tick={{ fill: '#9ca3af', fontSize: 11 }}
            tickFormatter={(value: string) => value.slice(5)}
          />
          <YAxis stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 11 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1A0D11",
              borderColor: "#F3B724",
              borderRadius: "8px",
              border: "1px solid"
            }}
          />
          <Legend wrapperStyle={{ fontSize: '12px' }} />
          <Line
            type="monotone"
            dataKey="shielded_tx_pct"
            stroke="#F3B724"
            strokeWidth={2}
            name="Shielded Tx %"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="shielded_volume_pct"
            stroke="#FFD666"
            strokeWidth={2}
            name="Shielded Volume %"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-4 text-xs text-slate-400">
        Privacy score = (Shielded Tx % × 0.6) + (Shielded Volume % × 0.4)
      </div>
    </div>
  );
}
