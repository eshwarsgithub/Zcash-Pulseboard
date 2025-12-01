import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import clsx from "clsx";
const trendColor = {
    up: "text-emerald-400",
    down: "text-rose-400",
    flat: "text-slate-300"
};
const formatValue = (value, unit) => {
    if (unit === "%") {
        return `${value.toFixed(2)}%`;
    }
    if (unit === "ZEC") {
        return `${value.toFixed(5)} ZEC`;
    }
    if (value >= 1000) {
        return `${(value / 1000).toFixed(1)}k`;
    }
    return `${value}`;
};
const formatDelta = (delta, trend, unit) => {
    if (delta === undefined || delta === null || trend === null || trend === undefined) {
        return "";
    }
    const prefix = trend === "up" ? "+" : trend === "down" ? "−" : "";
    const absDelta = Math.abs(delta);
    const suffix = unit === "%" ? "pp" : "%";
    return `${prefix}${absDelta.toFixed(2)}${suffix}`;
};
export function MetricCard({ card }) {
    return (_jsxs("div", { className: "rounded-xl bg-panel p-4 shadow-sm shadow-black/40", children: [_jsx("div", { className: "text-sm uppercase tracking-wide text-slate-300", children: card.name }), _jsx("div", { className: "mt-2 text-3xl font-semibold text-white", children: formatValue(card.value, card.unit) }), _jsx("div", { className: "mt-1 text-sm text-slate-400", children: card.insight }), card.delta_percent !== undefined && card.delta_percent !== null && card.trend && (_jsx("div", { className: clsx("mt-2 text-sm", trendColor[card.trend]), children: formatDelta(card.delta_percent, card.trend, card.unit) }))] }));
}
