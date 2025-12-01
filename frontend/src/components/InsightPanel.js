import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function InsightPanel({ cards }) {
    return (_jsxs("div", { className: "rounded-xl bg-panel p-4 shadow-sm shadow-black/40", children: [_jsx("h3", { className: "text-lg font-semibold text-white", children: "Today\u2019s Insights" }), _jsx("ul", { className: "mt-3 space-y-2 text-sm text-slate-300", children: cards.map((card) => (_jsxs("li", { children: [_jsxs("span", { className: "font-medium text-white", children: [card.name, ":"] }), " ", card.insight] }, card.name))) })] }));
}
