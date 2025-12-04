import { useMomentum } from "../hooks/useMetrics";

export function MomentumCard() {
  const { data, isLoading } = useMomentum();

  if (isLoading) {
    return (
      <div className="rounded-xl bg-panel/60 p-6 animate-pulse h-64 border border-white/5">
        <div className="h-4 bg-white/10 rounded w-3/4 mb-4"></div>
        <div className="h-8 bg-white/10 rounded w-1/2"></div>
      </div>
    );
  }

  if (!data) return null;

  const getTrendColor = () => {
    if (data.trend === "up") return "#22c55e";
    if (data.trend === "down") return "#ef4444";
    return "#94a3b8";
  };

  const getTrendIcon = () => {
    if (data.trend === "up") return "📈";
    if (data.trend === "down") return "📉";
    return "➡️";
  };

  return (
    <div className="relative rounded-xl bg-gradient-to-br from-purple-500/10 to-background-panel/60 backdrop-blur-sm p-6 border border-purple-500/20 shadow-lg">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">{getTrendIcon()}</span>
        <h3 className="text-lg font-semibold text-white">Shielded Pool Momentum</h3>
      </div>

      {/* Momentum Scores */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-background-panel/40 rounded-lg p-4 border border-white/5">
          <div className="text-xs text-slate-400 uppercase tracking-wide mb-1">
            7-Day
          </div>
          <div 
            className="text-3xl font-bold" 
            style={{ color: getTrendColor() }}
          >
            {data.momentum_7d.toFixed(1)}
          </div>
        </div>
        <div className="bg-background-panel/40 rounded-lg p-4 border border-white/5">
          <div className="text-xs text-slate-400 uppercase tracking-wide mb-1">
            30-Day
          </div>
          <div 
            className="text-3xl font-bold" 
            style={{ color: getTrendColor() }}
          >
            {data.momentum_30d.toFixed(1)}
          </div>
        </div>
      </div>

      {/* Trend Badge */}
      <div className="mb-3">
        <span 
          className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide"
          style={{ 
            backgroundColor: `${getTrendColor()}20`,
            color: getTrendColor(),
            border: `1px solid ${getTrendColor()}40`
          }}
        >
          {data.trend}
        </span>
      </div>

      {/* Interpretation */}
      <p className="text-sm text-slate-300 leading-relaxed">
        {data.interpretation}
      </p>
    </div>
  );
}
