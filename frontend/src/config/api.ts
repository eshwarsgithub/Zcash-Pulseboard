import axios from "axios";

// Get API base URL from environment variable
// In production, this should point to your deployed backend
// In development, it will use the Vite proxy to localhost:8001
const getApiBaseUrl = () => {
  // If VITE_API_URL is set, use it (production)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // In development, use relative path (Vite will proxy to backend)
  return "";
};

export const API_BASE_URL = getApiBaseUrl();

// Create axios instance with base configuration
export const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 second timeout
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 404) {
      console.error("API endpoint not found:", error.config?.url);
    } else if (error.code === "ECONNABORTED") {
      console.error("API request timeout");
    }
    return Promise.reject(error);
  }
);

export default api;
