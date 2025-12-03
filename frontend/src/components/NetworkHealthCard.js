import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNetworkHealth } from "../hooks/useMetrics";
export function NetworkHealthCard() {
    const { data, isLoading } = useNetworkHealth();
    if (isLoading)
        return _jsx("div", { className: "rounded-xl bg-panel/60 p-6 animate-pulse h-96" });
    if (!data)
        return null;
    const scoreColor = data.overall_score >= 85 ? "#F3B724" :
        data.overall_score >= 70 ? "#f5a623" : "#ff5a5f";
    return (_jsxs("div", { className: "relative rounded-xl bg-gradient-to-br from-accent/10 to-background-panel/60 backdrop-blur-sm p-6 border border-accent/20 shadow-lg", children: [_jsxs("div", { className: "text-center mb-6", children: [_jsx("div", { className: "text-7xl font-bold mb-2", style: { color: scoreColor }, children: data.grade }), _jsxs("div", { className: "text-3xl font-semibold text-white mb-1", children: [data.overall_score, "/100"] }), _jsx("div", { className: "text-sm text-slate-400", children: "Network Health Score" })] }), _jsx("div", { className: "grid grid-cols-2 gap-3 mb-4", children: Object.entries(data.component_scores).map(([key, score]) => (_jsxs("div", { className: "bg-background-panel/40 rounded-lg p-3 border border-white/5", children: [_jsx("div", { className: "text-xs text-slate-400 uppercase tracking-wide mb-1", children: key }), _jsx("div", { className: "text-2xl font-bold text-white", children: score })] }, key))) }), data.issues.length > 0 && (_jsxs("div", { className: "mt-4 p-3 bg-warning/10 border border-warning/30 rounded-lg", children: [_jsx("div", { className: "text-xs font-semibold text-warning mb-1", children: "\u26A0\uFE0F Attention Needed:" }), _jsx("ul", { className: "text-xs text-warning/80 space-y-1", children: data.issues.map((issue, i) => _jsxs("li", { children: ["\u2022 ", issue] }, i)) })] }))] }));
}
