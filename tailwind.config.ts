import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        "memoria-pink": {
          50: "#fff5f8",
          100: "#ffe6ee",
          200: "#ffccdd",
          300: "#ffa8c4",
          400: "#ff85ab",
        },
        "memoria-blue": {
          50: "#f2faff",
          100: "#e0f3ff",
          200: "#bfe6ff",
          300: "#94d3ff",
          400: "#6bbfff",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-noto-sans-jp)",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
export default config;
