import type { KPICard } from "../hooks/useMetrics";

interface InsightPanelProps {
  cards: KPICard[];
}

export function InsightPanel({ cards }: InsightPanelProps) {
  return (
    <div className="rounded-xl bg-panel p-4 shadow-sm shadow-black/40">
      <h3 className="text-lg font-semibold text-white">Today’s Insights</h3>
      <ul className="mt-3 space-y-2 text-sm text-slate-300">
        {cards.map((card) => (
          <li key={card.name}>
            <span className="font-medium text-white">{card.name}:</span> {card.insight}
          </li>
        ))}
      </ul>
    </div>
  );
}
