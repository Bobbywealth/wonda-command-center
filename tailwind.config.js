/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: { base: "#0B0B0F", panel: "#14141A", elev: "#1C1C24" },
        line: "#2A2A35",
        ink: { hi: "#F5F5F7", lo: "#9A9AA8" },
        gold: { DEFAULT: "#D4A544", soft: "#D4A54422" },
        violet: { DEFAULT: "#6C4BF5" },
        emerald: { DEFAULT: "#2FBF71" },
        amber: { DEFAULT: "#E8A33D" },
        rose: { DEFAULT: "#E5484D" }
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Sora", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};