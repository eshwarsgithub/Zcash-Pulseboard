import { useQuery } from "@tanstack/react-query";
import api from "../config/api";
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
export const useSummary = () => useQuery({
    queryKey: ["summary"],
    queryFn: async () => (await api.get("/metrics/summary")).data,
    staleTime: 5 * 60 * 1000
});
export const usePrivacyMetrics = () => useQuery({
    queryKey: ["privacy-metrics"],
    queryFn: async () => (await api.get("/metrics/privacy")).data,
    staleTime: 5 * 60 * 1000
});
export const useNetworkHealth = () => useQuery({
    queryKey: ["network-health"],
    queryFn: async () => (await api.get("/metrics/health")).data,
    staleTime: 5 * 60 * 1000
});
export const useMomentum = () => useQuery({
    queryKey: ["momentum"],
    queryFn: async () => (await api.get("/metrics/momentum")).data,
    staleTime: 5 * 60 * 1000
});
export { api };
