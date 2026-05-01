/**
 * OhMyGold Design Tokens — Colors
 * Based on Gold's Gym brand identity (see DESIGN.MD §2)
 */

export const brand = {
  gold: "#FFEC00",
  goldDark: "#D4C400",
  goldLight: "#FFF7A1",
  goldMuted: "#E5D85A",
  black: "#000000",
  white: "#FFFFFF",
  charcoal: "#231F20",
  iron: "#1A1A1A",
} as const;

export const semantic = {
  success: "#22C55E",
  successDark: "#15803D",
  successLight: "#DCFCE7",
  warning: "#F59E0B",
  warningDark: "#B45309",
  warningLight: "#FEF3C7",
  error: "#EF4444",
  errorDark: "#DC2626",
  errorLight: "#FEE2E2",
  info: "#3B82F6",
  infoDark: "#1D4ED8",
  infoLight: "#DBEAFE",
} as const;

export const neutral = {
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
} as const;

/** Role accent colors — aligned to DESIGN.MD §2.5 */
export const role = {
  superAdmin: "#9333EA", // legacy alias — kept for backward compat
  admin: "#EF4444",
  manager: "#3B82F6",   // new roadmap role (blue)
  coach: "#10B981",
  teacher: "#10B981",   // new roadmap alias for coach (green)
  receptionist: "#F59E0B",
  employee: "#F59E0B",  // new roadmap alias for receptionist (amber)
  member: "#FFEC00",
  client: "#FFEC00",    // new roadmap alias for member (brand gold)
  visitor: "#A855F7",
} as const;

/** Dark mode surface tokens */
export const dark = {
  bgPrimary: "#0A0A0A",
  bgElevated: "#171717",
  bgCard: "#231F20",
  bgOverlay: "#1A1A1A",
  textPrimary: "#FAFAFA",
  textSecondary: "#A3A3A3",
  textMuted: "#737373",
  border: "#404040",
  borderEmphasis: "#525252",
  inputBg: "#262626",
} as const;

export const colors = {
  brand,
  semantic,
  neutral,
  role,
  dark,
} as const;

export type Colors = typeof colors;
