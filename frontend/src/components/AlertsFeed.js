import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
const severityConfig = {
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
export function AlertsFeed({ alerts }) {
    const [filter, setFilter] = useState("all");
    // Filter alerts based on selected severity
    const filteredAlerts = filter === "all"
        ? alerts
        : alerts.filter(alert => alert.severity === filter);
    return (_jsxs("div", { className: "h-full rounded-xl bg-gradient-to-br from-panel/80 to-panel/40 backdrop-blur-sm p-5 shadow-lg shadow-black/40 border border-white/5 hover:border-white/10 transition-all duration-300", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsxs("h3", { className: "text-lg font-bold text-white flex items-center gap-2", children: [_jsx("span", { className: "text-xl", children: "\uD83D\uDD14" }), "Alerts"] }), _jsxs("span", { className: "text-xs font-semibold uppercase tracking-wide text-slate-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/10", children: [filteredAlerts.length, " active"] })] }), _jsxs("div", { className: "flex gap-2 mb-4 flex-wrap", children: [_jsx("button", { onClick: () => setFilter("all"), className: `px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${filter === "all"
                            ? "bg-white/20 text-white border border-white/30"
                            : "bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10"}`, children: "All" }), _jsx("button", { onClick: () => setFilter("high"), className: `px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${filter === "high"
                            ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                            : "bg-white/5 text-slate-400 border border-white/10 hover:bg-rose-500/10"}`, children: "\uD83D\uDEA8 High" }), _jsx("button", { onClick: () => setFilter("medium"), className: `px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${filter === "medium"
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            : "bg-white/5 text-slate-400 border border-white/10 hover:bg-amber-500/10"}`, children: "\u26A0\uFE0F Medium" }), _jsx("button", { onClick: () => setFilter("low"), className: `px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${filter === "low"
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : "bg-white/5 text-slate-400 border border-white/10 hover:bg-emerald-500/10"}`, children: "\u2139\uFE0F Low" })] }), _jsx("ul", { className: "space-y-3 overflow-y-auto pr-2 max-h-[calc(100vh-350px)] scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent", children: filteredAlerts.length === 0 ? (_jsxs("li", { className: "text-center py-12 text-slate-400", children: [_jsx("div", { className: "text-4xl mb-3", children: "\u2728" }), _jsx("p", { className: "text-sm", children: alerts.length === 0 ? "All clear! No active alerts." : "No alerts matching this filter." })] })) : (filteredAlerts.map((alert) => {
                    const config = severityConfig[alert.severity];
                    return (_jsxs("li", { className: "group relative rounded-lg border p-4 transition-all duration-200 hover:scale-[1.02] hover:shadow-md bg-panel/50", style: { borderColor: `${config.border.split('-')[1]}20` }, children: [_jsxs("div", { className: "flex items-start justify-between gap-3 mb-2", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-lg", children: config.icon }), _jsx("span", { className: `rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide border ${config.bg} ${config.text} ${config.border}`, children: alert.severity })] }), _jsx("span", { className: "text-[10px] text-slate-500 whitespace-nowrap", children: dayjs(alert.timestamp).fromNow() })] }), _jsx("p", { className: "text-sm font-semibold text-white mb-1.5 leading-snug", children: alert.summary }), _jsx("p", { className: "text-xs text-slate-400 leading-relaxed mb-2", children: alert.explanation }), _jsxs("div", { className: "flex items-center gap-3 text-[10px] text-slate-500 pt-2 border-t border-white/5", children: [_jsxs("span", { children: ["Metric: ", _jsx("span", { className: "text-slate-400 font-medium", children: alert.metric })] }), _jsx("span", { children: "\u2022" }), _jsxs("span", { children: ["Change: ", _jsxs("span", { className: alert.delta_percent > 0 ? "text-emerald-400" : "text-rose-400", children: [alert.delta_percent > 0 ? "+" : "", alert.delta_percent.toFixed(1), "%"] })] })] })] }, alert.id));
                })) })] }));
}
