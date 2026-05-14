import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { supabase } from "../../src/lib/supabase";

const C = {
  bg: "#0A0A0F",
  card: "#1A1A2E",
  border: "#2A2A3E",
  primary: "#F5A623",
  text: "#FFFFFF",
  muted: "#9CA3AF",
  error: "#EF4444",
};

export default function ResetPasswordScreen() {
  const { access_token, refresh_token } = useLocalSearchParams<{
    access_token?: string;
    refresh_token?: string;
  }>();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // When tokens are provided explicitly in a deep link, only set a session
    // when both access + refresh tokens are present.
    if (!access_token && !refresh_token) {
      return;
    }

    if (!access_token || !refresh_token) {
      setError(
        "Invalid or expired reset link. Please request a new password reset email.",
      );
      return;
    }

    supabase.auth
      .setSession({ access_token, refresh_token })
      .then(({ error: sessionError }) => {
        if (sessionError) {
          setError(sessionError.message);
        }
      })
      .catch((sessionError: unknown) => {
        setError(
          sessionError instanceof Error
            ? sessionError.message
            : "Unable to verify the reset link. Please request a new one.",
        );
      });
  }, [access_token, refresh_token]);

  async function handleReset() {
    setError(null);
    if (!password) return setError("New password is required.");
    if (password.length < 8)
      return setError("Password must be at least 8 characters.");
    if (password !== confirm) return setError("Passwords do not match.");

    setLoading(true);
    const { error: updateErr } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (updateErr) {
      setError(updateErr.message);
      return;
    }

    Alert.alert(
      "Password updated",
      "Your password has been changed. Please log in.",
      [{ text: "OK", onPress: () => router.replace("/auth/login") }],
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.kav}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>
            Enter and confirm your new password below.
          </Text>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <View style={styles.field}>
            <Text style={styles.label}>New password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="Minimum 8 characters"
              placeholderTextColor={C.muted}
              autoCapitalize="none"
              returnKeyType="next"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Confirm password</Text>
            <TextInput
              style={styles.input}
              value={confirm}
              onChangeText={setConfirm}
              secureTextEntry
              placeholder="Repeat your new password"
              placeholderTextColor={C.muted}
              autoCapitalize="none"
              returnKeyType="done"
              onSubmitEditing={handleReset}
            />
          </View>

          <TouchableOpacity
            style={[styles.btn, loading && styles.btnDisabled]}
            onPress={handleReset}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.btnText}>Update Password</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.replace("/auth/login")}
            style={styles.backLink}
          >
            <Text style={styles.backLinkText}>Back to Login</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  kav: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 24, justifyContent: "center" },
  title: { fontSize: 28, fontWeight: "800", color: C.text, marginBottom: 8 },
  subtitle: { fontSize: 14, color: C.muted, marginBottom: 28, lineHeight: 20 },
  errorText: {
    color: C.error,
    fontSize: 13,
    marginBottom: 16,
    backgroundColor: C.error + "15",
    borderRadius: 8,
    padding: 12,
  },
  field: { marginBottom: 16 },
  label: { color: C.muted, fontSize: 13, fontWeight: "600", marginBottom: 6 },
  input: {
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: C.text,
    fontSize: 15,
  },
  btn: {
    backgroundColor: C.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
  },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: "#000", fontWeight: "700", fontSize: 16 },
  backLink: { alignItems: "center", marginTop: 20 },
  backLinkText: { color: C.muted, fontSize: 14 },
});
