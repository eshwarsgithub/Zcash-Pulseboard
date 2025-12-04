import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export function DataFreshnessIndicator() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["metadata"],
    queryFn: async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/metrics/metadata`);
        return response.data;
      } catch (err) {
        // Re-throw with descriptive error message
        const errorMessage = err.response?.data?.detail || err.message || "Failed to fetch metadata";
        const statusCode = err.response?.status || "Network Error";
        console.error(`[DataFreshnessIndicator] API error (${statusCode}):`, errorMessage);
        throw new Error(`${statusCode}: ${errorMessage}`);
      }
    },
    refetchInterval: 30000, // Refresh every 30 seconds
    retry: 3, // Retry failed requests 3 times
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    onError: (error) => {
      console.error("[DataFreshnessIndicator] Query failed:", error.message);
      // Could trigger a toast notification here if needed
    },
  });

  if (isLoading || !data) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
        <div className="w-2 h-2 rounded-full bg-slate-500 animate-pulse"></div>
        <span className="text-xs text-slate-400">Loading...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-rose-500/30">
        <div className="w-2 h-2 rounded-full bg-rose-500"></div>
        <span className="text-xs text-rose-300" title={error?.message || "Failed to load metadata"}>
          Error loading data
        </span>
      </div>
    );
  }

  const { last_updated, data_source, next_refresh } = data;
  const updatedTime = dayjs(last_updated);
  const minutesAgo = dayjs().diff(updatedTime, "minute");

  // Color coding based on freshness
  let statusColor = "bg-emerald-500";
  let textColor = "text-emerald-300";
  let borderColor = "border-emerald-500/30";

  if (data_source === "sample") {
    statusColor = "bg-slate-500";
    textColor = "text-slate-400";
    borderColor = "border-slate-500/30";
  } else if (minutesAgo > 30) {
    statusColor = "bg-rose-500";
    textColor = "text-rose-300";
    borderColor = "border-rose-500/30";
  } else if (minutesAgo > 10) {
    statusColor = "bg-amber-500";
    textColor = "text-amber-300";
    borderColor = "border-amber-500/30";
  }

  const isRefreshing = next_refresh && dayjs().isAfter(dayjs(next_refresh));

  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border ${borderColor} transition-all duration-300 hover:bg-white/10`}
    >
      {/* Status indicator */}
      <div className="relative">
        <div className={`w-2 h-2 rounded-full ${statusColor}`}></div>
        {isRefreshing && (
          <div
            className={`absolute inset-0 w-2 h-2 rounded-full ${statusColor} animate-ping`}
          ></div>
        )}
      </div>

      {/* Text */}
      <div className="flex items-center gap-2">
        <span className={`text-xs font-medium ${textColor}`}>
          {data_source === "live" ? (
            <>
              <span className="hidden sm:inline">Updated </span>
              {updatedTime.fromNow()}
            </>
          ) : (
            <>Sample Data</>
          )}
        </span>

        {data_source === "live" && next_refresh && (
          <span className="text-[10px] text-slate-500 hidden md:inline">
            • Next: {dayjs(next_refresh).fromNow()}
          </span>
        )}
      </div>
    </div>
  );
}
