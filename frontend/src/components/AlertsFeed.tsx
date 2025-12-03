import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import type { Alert } from "../hooks/useMetrics";

dayjs.extend(relativeTime);

const severityConfig: Record<Alert["severity"], { bg: string; text: string; icon: string; border: string }> = {
  low: { 
    bg: "bg-emerald-500/10", 
    text: "text-emerald-300", 
    icon: "ℹ️",
    border: "border-emerald-500/30"
  },
  medium: { 
    bg: "bg-amber-500/10", 
    text: "text-amber-300", 
    icon: "⚠️",
    border: "border-amber-500/30"
  },
  high: { 
    bg: "bg-rose-500/10", 
    text: "text-rose-300", 
    icon: "🚨",
    border: "border-rose-500/30"
  }
};

interface AlertsFeedProps {
  alerts: Alert[];
}

export function AlertsFeed({ alerts }: AlertsFeedProps) {
  return (
    <div className="h-full rounded-xl bg-gradient-to-br from-panel/80 to-panel/40 backdrop-blur-sm p-5 shadow-lg shadow-black/40 border border-white/5 hover:border-white/10 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="text-xl">🔔</span>
          Alerts
        </h3>
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
          {alerts.length} active
        </span>
      </div>

      <ul className="space-y-3 overflow-y-auto pr-2 max-h-[calc(100vh-250px)] scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {alerts.length === 0 ? (
          <li className="text-center py-12 text-slate-400">
            <div className="text-4xl mb-3">✨</div>
            <p className="text-sm">All clear! No active alerts.</p>
          </li>
        ) : (
          alerts.map((alert) => {
            const config = severityConfig[alert.severity];
            return (
              <li
                key={alert.id}
                className="group relative rounded-lg border p-4 transition-all duration-200 hover:scale-[1.02] hover:shadow-md bg-panel/50"
                style={{ borderColor: `${config.border.split('-')[1]}20` }}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{config.icon}</span>
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide border ${config.bg} ${config.text} ${config.border}`}>
                      {alert.severity}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 whitespace-nowrap">
                    {dayjs(alert.timestamp).fromNow()}
                  </span>
                </div>

                <p className="text-sm font-semibold text-white mb-1.5 leading-snug">
                  {alert.summary}
                </p>
                
                <p className="text-xs text-slate-400 leading-relaxed mb-2">
                  {alert.explanation}
                </p>

                <div className="flex items-center gap-3 text-[10px] text-slate-500 pt-2 border-t border-white/5">
                  <span>Metric: <span className="text-slate-400 font-medium">{alert.metric}</span></span>
                  <span>•</span>
                  <span>Change: <span className={alert.delta_percent > 0 ? "text-emerald-400" : "text-rose-400"}>{alert.delta_percent > 0 ? "+" : ""}{alert.delta_percent.toFixed(1)}%</span></span>
                </div>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
