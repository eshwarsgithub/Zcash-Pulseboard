import { useQuery } from "@tanstack/react-query";
import axios from "axios";
const api = axios.create({ baseURL: "/api" });
export const useDailyMetrics = () => useQuery({
    queryKey: ["daily-metrics"],
    queryFn: async () => (await api.get("/metrics/daily")).data,
    staleTime: 5 * 60 * 1000
});
export const useKpis = () => useQuery({
    queryKey: ["kpis"],
    queryFn: async () => (await api.get("/metrics/kpis")).data,
    staleTime: 5 * 60 * 1000
});
export const useAlerts = () => useQuery({
    queryKey: ["alerts"],
    queryFn: async () => (await api.get("/alerts")).data,
    refetchInterval: 60 * 1000
});
