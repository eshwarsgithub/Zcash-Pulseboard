import { useQuery } from "@tanstack/react-query";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import api from "../config/api";

export function PoolMigrationCard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["poolMigration"],
    queryFn: async () => {
      const response = await api.get("/metrics/pool-migration");
      return response.data;
    },
    refetchInterval: 60000,
  });

  if (isLoading) {
    return (
      <div className="h-full rounded-xl bg-gradient-to-br from-panel/80 to-panel/40 backdrop-blur-sm p-6 shadow-lg shadow-black/40 border border-white/5 animate-pulse">
        <div className="h-8 bg-white/10 rounded mb-4"></div>
        <div className="h-40 bg-white/5 rounded"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="h-full rounded-xl bg-gradient-to-br from-panel/80 to-panel/40 backdrop-blur-sm p-6 shadow-lg shadow-black/40 border border-rose-500/30">
        <p className="text-rose-400 text-sm">Failed to load pool migration data</p>
      </div>
    );
  }

  const { current_adoption, avg_7d_adoption, adoption_velocity, forecast_30d, trends } = data;

  // Determine velocity color and trend
  const velocityColor = adoption_velocity > 0.5
    ? "text-emerald-400"
    : adoption_velocity > 0
    ? "text-accent"
    : adoption_velocity > -0.5
    ? "text-amber-400"
    : "text-rose-400";

  const velocityBg = adoption_velocity > 0.5
    ? "bg-emerald-500/10 border-emerald-500/30"
    : adoption_velocity > 0
    ? "bg-accent/10 border-accent/30"
    : adoption_velocity > -0.5
    ? "bg-amber-500/10 border-amber-500/30"
    : "bg-rose-500/10 border-rose-500/30";

  const trendIcon = adoption_velocity > 0 ? "📈" : adoption_velocity < 0 ? "📉" : "➡️";

  return (
    <div className="group h-full rounded-xl bg-gradient-to-br from-panel/80 to-panel/40 backdrop-blur-sm p-6 shadow-lg shadow-black/40 border border-white/5 hover:border-white/10 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="text-xl">🔒</span>
          Shielded Pool Adoption
        </h3>
        <span className="text-2xl">{trendIcon}</span>
      </div>

      {/* Current Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 rounded-lg bg-white/5 border border-white/10">
          <div className="text-xs text-slate-400 mb-1">Current</div>
          <div className="text-2xl font-bold text-white">
            {current_adoption.toFixed(1)}%
          </div>
        </div>
        <div className="p-3 rounded-lg bg-white/5 border border-white/10">
          <div className="text-xs text-slate-400 mb-1">7-Day Avg</div>
          <div className="text-2xl font-bold text-white">
            {avg_7d_adoption.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Velocity Indicator */}
      <div className={`p-3 rounded-lg border mb-4 ${velocityBg}`}>
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-300">Adoption Velocity</span>
          <span className={`text-sm font-bold ${velocityColor}`}>
            {adoption_velocity > 0 ? "+" : ""}
            {adoption_velocity.toFixed(3)}% / day
          </span>
        </div>
        <div className="mt-2 text-xs text-slate-400">
          {adoption_velocity > 0.5 && "Strong growth in shielded usage"}
          {adoption_velocity > 0 && adoption_velocity <= 0.5 && "Steady adoption increase"}
          {adoption_velocity < 0 && adoption_velocity >= -0.5 && "Slight adoption decline"}
          {adoption_velocity < -0.5 && "Significant decline in shielded usage"}
        </div>
      </div>

      {/* Mini Trend Chart */}
      <div className="mb-4">
        <ResponsiveContainer width="100%" height={120}>
          <AreaChart data={trends} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <defs>
              <linearGradient id="adoptionGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F3B724" stopOpacity={0.6}/>
                <stop offset="95%" stopColor="#F3B724" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" strokeOpacity={0.3} />
            <XAxis
              dataKey="date"
              stroke="#6b7280"
              tick={{ fill: '#6b7280', fontSize: 10 }}
              tickFormatter={(value) => value.slice(5)}
            />
            <YAxis
              stroke="#6b7280"
              tick={{ fill: '#6b7280', fontSize: 10 }}
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1A0D11",
                borderColor: "#F3B724",
                borderRadius: "6px",
                fontSize: "11px"
              }}
              labelStyle={{ color: "#fff", fontSize: "11px" }}
              formatter={(value: number) => [`${value.toFixed(2)}%`, "Adoption"]}
            />
            <Area
              type="monotone"
              dataKey="shielded_adoption_pct"
              stroke="#F3B724"
              strokeWidth={2}
              fill="url(#adoptionGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* 30-Day Forecast */}
      <div className="pt-3 border-t border-white/5">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400">30-Day Forecast</span>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-accent">{forecast_30d.toFixed(1)}%</span>
            <span className={`text-xs ${velocityColor}`}>
              ({(forecast_30d - current_adoption >= 0 ? "+" : "")}
              {(forecast_30d - current_adoption).toFixed(1)}%)
            </span>
          </div>
        </div>
        <div className="mt-2 h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-accent to-emerald-400 transition-all duration-1000"
            style={{ width: `${Math.min(100, forecast_30d)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
