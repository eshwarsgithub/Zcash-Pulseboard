import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export function MomentumCard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["momentum"],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE}/api/metrics/momentum`);
      return response.data;
    },
    refetchInterval: 60000, // Refresh every minute
  });

  if (isLoading) {
    return (
      <div className="h-full rounded-xl bg-gradient-to-br from-panel/80 to-panel/40 backdrop-blur-sm p-6 shadow-lg shadow-black/40 border border-white/5 animate-pulse">
        <div className="h-8 bg-white/10 rounded mb-4"></div>
        <div className="h-32 bg-white/5 rounded"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full rounded-xl bg-gradient-to-br from-panel/80 to-panel/40 backdrop-blur-sm p-6 shadow-lg shadow-black/40 border border-rose-500/30">
        <p className="text-rose-400 text-sm">Failed to load momentum data</p>
      </div>
    );
  }

  const { momentum_7d, momentum_30d, trend, interpretation } = data;

  // Determine color based on momentum score
  const getColor = (score) => {
    if (score > 20) return { primary: "#10b981", secondary: "#065f46" }; // Green
    if (score > 0) return { primary: "#F3B724", secondary: "#d19a0a" }; // Gold
    if (score > -20) return { primary: "#f59e0b", secondary: "#c2410c" }; // Orange
    return { primary: "#ef4444", secondary: "#991b1b" }; // Red
  };

  const color = getColor(momentum_7d);

  // Calculate gauge rotation (-90deg to 90deg based on -100 to 100 score)
  const rotation = (momentum_7d / 100) * 90;

  // Trend icon
  const trendIcon = trend === "up" ? "↗" : trend === "down" ? "↘" : "→";
  const trendColor =
    trend === "up"
      ? "text-emerald-400"
      : trend === "down"
      ? "text-rose-400"
      : "text-slate-400";

  return (
    <div className="group h-full rounded-xl bg-gradient-to-br from-panel/80 to-panel/40 backdrop-blur-sm p-6 shadow-lg shadow-black/40 border border-white/5 hover:border-white/10 transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="text-xl">📊</span>
          Privacy Momentum
        </h3>
        <span
          className={`text-2xl ${trendColor} transition-all duration-500 group-hover:scale-125`}
        >
          {trendIcon}
        </span>
      </div>

      {/* Gauge Visualization */}
      <div className="relative w-full h-40 flex items-center justify-center mb-4">
        {/* Background arc */}
        <svg
          className="absolute"
          width="200"
          height="120"
          viewBox="0 0 200 120"
        >
          {/* Red zone (-100 to -20) */}
          <path
            d="M 20 100 A 80 80 0 0 1 60 32"
            fill="none"
            stroke="#ef4444"
            strokeWidth="12"
            opacity="0.2"
          />
          {/* Orange zone (-20 to 0) */}
          <path
            d="M 60 32 A 80 80 0 0 1 100 20"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="12"
            opacity="0.2"
          />
          {/* Gold zone (0 to 20) */}
          <path
            d="M 100 20 A 80 80 0 0 1 140 32"
            fill="none"
            stroke="#F3B724"
            strokeWidth="12"
            opacity="0.2"
          />
          {/* Green zone (20 to 100) */}
          <path
            d="M 140 32 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#10b981"
            strokeWidth="12"
            opacity="0.2"
          />

          {/* Active arc */}
          <path
            d={`M 20 100 A 80 80 0 0 1 ${100 + 80 * Math.sin((rotation * Math.PI) / 180)} ${100 - 80 * Math.cos((rotation * Math.PI) / 180)}`}
            fill="none"
            stroke={color.primary}
            strokeWidth="14"
            strokeLinecap="round"
            className="transition-all duration-1000"
            style={{
              filter: `drop-shadow(0 0 8px ${color.primary})`,
            }}
          />

          {/* Center pivot */}
          <circle cx="100" cy="100" r="6" fill={color.primary} />
        </svg>

        {/* Score display */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/4 text-center">
          <div
            className="text-4xl font-bold transition-colors duration-500"
            style={{ color: color.primary }}
          >
            {momentum_7d > 0 ? "+" : ""}
            {momentum_7d.toFixed(0)}
          </div>
          <div className="text-xs text-slate-400 uppercase tracking-wide">
            7-Day Score
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">30-Day Average:</span>
          <span className="font-semibold text-white">
            {momentum_30d > 0 ? "+" : ""}
            {momentum_30d.toFixed(1)}
          </span>
        </div>

        <div className="pt-3 border-t border-white/5">
          <p className="text-xs text-slate-300 leading-relaxed">
            {interpretation}
          </p>
        </div>

        {/* Legend */}
        <div className="pt-2 grid grid-cols-2 gap-2 text-[10px]">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span className="text-slate-500">Pro-Privacy</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-rose-500"></div>
            <span className="text-slate-500">Pro-Transparent</span>
          </div>
        </div>
      </div>
    </div>
  );
}
