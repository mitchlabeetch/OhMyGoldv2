import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { GestureResponderEvent } from "react-native";
import type { ReactNode } from "react";
import type { ButtonVariant, ButtonSize } from "./Button.types";

export interface ButtonNativeProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  isDisabled?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  children: ReactNode;
  onPress?: (event: GestureResponderEvent) => void;
}

const variantStyles: Record<ButtonVariant, { container: object; text: object; indicatorColor: string }> = {
  primary: {
    container: { backgroundColor: "#FFEC00" },
    text: { color: "#0A0A0A" },
    indicatorColor: "#0A0A0A",
  },
  secondary: {
    container: { backgroundColor: "#171717", borderWidth: 1, borderColor: "#2A2A2A" },
    text: { color: "#FAFAFA" },
    indicatorColor: "#FAFAFA",
  },
  outline: {
    container: { backgroundColor: "transparent", borderWidth: 1, borderColor: "#FFEC00" },
    text: { color: "#FFEC00" },
    indicatorColor: "#FFEC00",
  },
  ghost: {
    container: { backgroundColor: "transparent" },
    text: { color: "#A3A3A3" },
    indicatorColor: "#A3A3A3",
  },
  danger: {
    container: { backgroundColor: "#EF4444" },
    text: { color: "#FAFAFA" },
    indicatorColor: "#FAFAFA",
  },
  success: {
    container: { backgroundColor: "#22C55E" },
    text: { color: "#FAFAFA" },
    indicatorColor: "#FAFAFA",
  },
  "gold-outline": {
    container: { backgroundColor: "transparent", borderWidth: 2, borderColor: "#FFEC00" },
    text: { color: "#FFEC00", fontWeight: "700" },
    indicatorColor: "#FFEC00",
  },
};

const sizeStyles: Record<ButtonSize, { container: object; text: object; iconSize: number }> = {
  sm: { container: { height: 32, paddingHorizontal: 12, borderRadius: 8, gap: 6 }, text: { fontSize: 13 }, iconSize: 14 },
  md: { container: { height: 40, paddingHorizontal: 16, borderRadius: 12, gap: 8 }, text: { fontSize: 13 }, iconSize: 16 },
  lg: { container: { height: 48, paddingHorizontal: 20, borderRadius: 12, gap: 8 }, text: { fontSize: 15 }, iconSize: 18 },
  xl: { container: { height: 56, paddingHorizontal: 24, borderRadius: 12, gap: 10 }, text: { fontSize: 15 }, iconSize: 20 },
};

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  isDisabled = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  children,
  onPress,
}: ButtonNativeProps) {
  const disabled = isDisabled || isLoading;
  const { container: variantContainer, text: variantText, indicatorColor } = variantStyles[variant];
  const { container: sizeContainer, text: sizeText, iconSize } = sizeStyles[size];

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.base,
        variantContainer,
        sizeContainer,
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
      ]}
      accessibilityRole="button"
      accessibilityState={{ disabled, busy: isLoading }}
    >
      {isLoading ? (
        <ActivityIndicator size={iconSize} color={indicatorColor} />
      ) : leftIcon ? (
        <View style={styles.icon}>{leftIcon}</View>
      ) : null}

      <Text style={[styles.text, variantText, sizeText]}>{children}</Text>

      {!isLoading && rightIcon ? <View style={styles.icon}>{rightIcon}</View> : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  fullWidth: {
    width: "100%",
  },
  disabled: {
    opacity: 0.4,
  },
  text: {
    fontWeight: "600",
  },
  icon: {
    alignItems: "center",
    justifyContent: "center",
  },
});
