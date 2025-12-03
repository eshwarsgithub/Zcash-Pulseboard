import type { KPICard } from "../hooks/useMetrics";

interface InsightPanelProps {
  cards: KPICard[];
}

export function InsightPanel({ cards }: InsightPanelProps) {
  return (
    <div className="rounded-xl bg-gradient-to-br from-panel/80 to-panel/40 backdrop-blur-sm p-6 shadow-lg shadow-black/40 border border-white/5 hover:border-white/10 transition-all duration-300">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <span className="text-xl">💡</span>
        Today's Insights
      </h3>
      <ul className="space-y-3">
        {cards.map((card, index) => (
          <li 
            key={card.name}
            className="group flex gap-3 text-sm p-3 rounded-lg hover:bg-white/5 transition-all duration-200 border border-transparent hover:border-white/10"
          >
            <span className="text-accent font-bold mt-0.5 opacity-50 group-hover:opacity-100 transition-opacity">
              {String(index + 1).padStart(2, '0')}
            </span>
            <div>
              <span className="font-semibold text-white">{card.name}:</span>
              <span className="text-slate-300 ml-1">{card.insight}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
