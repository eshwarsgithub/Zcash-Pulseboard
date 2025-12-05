import { jsx as _jsx } from "react/jsx-runtime";
import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import "./styles/index.css";
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 2, // Retry failed requests twice
            retryDelay: 1000, // Wait 1 second between retries
            staleTime: 5 * 60 * 1000, // Consider data stale after 5 minutes
            refetchOnWindowFocus: false, // Don't refetch on window focus
        },
    },
});
ReactDOM.createRoot(document.getElementById("root")).render(_jsx(React.StrictMode, { children: _jsx(QueryClientProvider, { client: queryClient, children: _jsx(App, {}) }) }));
