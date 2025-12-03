import { AlertsFeed } from "./components/AlertsFeed";
import { InsightPanel } from "./components/InsightPanel";
import { MetricCard } from "./components/MetricCard";
import { NetworkHealthCard } from "./components/NetworkHealthCard";
import { PrivacyPanel } from "./components/PrivacyPanel";
import { TrendChart } from "./components/TrendChart";
import { useAlerts, useDailyMetrics, useKpis } from "./hooks/useMetrics";

export default function App() {
  const { data: metrics, isLoading: metricsLoading } = useDailyMetrics();
  const { data: kpis, isLoading: kpiLoading } = useKpis();
  const { data: alerts, isLoading: alertsLoading } = useAlerts();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-slate-950 p-6 text-white">
      {/* Header with gradient accent */}
      <header className="mb-8">
        <div className="flex items-center gap-3">
          <div className="h-12 w-1 bg-gradient-to-b from-accent via-accent-hover to-warning rounded-full"></div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Zcash Pulseboard
            </h1>
            <p className="text-slate-400 mt-1">Privacy-first network intelligence and alerts</p>
          </div>
        </div>
      </header>

      <main className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <section className="lg:col-span-2 space-y-6">
          {/* KPI Cards */}
          <div className="grid gap-4 sm:grid-cols-2">
            {kpiLoading && (
              <>
                <div className="animate-pulse rounded-xl bg-panel/50 backdrop-blur-sm p-4 h-32 border border-white/5">
                  <div className="h-4 bg-white/10 rounded w-3/4 mb-4"></div>
                  <div className="h-8 bg-white/10 rounded w-1/2"></div>
                </div>
                <div className="animate-pulse rounded-xl bg-panel/50 backdrop-blur-sm p-4 h-32 border border-white/5">
                  <div className="h-4 bg-white/10 rounded w-3/4 mb-4"></div>
                  <div className="h-8 bg-white/10 rounded w-1/2"></div>
                </div>
              </>
            )}
            {kpis?.cards.map((card) => (
              <MetricCard key={card.name} card={card} />
            ))}
          </div>

          {/* Chart */}
          <div className="transition-all duration-300 hover:scale-[1.01]">
            {metricsLoading && (
              <div className="h-80 rounded-xl bg-panel/50 backdrop-blur-sm p-6 border border-white/5 flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
                  <p className="text-slate-400">Loading metrics...</p>
                </div>
              </div>
            )}
            {metrics && <TrendChart data={metrics.data} />}
          </div>

          {/* Privacy Metrics Panel */}
          <div className="transition-all duration-300">
            <PrivacyPanel />
          </div>

          {/* Insights */}
          {kpis && (
            <div className="transition-all duration-300">
              <InsightPanel cards={kpis.cards} />
            </div>
          )}
        </section>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Network Health Card */}
          <NetworkHealthCard />

          {/* Alerts Feed */}
          {alertsLoading && (
            <div className="rounded-xl bg-panel/50 backdrop-blur-sm p-6 border border-white/5 min-h-[400px] flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-accent mx-auto mb-3"></div>
                <p className="text-slate-400 text-sm">Loading alerts...</p>
              </div>
            </div>
          )}
          {alerts && <AlertsFeed alerts={alerts.alerts} />}
        </aside>
      </main>
    </div>
  );
}
