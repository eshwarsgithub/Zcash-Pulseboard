import { useState } from "react";
import toast from "react-hot-toast";
import { API_BASE_URL } from "../config/api";

interface ExportButtonProps {
  type: "metrics" | "alerts";
  label?: string;
}

export function ExportButton({ type, label }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleExport = async (format: "csv" | "json") => {
    setIsExporting(true);
    setShowMenu(false);

    const loadingToast = toast.loading(`Exporting ${type} as ${format.toUpperCase()}...`);

    try {
      const url = `${API_BASE_URL}/api/export/${type}/${format}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Export failed: ${response.statusText}`);
      }

      if (format === "csv") {
        // Download CSV file
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = `zcash_${type}_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
      } else {
        // Download JSON file
        const data = await response.json();
        const blob = new Blob([JSON.stringify(data, null, 2)], {
          type: "application/json",
        });
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = `zcash_${type}_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
      }

      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} exported successfully!`, {
        id: loadingToast,
        duration: 3000,
      });
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Export failed. Please try again.", {
        id: loadingToast,
        duration: 4000,
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        disabled={isExporting}
        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
          isExporting
            ? "bg-white/5 text-slate-500 cursor-not-allowed"
            : "bg-gradient-to-r from-accent to-accent-hover text-white hover:shadow-lg hover:shadow-accent/30 hover:scale-105"
        }`}
      >
        {isExporting ? (
          <>
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>Exporting...</span>
          </>
        ) : (
          <>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            <span>{label || `Export ${type}`}</span>
            <svg
              className={`w-4 h-4 transition-transform ${showMenu ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </>
        )}
      </button>

      {/* Dropdown Menu */}
      {showMenu && !isExporting && (
        <div className="absolute right-0 mt-2 w-48 rounded-lg bg-panel/95 backdrop-blur-sm border border-white/10 shadow-lg shadow-black/50 z-50">
          <div className="p-2">
            <button
              onClick={() => handleExport("csv")}
              className="w-full text-left px-3 py-2 rounded-md text-sm text-white hover:bg-white/10 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Download CSV
            </button>
            <button
              onClick={() => handleExport("json")}
              className="w-full text-left px-3 py-2 rounded-md text-sm text-white hover:bg-white/10 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                />
              </svg>
              Download JSON
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
