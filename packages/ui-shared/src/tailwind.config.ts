/**
 * @ohmygold/ui-shared — Shared Tailwind CSS Configuration
 *
 * This is the single source of truth for all design tokens in Tailwind.
 * `apps/web/tailwind.config.ts` should extend this config.
 *
 * Token values are derived from `./tokens/` TypeScript files to ensure
 * a single change propagates to both platforms.
 */

import { brand, semantic, neutral, role, dark } from "./tokens/colors";
import { spacing, borderRadius } from "./tokens/spacing";
import { duration } from "./tokens/animations";

/**
 * Shared Tailwind theme extension.
 * Use via: `import { sharedTheme } from '@ohmygold/ui-shared/tailwind'`
 */
export const sharedTheme = {
  colors: {
    // ---- Brand gold palette (OhMyGold brand identity) ----
    gold: {
      50:  "#FFFFE0",
      100: "#FFFACC",
      200: "#FFF799",
      300: "#FFF566",
      400: brand.gold,    // #FFEC00 — PRIMARY brand gold
      500: brand.gold,    // #FFEC00 — same value for gradient compat
      600: brand.goldDark, // #D4C400 — hover
      700: "#ABA000",
      800: "#817800",
      900: "#575000",
      950: "#2C2800",
    },

    // ---- Neutral palette ----
    neutral: {
      50:  neutral[50],
      100: neutral[100],
      200: neutral[200],
      300: neutral[300],
      400: neutral[400],
      500: neutral[500],
      600: neutral[600],
      700: neutral[700],
      800: neutral[800],
      900: neutral[900],
    },

    // ---- Surfaces (dark mode first) ----
    surface: {
      DEFAULT:   dark.bgPrimary,
      secondary: "#111111",
      tertiary:  dark.bgElevated,
      elevated:  dark.bgElevated,
      card:      dark.bgCard,
      overlay:   dark.bgOverlay,
    },

    // ---- Semantic text colours ----
    text: {
      primary:   dark.textPrimary,
      secondary: dark.textSecondary,
      muted:     dark.textMuted,
      disabled:  "#404040",
      inverse:   dark.bgPrimary,
      accent:    brand.gold,
    },

    // ---- Semantic border colours ----
    border: {
      DEFAULT:  "#2A2A2A",
      muted:    "#1F1F1F",
      emphasis: "#404040",
      accent:   brand.gold,
      focus:    brand.gold,
    },

    // ---- Status colours ----
    status: {
      success:      semantic.success,
      "success-dark": semantic.successDark,
      "success-light": semantic.successLight,
      error:        semantic.error,
      "error-dark": semantic.errorDark,
      "error-light": semantic.errorLight,
      warning:      semantic.warning,
      "warning-dark": semantic.warningDark,
      "warning-light": semantic.warningLight,
      info:         semantic.info,
      "info-dark":  semantic.infoDark,
      "info-light": semantic.infoLight,
    },

    // ---- Role badge colours ----
    role: {
      "super-admin": role.superAdmin,
      admin:        role.admin,
      manager:      role.manager,
      coach:        role.coach,
      teacher:      role.teacher,
      receptionist: role.receptionist,
      employee:     role.employee,
      member:       role.member,
      client:       role.client,
      visitor:      role.visitor,
    },
  },

  spacing: {
    xs:  spacing.xs,
    sm:  spacing.sm,
    md:  spacing.md,
    lg:  spacing.lg,
    xl:  spacing.xl,
    "2xl": spacing["2xl"],
    "3xl": spacing["3xl"],
    "4xl": spacing["4xl"],
  },

  borderRadius: {
    sm:   `${borderRadius.sm}px`,
    md:   `${borderRadius.md}px`,
    lg:   `${borderRadius.lg}px`,
    xl:   `${borderRadius.xl}px`,
    "2xl": `${borderRadius["2xl"]}px`,
    full: `${borderRadius.full}px`,
    "4xl": "2rem",
  },

  boxShadow: {
    gold: `0 0 0 3px rgba(255, 236, 0, 0.4)`,
    glow: `0 0 20px rgba(255, 236, 0, 0.15)`,
    card: "0 2px 8px rgba(0,0,0,0.08)",
    elevated: "0 4px 16px rgba(0,0,0,0.12)",
    modal: "0 8px 32px rgba(0,0,0,0.16)",
  },

  transitionDuration: {
    fast:   `${duration.fast}ms`,
    normal: `${duration.normal}ms`,
    medium: `${duration.medium}ms`,
    slow:   `${duration.slow}ms`,
  },
} as const;

export type SharedTheme = typeof sharedTheme;
