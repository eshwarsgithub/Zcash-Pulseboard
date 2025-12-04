import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from "framer-motion";
export function AnimatedBackground() {
    return (_jsxs("div", { className: "fixed inset-0 -z-10 overflow-hidden", children: [_jsx(motion.div, { className: "absolute -top-40 -right-40 w-96 h-96 bg-accent/20 rounded-full blur-3xl", animate: {
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                }, transition: {
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                } }), _jsx(motion.div, { className: "absolute top-1/2 -left-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl", animate: {
                    scale: [1, 1.3, 1],
                    opacity: [0.2, 0.4, 0.2],
                }, transition: {
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                } }), _jsx(motion.div, { className: "absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl", animate: {
                    scale: [1, 1.4, 1],
                    opacity: [0.2, 0.35, 0.2],
                }, transition: {
                    duration: 12,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2,
                } }), _jsx("div", { className: "absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" }), [...Array(20)].map((_, i) => (_jsx(motion.div, { className: "absolute w-1 h-1 bg-accent/30 rounded-full", style: {
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                }, animate: {
                    y: [0, -30, 0],
                    x: [0, Math.random() * 20 - 10, 0],
                    opacity: [0, 1, 0],
                }, transition: {
                    duration: 3 + Math.random() * 4,
                    repeat: Infinity,
                    delay: Math.random() * 5,
                    ease: "easeInOut",
                } }, i)))] }));
}
