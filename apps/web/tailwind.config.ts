import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../../packages/ui-shared/src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        gold: {
          // Brand gold palette — Gold's Gym France brand identity (#FFEC00)
          50: "#FFFFE0",
          100: "#FFFACC",
          200: "#FFF799",
          300: "#FFF566",
          400: "#FFEC00", // PRIMARY brand gold
          500: "#FFEC00", // PRIMARY brand gold (same as 400 for Tailwind compat)
          600: "#D4C400", // goldDark — hover state
          700: "#ABA000",
          800: "#817800",
          900: "#575000",
          950: "#2C2800",
        },
        surface: {
          DEFAULT: "#0A0A0A",
          secondary: "#111111",
          tertiary: "#171717",
          elevated: "#171717",
          card: "#1A1A1A",
          overlay: "#231F20",
        },
        text: {
          primary: "#FAFAFA",
          secondary: "#A3A3A3",
          muted: "#737373",
          disabled: "#404040",
          inverse: "#0A0A0A",
          accent: "#FFEC00",
        },
        border: {
          DEFAULT: "#2A2A2A",
          muted: "#1F1F1F",
          emphasis: "#404040",
          accent: "#FFEC00",
          focus: "#FFEC00",
        },
        status: {
          success: "#22C55E",
          "success-dark": "#15803D",
          error: "#EF4444",
          "error-dark": "#DC2626",
          warning: "#F59E0B",
          "warning-dark": "#B45309",
          info: "#3B82F6",
          "info-dark": "#1D4ED8",
        },
        neutral: {
          50: "#FAFAFA",
          100: "#F5F5F5",
          200: "#E5E5E5",
          300: "#D4D4D4",
          400: "#A3A3A3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#171717",
        },
      },
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
        mono: ["'JetBrains Mono'", ...defaultTheme.fontFamily.mono],
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      boxShadow: {
        gold: "0 0 0 3px rgba(255, 236, 0, 0.4)",
        glow: "0 0 20px rgba(255, 236, 0, 0.15)",
      },
      animation: {
        shimmer: "shimmer 2s linear infinite",
        "fade-in": "fadeIn 0.2s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};
