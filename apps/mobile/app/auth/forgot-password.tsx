import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { Link } from "expo-router";
import { supabase } from "../../src/lib/supabase";

const C = { primary: "#F5A623", bg: "#0A0A0F", card: "#1A1A2E", border: "#2A2A3E", text: "#FFFFFF", muted: "#9CA3AF", success: "#10B981" };

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleReset() {
    if (!email.trim()) { Alert.alert("Required", "Please enter your email address."); return; }
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: "ohmygold://auth/reset-password",
      });
      if (error) throw error;
      setSent(true);
    } catch (err: unknown) {
      Alert.alert("Error", err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.successIcon}>✉️</Text>
        <Text style={styles.title}>Check your inbox</Text>
        <Text style={styles.successText}>
          We sent a password reset link to{"\n"}
          <Text style={{ color: C.primary }}>{email}</Text>
        </Text>
        <Link href="/auth/login" asChild>
          <TouchableOpacity style={styles.btn}>
            <Text style={styles.btnText}>Back to Sign In</Text>
          </TouchableOpacity>
        </Link>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.title}>Forgot password?</Text>
        <Text style={styles.subtitle}>
          Enter the email associated with your account and we'll send you a reset link.
        </Text>

        <View style={styles.field}>
          <Text style={styles.label}>Email address</Text>
          <TextInput
            style={styles.input}
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            placeholderTextColor={C.muted}
          />
        </View>

        <TouchableOpacity
          style={[styles.btn, loading && styles.btnDisabled]}
          onPress={handleReset}
          disabled={loading}
          activeOpacity={0.85}
        >
          <Text style={styles.btnText}>{loading ? "Sending…" : "Send Reset Link"}</Text>
        </TouchableOpacity>

        <Link href="/auth/login" asChild>
          <TouchableOpacity style={styles.linkRow}>
            <Text style={styles.linkText}>← Back to Sign In</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  center: { alignItems: "center", justifyContent: "center", paddingHorizontal: 24 },
  inner: { flex: 1, justifyContent: "center", paddingHorizontal: 24, gap: 20 },
  successIcon: { fontSize: 56, marginBottom: 16 },
  title: { fontSize: 28, fontWeight: "800", color: C.text },
  subtitle: { fontSize: 15, color: C.muted, lineHeight: 22 },
  successText: { fontSize: 15, color: C.muted, textAlign: "center", lineHeight: 22 },
  field: { gap: 6 },
  label: { fontSize: 13, color: C.muted, fontWeight: "500" },
  input: { backgroundColor: C.card, color: C.text, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 15, borderWidth: 1, borderColor: C.border },
  btn: { backgroundColor: C.primary, borderRadius: 12, paddingVertical: 16, alignItems: "center" },
  btnDisabled: { opacity: 0.55 },
  btnText: { color: "#000", fontWeight: "700", fontSize: 16 },
  linkRow: { alignItems: "center", paddingVertical: 4 },
  linkText: { color: C.primary, fontSize: 14 },
});
