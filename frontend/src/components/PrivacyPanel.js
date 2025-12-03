import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { usePrivacyMetrics } from "../hooks/useMetrics";
export function PrivacyPanel() {
    const { data, isLoading } = usePrivacyMetrics();
    if (isLoading)
        return _jsx("div", { className: "rounded-xl bg-panel/60 p-6 animate-pulse h-80" });
    if (!data)
        return null;
    const scoreColor = data.latest_score >= 45 ? "#F3B724" :
        data.latest_score >= 35 ? "#f5a623" : "#ff5a5f";
    return (_jsxs("div", { className: "rounded-xl bg-gradient-to-br from-background-panel/80 to-background-panel/40 backdrop-blur-sm p-6 border border-accent/10 hover:border-accent/20 transition-all duration-300", children: [_jsxs("h3", { className: "text-lg font-bold text-white mb-4 flex items-center gap-2", children: [_jsx("span", { className: "text-accent", children: "\uD83D\uDEE1\uFE0F" }), "Privacy Metrics"] }), _jsxs("div", { className: "flex items-center justify-between mb-6 p-4 bg-accent/5 rounded-lg border border-accent/20", children: [_jsxs("div", { children: [_jsx("div", { className: "text-3xl font-bold", style: { color: scoreColor }, children: data.latest_score.toFixed(1) }), _jsx("div", { className: "text-xs text-slate-400 mt-1", children: "Privacy Score" })] }), _jsxs("div", { className: "text-right", children: [_jsx("div", { className: "text-xl font-semibold text-accent", children: data.privacy_grade }), _jsxs("div", { className: "text-xs text-slate-400 mt-1", children: ["7-day avg: ", data.avg_7d_score.toFixed(1)] })] })] }), _jsx(ResponsiveContainer, { width: "100%", height: 200, children: _jsxs(LineChart, { data: data.trends, margin: { top: 5, right: 20, left: 0, bottom: 5 }, children: [_jsx(XAxis, { dataKey: "date", stroke: "#6b7280", tick: { fill: '#9ca3af', fontSize: 11 }, tickFormatter: (value) => value.slice(5) }), _jsx(YAxis, { stroke: "#6b7280", tick: { fill: '#9ca3af', fontSize: 11 } }), _jsx(Tooltip, { contentStyle: {
                                backgroundColor: "#1A0D11",
                                borderColor: "#F3B724",
                                borderRadius: "8px",
                                border: "1px solid"
                            } }), _jsx(Legend, { wrapperStyle: { fontSize: '12px' } }), _jsx(Line, { type: "monotone", dataKey: "shielded_tx_pct", stroke: "#F3B724", strokeWidth: 2, name: "Shielded Tx %", dot: false }), _jsx(Line, { type: "monotone", dataKey: "shielded_volume_pct", stroke: "#FFD666", strokeWidth: 2, name: "Shielded Volume %", dot: false })] }) }), _jsx("div", { className: "mt-4 text-xs text-slate-400", children: "Privacy score = (Shielded Tx % \u00D7 0.6) + (Shielded Volume % \u00D7 0.4)" })] }));
}
