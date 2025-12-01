import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AlertsFeed } from "./components/AlertsFeed";
import { InsightPanel } from "./components/InsightPanel";
import { MetricCard } from "./components/MetricCard";
import { TrendChart } from "./components/TrendChart";
import { useAlerts, useDailyMetrics, useKpis } from "./hooks/useMetrics";
export default function App() {
    const { data: metrics, isLoading: metricsLoading } = useDailyMetrics();
    const { data: kpis, isLoading: kpiLoading } = useKpis();
    const { data: alerts, isLoading: alertsLoading } = useAlerts();
    return (_jsxs("div", { className: "min-h-screen bg-background p-6 text-white", children: [_jsxs("header", { className: "mb-6", children: [_jsx("h1", { className: "text-3xl font-bold", children: "Zcash Pulseboard" }), _jsx("p", { className: "text-slate-400", children: "Privacy-first network intelligence and alerts." })] }), _jsxs("main", { className: "grid gap-6 lg:grid-cols-3", children: [_jsxs("section", { className: "lg:col-span-2", children: [_jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [kpiLoading && _jsx("div", { className: "animate-pulse rounded-xl bg-panel p-4", children: "Loading KPIs\u2026" }), kpis?.cards.map((card) => (_jsx(MetricCard, { card: card }, card.name)))] }), _jsxs("div", { className: "mt-6", children: [metricsLoading && (_jsx("div", { className: "h-72 rounded-xl bg-panel p-4", children: "Loading metrics\u2026" })), metrics && _jsx(TrendChart, { data: metrics.data })] }), _jsx("div", { className: "mt-6", children: kpis && _jsx(InsightPanel, { cards: kpis.cards }) })] }), _jsxs("aside", { className: "space-y-4", children: [alertsLoading && (_jsx("div", { className: "rounded-xl bg-panel p-4", children: "Grabbing alerts\u2026" })), alerts && _jsx(AlertsFeed, { alerts: alerts.alerts })] })] })] }));
}
