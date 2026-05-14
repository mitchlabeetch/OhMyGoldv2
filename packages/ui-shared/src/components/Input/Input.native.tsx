import { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import type { ReactNode } from "react";

export type InputNativeType =
  | "text"
  | "password"
  | "email"
  | "number"
  | "search"
  | "tel"
  | "date"
  | "url"
  | "barcode";

export interface InputNativeProps {
  type?: InputNativeType;
  label?: string;
  helperText?: string;
  errorMessage?: string;
  successMessage?: string;
  leftIcon?: ReactNode;
  isLoading?: boolean;
  showPasswordToggle?: boolean;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  isDisabled?: boolean;
  required?: boolean;
}

const keyboardTypeMap: Record<InputNativeType, "default" | "email-address" | "numeric" | "phone-pad" | "url"> = {
  text: "default",
  password: "default",
  email: "email-address",
  number: "numeric",
  search: "default",
  tel: "phone-pad",
  date: "default",
  url: "url",
  barcode: "default",
};

export function Input({
  type = "text",
  label,
  helperText,
  errorMessage,
  successMessage,
  leftIcon,
  isLoading = false,
  showPasswordToggle = true,
  placeholder,
  value,
  onChangeText,
  isDisabled = false,
  required = false,
}: InputNativeProps) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const isBarcode = type === "barcode";
  const hasError = Boolean(errorMessage);
  const hasSuccess = Boolean(successMessage) && !hasError;

  const borderColor = hasError ? "#EF4444" : hasSuccess ? "#22C55E" : "#2A2A2A";
  const focusBorderColor = hasError ? "#EF4444" : "#FFEC00";

  const messageColor = hasError ? "#EF4444" : hasSuccess ? "#22C55E" : "#737373";
  const message = errorMessage ?? successMessage ?? helperText;

  if (isBarcode) {
    return (
      <View style={styles.container}>
        {label && (
          <Text style={styles.label}>
            {label}
            {required && <Text style={styles.required}> *</Text>}
          </Text>
        )}
        <View style={[styles.barcodeBox, { borderColor }]}>
          <Text style={styles.barcodeIcon}>📷</Text>
          <Text style={styles.barcodeText}>Barcode Scanner</Text>
          <Text style={styles.barcodeHint}>requires expo-barcode-scanner</Text>
        </View>
        {message && <Text style={[styles.message, { color: messageColor }]}>{message}</Text>}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}

      <View style={[styles.inputWrapper, { borderColor }]}>
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

        <TextInput
          style={[
            styles.input,
            leftIcon ? styles.inputWithLeft : null,
            (isLoading || isPassword) ? styles.inputWithRight : null,
          ]}
          placeholder={placeholder}
          placeholderTextColor="#737373"
          value={value}
          onChangeText={onChangeText}
          editable={!isDisabled && !isLoading}
          secureTextEntry={isPassword && !showPassword}
          keyboardType={keyboardTypeMap[type]}
          autoCapitalize={type === "email" ? "none" : "sentences"}
          autoCorrect={type !== "email" && type !== "url"}
          accessibilityLabel={label}
          accessibilityState={{ disabled: isDisabled || isLoading }}
        />

        <View style={styles.rightArea}>
          {isLoading && <ActivityIndicator size={16} color="#737373" />}
          {!isLoading && hasError && <Text style={styles.statusIcon}>✕</Text>}
          {!isLoading && hasSuccess && <Text style={[styles.statusIcon, { color: "#22C55E" }]}>✓</Text>}
          {!isLoading && isPassword && showPasswordToggle && (
            <TouchableOpacity
              onPress={() => setShowPassword((s) => !s)}
              accessibilityLabel={showPassword ? "Hide password" : "Show password"}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.eyeIcon}>{showPassword ? "🙈" : "👁"}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {message && (
        <Text style={[styles.message, { color: messageColor }]} accessibilityRole={hasError ? "alert" : undefined}>
          {message}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FAFAFA",
  },
  required: {
    color: "#EF4444",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: "#FAFAFA",
    padding: 0,
  },
  inputWithLeft: {
    marginLeft: 8,
  },
  inputWithRight: {
    marginRight: 8,
  },
  leftIcon: {
    marginRight: 2,
  },
  rightArea: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statusIcon: {
    fontSize: 14,
    color: "#EF4444",
    fontWeight: "700",
  },
  eyeIcon: {
    fontSize: 16,
  },
  message: {
    fontSize: 12,
  },
  barcodeBox: {
    backgroundColor: "#1A1A1A",
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 32,
    alignItems: "center",
    gap: 8,
  },
  barcodeIcon: {
    fontSize: 32,
  },
  barcodeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FAFAFA",
  },
  barcodeHint: {
    fontSize: 12,
    color: "#737373",
  },
});
