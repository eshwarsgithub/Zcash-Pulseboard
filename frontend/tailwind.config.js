/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "#0a0612",
          panel: "#271219",
          panelLight: "#3D1F2B"
        },
        accent: {
          DEFAULT: "#F3B724",
          hover: "#FFD666",
          muted: "#C99410"
        },
        burgundy: {
          dark: "#1A0D11",
          DEFAULT: "#271219",
          light: "#3D1F2B"
        },
        success: "#F3B724",
        warning: "#f5a623",
        danger: "#ff5a5f",
        info: "#60a5fa",
        // Legacy support
        panel: "#271219"
      }
    }
  },
  plugins: []
};
