/**
 * OhMyGold — React Native Theme Object
 * Mirrors CSS custom properties for cross-platform consistency.
 * Usage: import { theme } from '@ohmygold/ui-shared';
 */

import { colors, dark } from "./tokens/colors";
import { spacingTokens } from "./tokens/spacing";
import { animations } from "./tokens/animations";
import { elevation } from "./tokens/shadows";

export const theme = {
  colors: {
    // Surfaces
    surface: dark.bgPrimary,
    surfaceSecondary: "#111111",
    surfaceElevated: dark.bgElevated,
    surfaceCard: dark.bgCard,

    // Text
    textPrimary: dark.textPrimary,
    textSecondary: dark.textSecondary,
    textMuted: dark.textMuted,
    textDisabled: "#404040",
    textInverse: dark.bgPrimary,

    // Brand
    gold: colors.brand.gold,
    goldDark: colors.brand.goldDark,
    black: colors.brand.black,
    white: colors.brand.white,
    charcoal: colors.brand.charcoal,

    // Borders
    border: "#2A2A2A",
    borderEmphasis: dark.border,
    borderFocus: colors.brand.gold,

    // Semantic
    success: colors.semantic.success,
    successDark: colors.semantic.successDark,
    warning: colors.semantic.warning,
    warningDark: colors.semantic.warningDark,
    error: colors.semantic.error,
    errorDark: colors.semantic.errorDark,
    info: colors.semantic.info,
    infoDark: colors.semantic.infoDark,

    // Role
    roleAdmin: colors.role.admin,
    roleCoach: colors.role.coach,
    roleReceptionist: colors.role.receptionist,
    roleMember: colors.role.member,
    roleVisitor: colors.role.visitor,
  },

  spacing: spacingTokens,

  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    "2xl": 20,
    "3xl": 24,
    full: 9999,
  },

  elevation,

  animation: {
    durationFast: animations.duration.fast,
    durationNormal: animations.duration.normal,
    durationMedium: animations.duration.medium,
    durationSlow: animations.duration.slow,
  },

  typography: {
    fontSans: "Inter",
    fontMono: "JetBrains Mono",
    sizes: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      "2xl": 24,
      "3xl": 30,
      "4xl": 36,
      "5xl": 48,
    },
    weights: {
      regular: "400" as const,
      medium: "500" as const,
      semibold: "600" as const,
      bold: "700" as const,
      extrabold: "800" as const,
      black: "900" as const,
    },
  },
} as const;

export type Theme = typeof theme;
