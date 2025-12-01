import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
const severityColor = {
    low: "bg-emerald-500/10 text-emerald-300",
    medium: "bg-warning/10 text-warning",
    high: "bg-danger/10 text-danger"
};
export function AlertsFeed({ alerts }) {
    return (_jsxs("div", { className: "h-full rounded-xl bg-panel p-4 shadow-sm shadow-black/40", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h3", { className: "text-lg font-semibold text-white", children: "Alerts" }), _jsxs("span", { className: "text-xs uppercase tracking-wide text-slate-400", children: [alerts.length, " active"] })] }), _jsx("ul", { className: "mt-4 space-y-3 overflow-y-auto pr-2", children: alerts.map((alert) => (_jsxs("li", { className: "rounded-lg border border-white/5 p-3", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: `rounded-full px-2 py-1 text-xs font-semibold ${severityColor[alert.severity]}`, children: alert.severity.toUpperCase() }), _jsx("span", { className: "text-xs text-slate-400", children: dayjs(alert.timestamp).fromNow() })] }), _jsx("p", { className: "mt-2 text-sm font-medium text-white", children: alert.summary }), _jsx("p", { className: "mt-1 text-xs text-slate-400", children: alert.explanation })] }, alert.id))) })] }));
}
