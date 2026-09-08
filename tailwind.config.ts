import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
          950: "#1e1b4b",
        },
        wine: {
          50: "#FDF6F8",
          100: "#FBEBF1",
          200: "#F7D6E2",
          300: "#F0B2C9",
          400: "#E382A8",
          500: "#CD5083",
          600: "#A72B5F",
          700: "#7A1443",
          800: "#5A0C32",
          900: "#420824",
          950: "#260414",
        },
        rosebrand: {
          50: "#FFF5F7",
          100: "#FFE9EE",
          200: "#FFD4DE",
          300: "#FFB0C2",
          400: "#FF7E9F",
          500: "#F44A75",
        },
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
