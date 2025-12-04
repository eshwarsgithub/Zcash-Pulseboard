import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
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
    return (_jsxs(_Fragment, { children: [_jsx(AnimatedBackground, {}), _jsx(Toaster, { position: "top-right", toastOptions: {
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
                } }), _jsxs("div", { className: "relative min-h-screen bg-gradient-to-br from-background via-background to-slate-950 p-6 text-white", children: [_jsx(motion.header, { initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 }, className: "mb-8", children: _jsxs("div", { className: "flex items-center justify-between gap-4 flex-wrap", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "h-12 w-1 bg-gradient-to-b from-accent via-accent-hover to-warning rounded-full" }), _jsxs(motion.div, { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, transition: { delay: 0.2 }, children: [_jsx("h1", { className: "text-4xl font-bold bg-gradient-to-r from-white via-accent to-slate-300 bg-clip-text text-transparent animate-gradient-x", children: "Zcash Pulseboard" }), _jsx("p", { className: "text-slate-400 mt-1", children: "Privacy-first network intelligence and alerts" })] })] }), _jsxs(motion.div, { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, transition: { delay: 0.3 }, className: "flex items-center gap-3", children: [_jsx(DataFreshnessIndicator, {}), _jsx(ExportButton, { type: "metrics", label: "Export Data" })] })] }) }), _jsxs("main", { className: "grid gap-6 lg:grid-cols-3", children: [_jsxs("section", { className: "lg:col-span-2 space-y-6", children: [_jsxs(motion.div, { className: "grid gap-4 sm:grid-cols-2", initial: "hidden", animate: "visible", variants: {
                                            hidden: { opacity: 0 },
                                            visible: {
                                                opacity: 1,
                                                transition: {
                                                    staggerChildren: 0.1,
                                                    delayChildren: 0.4,
                                                },
                                            },
                                        }, children: [kpiLoading && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "animate-pulse rounded-xl bg-panel/50 backdrop-blur-sm p-4 h-32 border border-white/5", children: [_jsx("div", { className: "h-4 bg-white/10 rounded w-3/4 mb-4" }), _jsx("div", { className: "h-8 bg-white/10 rounded w-1/2" })] }), _jsxs("div", { className: "animate-pulse rounded-xl bg-panel/50 backdrop-blur-sm p-4 h-32 border border-white/5", children: [_jsx("div", { className: "h-4 bg-white/10 rounded w-3/4 mb-4" }), _jsx("div", { className: "h-8 bg-white/10 rounded w-1/2" })] })] })), kpis?.cards.map((card, index) => (_jsx(motion.div, { variants: {
                                                    hidden: { opacity: 0, y: 20 },
                                                    visible: { opacity: 1, y: 0 },
                                                }, children: _jsx(MetricCard, { card: card }) }, card.name)))] }), _jsxs("div", { className: "transition-all duration-300 hover:scale-[1.01]", children: [metricsLoading && (_jsx("div", { className: "h-80 rounded-xl bg-panel/50 backdrop-blur-sm p-6 border border-white/5 flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4" }), _jsx("p", { className: "text-slate-400", children: "Loading metrics..." })] }) })), metrics && _jsx(TrendChart, { data: metrics.data })] }), _jsx("div", { className: "transition-all duration-300", children: _jsx(PrivacyPanel, {}) }), _jsx("div", { className: "transition-all duration-300", children: _jsx(PoolMigrationCard, {}) }), kpis && (_jsx("div", { className: "transition-all duration-300", children: _jsx(InsightPanel, { cards: kpis.cards }) }))] }), _jsxs("aside", { className: "space-y-6", children: [_jsx(NetworkHealthCard, {}), _jsx(MomentumCard, {}), alertsLoading && (_jsx("div", { className: "rounded-xl bg-panel/50 backdrop-blur-sm p-6 border border-white/5 min-h-[400px] flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "animate-spin rounded-full h-10 w-10 border-b-2 border-accent mx-auto mb-3" }), _jsx("p", { className: "text-slate-400 text-sm", children: "Loading alerts..." })] }) })), alerts && _jsx(AlertsFeed, { alerts: alerts.alerts })] })] })] })] }));
}
