import { useNetworkHealth } from "../hooks/useMetrics";

export function NetworkHealthCard() {
  const { data, isLoading } = useNetworkHealth();

  if (isLoading) return <div className="rounded-xl bg-panel/60 p-6 animate-pulse h-96"></div>;
  if (!data) return null;

  const scoreColor = data.overall_score >= 85 ? "#F3B724" :
                     data.overall_score >= 70 ? "#f5a623" : "#ff5a5f";

  return (
    <div className="relative rounded-xl bg-gradient-to-br from-accent/10 to-background-panel/60 backdrop-blur-sm p-6 border border-accent/20 shadow-lg">
      {/* Large Score Display */}
      <div className="text-center mb-6">
        <div className="text-7xl font-bold mb-2" style={{ color: scoreColor }}>
          {data.grade}
        </div>
        <div className="text-3xl font-semibold text-white mb-1">
          {data.overall_score}/100
        </div>
        <div className="text-sm text-slate-400">Network Health Score</div>
      </div>

      {/* Component Scores Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {Object.entries(data.component_scores).map(([key, score]) => (
          <div key={key} className="bg-background-panel/40 rounded-lg p-3 border border-white/5">
            <div className="text-xs text-slate-400 uppercase tracking-wide mb-1">
              {key}
            </div>
            <div className="text-2xl font-bold text-white">{score}</div>
          </div>
        ))}
      </div>

      {/* Issues Alert */}
      {data.issues.length > 0 && (
        <div className="mt-4 p-3 bg-warning/10 border border-warning/30 rounded-lg">
          <div className="text-xs font-semibold text-warning mb-1">⚠️ Attention Needed:</div>
          <ul className="text-xs text-warning/80 space-y-1">
            {data.issues.map((issue, i) => <li key={i}>• {issue}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}
