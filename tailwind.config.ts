import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "memoria-pink": {
          50: "#fff5f8",
          100: "#ffe6ee",
          200: "#ffccdd",
          300: "#ffa8c4",
          400: "#ff85ab",
          500: "#f0679a",
        },
        "memoria-blue": {
          50: "#f2faff",
          100: "#e0f3ff",
          200: "#bfe6ff",
          300: "#94d3ff",
          400: "#6bbfff",
          500: "#4aa8f0",
        },
      },
      fontFamily: {
        sans: ["'Noto Sans JP'", "ui-sans-serif", "system-ui", "-apple-system", "sans-serif"],
        display: ["'Zen Maru Gothic'", "'Noto Sans JP'", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 10px 40px -12px rgba(255, 133, 171, 0.25), 0 4px 16px -8px rgba(107, 191, 255, 0.2)",
        card: "0 1px 2px rgba(15, 23, 42, 0.04), 0 12px 32px -16px rgba(15, 23, 42, 0.12)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pop: {
          "0%": { opacity: "0", transform: "translateY(6px) scale(0.98)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        blink: {
          "0%, 80%, 100%": { opacity: "0.3" },
          "40%": { opacity: "1" },
        },
      },
      animation: {
        float: "float 7s ease-in-out infinite",
        "float-slow": "float 11s ease-in-out infinite",
        pop: "pop 0.35s ease-out both",
        blink: "blink 1.2s infinite",
      },
    },
  },
  plugins: [],
};
export default config;
