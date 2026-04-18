import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1A202C",
        muted: "#6B7280",
        line: "#E5E7EB",
        brand: "#1E40AF",
        accent: "#0EA5E9",
        surface: "#FAFBFC",
        success: "#10B981",
        warning: "#F59E0B"
      },
      boxShadow: {
        soft: "0 10px 30px rgba(15, 23, 42, 0.06)"
      }
    }
  },
  plugins: []
};

export default config;
