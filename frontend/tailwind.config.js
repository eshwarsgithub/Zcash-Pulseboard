/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#05070f",
        panel: "#10131f",
        accent: "#24dbb5",
        warning: "#f5a623",
        danger: "#ff5a5f"
      }
    }
  },
  plugins: []
};
