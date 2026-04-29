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
          50: "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#FCD34D",
          400: "#FBBF24",
          500: "#F59E0B",
          600: "#D97706",
          700: "#B45309",
          800: "#92400E",
          900: "#78350F",
          950: "#451A03",
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
        gold: "0 0 0 3px rgba(245, 158, 11, 0.4)",
        glow: "0 0 20px rgba(245, 158, 11, 0.15)",
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
