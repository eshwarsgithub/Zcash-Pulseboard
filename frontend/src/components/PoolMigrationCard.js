import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";
export function PoolMigrationCard() {
    const { data, isLoading, error } = useQuery({
        queryKey: ["poolMigration"],
        queryFn: async () => {
            const response = await axios.get(`${API_BASE}/api/metrics/pool-migration`);
            return response.data;
        },
        refetchInterval: 60000,
    });
    if (isLoading) {
        return (_jsxs("div", { className: "h-full rounded-xl bg-gradient-to-br from-panel/80 to-panel/40 backdrop-blur-sm p-6 shadow-lg shadow-black/40 border border-white/5 animate-pulse", children: [_jsx("div", { className: "h-8 bg-white/10 rounded mb-4" }), _jsx("div", { className: "h-40 bg-white/5 rounded" })] }));
    }
    if (error || !data) {
        return (_jsx("div", { className: "h-full rounded-xl bg-gradient-to-br from-panel/80 to-panel/40 backdrop-blur-sm p-6 shadow-lg shadow-black/40 border border-rose-500/30", children: _jsx("p", { className: "text-rose-400 text-sm", children: "Failed to load pool migration data" }) }));
    }
    const { current_adoption, avg_7d_adoption, adoption_velocity, forecast_30d, trends } = data;
    // Determine velocity color and trend
    const velocityColor = adoption_velocity > 0.5
        ? "text-emerald-400"
        : adoption_velocity > 0
            ? "text-accent"
            : adoption_velocity > -0.5
                ? "text-amber-400"
                : "text-rose-400";
    const velocityBg = adoption_velocity > 0.5
        ? "bg-emerald-500/10 border-emerald-500/30"
        : adoption_velocity > 0
            ? "bg-accent/10 border-accent/30"
            : adoption_velocity > -0.5
                ? "bg-amber-500/10 border-amber-500/30"
                : "bg-rose-500/10 border-rose-500/30";
    const trendIcon = adoption_velocity > 0 ? "📈" : adoption_velocity < 0 ? "📉" : "➡️";
    return (_jsxs("div", { className: "group h-full rounded-xl bg-gradient-to-br from-panel/80 to-panel/40 backdrop-blur-sm p-6 shadow-lg shadow-black/40 border border-white/5 hover:border-white/10 transition-all duration-300", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsxs("h3", { className: "text-lg font-bold text-white flex items-center gap-2", children: [_jsx("span", { className: "text-xl", children: "\uD83D\uDD12" }), "Shielded Pool Adoption"] }), _jsx("span", { className: "text-2xl", children: trendIcon })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3 mb-4", children: [_jsxs("div", { className: "p-3 rounded-lg bg-white/5 border border-white/10", children: [_jsx("div", { className: "text-xs text-slate-400 mb-1", children: "Current" }), _jsxs("div", { className: "text-2xl font-bold text-white", children: [current_adoption.toFixed(1), "%"] })] }), _jsxs("div", { className: "p-3 rounded-lg bg-white/5 border border-white/10", children: [_jsx("div", { className: "text-xs text-slate-400 mb-1", children: "7-Day Avg" }), _jsxs("div", { className: "text-2xl font-bold text-white", children: [avg_7d_adoption.toFixed(1), "%"] })] })] }), _jsxs("div", { className: `p-3 rounded-lg border mb-4 ${velocityBg}`, children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-xs text-slate-300", children: "Adoption Velocity" }), _jsxs("span", { className: `text-sm font-bold ${velocityColor}`, children: [adoption_velocity > 0 ? "+" : "", adoption_velocity.toFixed(3), "% / day"] })] }), _jsxs("div", { className: "mt-2 text-xs text-slate-400", children: [adoption_velocity > 0.5 && "Strong growth in shielded usage", adoption_velocity > 0 && adoption_velocity <= 0.5 && "Steady adoption increase", adoption_velocity < 0 && adoption_velocity >= -0.5 && "Slight adoption decline", adoption_velocity < -0.5 && "Significant decline in shielded usage"] })] }), _jsx("div", { className: "mb-4", children: _jsx(ResponsiveContainer, { width: "100%", height: 120, children: _jsxs(AreaChart, { data: trends, margin: { top: 5, right: 5, left: 5, bottom: 5 }, children: [_jsx("defs", { children: _jsxs("linearGradient", { id: "adoptionGradient", x1: "0", y1: "0", x2: "0", y2: "1", children: [_jsx("stop", { offset: "5%", stopColor: "#F3B724", stopOpacity: 0.6 }), _jsx("stop", { offset: "95%", stopColor: "#F3B724", stopOpacity: 0 })] }) }), _jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#1f2937", strokeOpacity: 0.3 }), _jsx(XAxis, { dataKey: "date", stroke: "#6b7280", tick: { fill: '#6b7280', fontSize: 10 }, tickFormatter: (value) => value.slice(5) }), _jsx(YAxis, { stroke: "#6b7280", tick: { fill: '#6b7280', fontSize: 10 }, domain: [0, 100], tickFormatter: (value) => `${value}%` }), _jsx(Tooltip, { contentStyle: {
                                    backgroundColor: "#1A0D11",
                                    borderColor: "#F3B724",
                                    borderRadius: "6px",
                                    fontSize: "11px"
                                }, labelStyle: { color: "#fff", fontSize: "11px" }, formatter: (value) => [`${value.toFixed(2)}%`, "Adoption"] }), _jsx(Area, { type: "monotone", dataKey: "shielded_adoption_pct", stroke: "#F3B724", strokeWidth: 2, fill: "url(#adoptionGradient)" })] }) }) }), _jsxs("div", { className: "pt-3 border-t border-white/5", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-xs text-slate-400", children: "30-Day Forecast" }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("span", { className: "text-lg font-bold text-accent", children: [forecast_30d.toFixed(1), "%"] }), _jsxs("span", { className: `text-xs ${velocityColor}`, children: ["(", (forecast_30d - current_adoption >= 0 ? "+" : ""), (forecast_30d - current_adoption).toFixed(1), "%)"] })] })] }), _jsx("div", { className: "mt-2 h-2 bg-white/10 rounded-full overflow-hidden", children: _jsx("div", { className: "h-full bg-gradient-to-r from-accent to-emerald-400 transition-all duration-1000", style: { width: `${Math.min(100, forecast_30d)}%` } }) })] })] }));
}
