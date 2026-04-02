import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./stores/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#09090b",
        foreground: "#fafafa",
        card: "#18181b",
        border: "rgba(255,255,255,0.08)",
        muted: "#a1a1aa",
        claude: "#8b5cf6",
        codex: "#38bdf8"
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(255,255,255,0.08), 0 24px 80px rgba(15,23,42,0.35)"
      },
      backgroundImage: {
        "grid-fade":
          "radial-gradient(circle at top, rgba(139,92,246,0.18), transparent 40%), radial-gradient(circle at 80% 20%, rgba(56,189,248,0.18), transparent 30%)"
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" }
        }
      },
      animation: {
        shimmer: "shimmer 2s linear infinite"
      }
    }
  },
  plugins: []
};

export default config;
