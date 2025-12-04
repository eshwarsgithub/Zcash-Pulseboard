import { motion } from "framer-motion";
import { Toaster } from "react-hot-toast";
import { AlertsFeed } from "./components/AlertsFeed";
import { AnimatedBackground } from "./components/AnimatedBackground";
import { DataFreshnessIndicator } from "./components/DataFreshnessIndicator.jsx";
import { ExportButton } from "./components/ExportButton";
import { InsightPanel } from "./components/InsightPanel";
import { MetricCard } from "./components/MetricCard";
import { MomentumCard } from "./components/MomentumCard.jsx";
import { NetworkHealthCard } from "./components/NetworkHealthCard";
import { PoolMigrationCard } from "./components/PoolMigrationCard";
import { PrivacyPanel } from "./components/PrivacyPanel";
import { TrendChart } from "./components/TrendChart";
import { useAlerts, useDailyMetrics, useKpis } from "./hooks/useMetrics";

export default function App() {
  const { data: metrics, isLoading: metricsLoading } = useDailyMetrics();
  const { data: kpis, isLoading: kpiLoading } = useKpis();
  const { data: alerts, isLoading: alertsLoading } = useAlerts();

  return (
    <>
      <AnimatedBackground />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1A0D11",
            color: "#fff",
            border: "1px solid #F3B724",
            borderRadius: "12px",
          },
          success: {
            iconTheme: {
              primary: "#F3B724",
              secondary: "#1A0D11",
            },
          },
        }}
      />
      <div className="relative min-h-screen bg-gradient-to-br from-background via-background to-slate-950 p-6 text-white">
        {/* Header with gradient accent */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="h-12 w-1 bg-gradient-to-b from-accent via-accent-hover to-warning rounded-full"></div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-accent to-slate-300 bg-clip-text text-transparent animate-gradient-x">
                Zcash Pulseboard
              </h1>
              <p className="text-slate-400 mt-1">Privacy-first network intelligence and alerts</p>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-3"
          >
            <DataFreshnessIndicator />
            <ExportButton type="metrics" label="Export Data" />
          </motion.div>
        </div>
      </motion.header>

      <main className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <section className="lg:col-span-2 space-y-6">
          {/* KPI Cards */}
          <motion.div
            className="grid gap-4 sm:grid-cols-2"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                  delayChildren: 0.4,
                },
              },
            }}
          >
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
            {kpis?.cards.map((card, index) => (
              <motion.div
                key={card.name}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <MetricCard card={card} />
              </motion.div>
            ))}
          </motion.div>

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

          {/* Pool Migration Panel */}
          <div className="transition-all duration-300">
            <PoolMigrationCard />
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

          {/* Privacy Momentum Card */}
          <MomentumCard />

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
    </>
  );
}
