import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface DailyMetric {
  date: string;
  total_transactions: number;
  shielded_transactions: number;
  transparent_transactions: number;
  shielded_volume_zec: number;
  transparent_volume_zec: number;
  avg_fee_zec: number;
  median_fee_zec: number;
  avg_block_time_seconds: number;
  active_addresses: number;
  shielded_tx_ratio: number;
  shielded_volume_ratio: number;
}

export interface MetricsResponse {
  data: DailyMetric[];
}

export interface KPICard {
  name: string;
  value: number;
  unit: string;
  delta_percent?: number;
  trend?: "up" | "down" | "flat" | null;
  insight?: string | null;
  status: "good" | "warning" | "critical";
}

export interface AlertsResponse {
  alerts: Alert[];
}

export interface Alert {
  id: string;
  timestamp: string;
  type: string;
  severity: "low" | "medium" | "high";
  metric: string;
  current_value: number;
  baseline_value: number;
  delta_percent: number;
  summary: string;
  explanation: string;
}

export interface MetricsSummary {
  latest_date: string;
  total_transactions_7d_avg: number;
  shielded_tx_ratio_7d_avg: number;
  avg_fee_7d_avg: number;
  active_addresses_7d_avg: number;
  health: Record<"throughput" | "privacy" | "cost" | "participation", "good" | "warning" | "critical">;
}

const api = axios.create({ baseURL: "/api" });

export const useDailyMetrics = () =>
  useQuery<MetricsResponse>({
    queryKey: ["daily-metrics"],
    queryFn: async () => (await api.get<MetricsResponse>("/metrics/daily")).data,
    staleTime: 5 * 60 * 1000
  });

export const useKpis = () =>
  useQuery<{ cards: KPICard[] }>({
    queryKey: ["kpis"],
    queryFn: async () => (await api.get<{ cards: KPICard[] }>("/metrics/kpis")).data,
    staleTime: 5 * 60 * 1000
  });

export const useAlerts = () =>
  useQuery<AlertsResponse>({
    queryKey: ["alerts"],
    queryFn: async () => (await api.get<AlertsResponse>("/alerts")).data,
    refetchInterval: 60 * 1000
  });

export const useSummary = () =>
  useQuery<MetricsSummary>({
    queryKey: ["summary"],
    queryFn: async () => (await api.get<MetricsSummary>("/metrics/summary")).data,
    staleTime: 5 * 60 * 1000
  });
