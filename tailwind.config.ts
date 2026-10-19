import type { Config } from "tailwindcss";

// Brand colours live here (and mirror src/config/site.ts). Change a value once
// and the whole site updates.
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#F59E0B", // primary orange
          dark: "#EA580C", // dark orange
          soft: "#FFF3E0", // soft orange
        },
        surface: "#F8FAFC", // light grey
        line: "#E5E7EB", // border
        ink: { DEFAULT: "#292929", muted: "#737373" },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      keyframes: {
        floatA: {
          "0%, 100%": { transform: "translateY(0) rotate(-5deg)" },
          "50%": { transform: "translateY(-14px) rotate(3deg)" },
        },
        scrollY: { "0%": { transform: "translateY(0)" }, "100%": { transform: "translateY(-50%)" } },
        draw: { "0%": { strokeDashoffset: "100" }, "60%, 100%": { strokeDashoffset: "0" } },
        foldRight: {
          "0%, 25%": { transform: "rotateY(0deg)", animationTimingFunction: "ease-in-out" },
          "42%, 62%": { transform: "rotateY(170deg)", animationTimingFunction: "ease-in-out" },
          "80%, 100%": { transform: "rotateY(0deg)" },
        },
        foldLeft: {
          "0%, 25%": { transform: "translateX(0)", animationTimingFunction: "ease-in-out" },
          "42%, 62%": { transform: "translateX(34.8%)", animationTimingFunction: "ease-in-out" },
          "80%, 100%": { transform: "translateX(0)" },
        },
        bob: {
          "0%, 100%": { transform: "translateY(10px)", opacity: "1" },
          "50%": { transform: "translateY(-22px)", opacity: "0.35" },
        },
        jump: {
          "0%, 100%": { transform: "translateY(0)", animationTimingFunction: "cubic-bezier(0.33, 1, 0.68, 1)" },
          "35%": { transform: "translateY(-28px)", animationTimingFunction: "cubic-bezier(0.32, 0, 0.67, 0)" },
          "70%": { transform: "translateY(0)" },
        },
        floatB: {
          "0%, 100%": { transform: "translateY(0) rotate(6deg)" },
          "50%": { transform: "translateY(-18px) rotate(-3deg)" },
        },
      },
      animation: {
        "float-a": "floatA 9s ease-in-out infinite",
        "fold-right": "foldRight 9s infinite",
        "fold-left": "foldLeft 9s infinite",
        bob: "bob 8s ease-in-out infinite",
        jump: "jump 4s infinite",
        "float-b": "floatB 11s ease-in-out infinite",
        "scroll-y": "scrollY 16s linear infinite",
        draw: "draw 5s ease-in-out infinite",
      },
      boxShadow: {
        card: "0 1px 2px rgba(41,41,41,0.05), 0 4px 12px rgba(41,41,41,0.05)",
        lift: "0 8px 24px rgba(234,88,12,0.15)",
      },
    },
  },
  plugins: [],
};

export default config;
