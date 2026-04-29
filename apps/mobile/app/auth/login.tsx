import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert, ScrollView } from "react-native";
import { Link, router } from "expo-router";
import { supabase } from "../../src/lib/supabase";

const C = { primary: "#F5A623", bg: "#0A0A0F", card: "#1A1A2E", border: "#2A2A3E", text: "#FFFFFF", muted: "#9CA3AF", error: "#EF4444" };

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignIn() {
    if (!email.trim() || !password) {
      Alert.alert("Missing fields", "Please enter your email and password.");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error) throw error;
      router.replace("/(tabs)");
    } catch (err: unknown) {
      Alert.alert("Sign in failed", err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <ScrollView contentContainerStyle={styles.inner} keyboardShouldPersistTaps="handled">
        {/* Logo */}
        <View style={styles.logoRow}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoIcon}>💪</Text>
          </View>
          <View>
            <Text style={styles.logoText}>OhMyGold</Text>
            <Text style={styles.logoSub}>Gold's Gym France</Text>
          </View>
        </View>

        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Sign in to your account</Text>

        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
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
          <View style={styles.field}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="password"
              placeholderTextColor={C.muted}
            />
          </View>

          <TouchableOpacity
            style={[styles.btn, loading && styles.btnDisabled]}
            onPress={handleSignIn}
            disabled={loading}
            activeOpacity={0.85}
          >
            <Text style={styles.btnText}>{loading ? "Signing in…" : "Sign In"}</Text>
          </TouchableOpacity>

          <Link href="/auth/forgot-password" asChild>
            <TouchableOpacity style={styles.linkRow}>
              <Text style={styles.linkText}>Forgot your password?</Text>
            </TouchableOpacity>
          </Link>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <Link href="/auth/register" asChild>
            <TouchableOpacity style={styles.outlineBtn} activeOpacity={0.85}>
              <Text style={styles.outlineBtnText}>Create an account</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  inner: { flexGrow: 1, justifyContent: "center", paddingHorizontal: 24, paddingVertical: 48 },
  logoRow: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 40 },
  logoCircle: { width: 52, height: 52, borderRadius: 26, backgroundColor: C.card, borderWidth: 1, borderColor: C.primary, alignItems: "center", justifyContent: "center" },
  logoIcon: { fontSize: 24 },
  logoText: { fontSize: 22, fontWeight: "800", color: C.primary },
  logoSub: { fontSize: 12, color: C.muted },
  title: { fontSize: 30, fontWeight: "800", color: C.text, marginBottom: 6 },
  subtitle: { fontSize: 15, color: C.muted, marginBottom: 32 },
  form: { gap: 16 },
  field: { gap: 6 },
  label: { fontSize: 13, color: C.muted, fontWeight: "500" },
  input: { backgroundColor: C.card, color: C.text, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 15, borderWidth: 1, borderColor: C.border },
  btn: { backgroundColor: C.primary, borderRadius: 12, paddingVertical: 16, alignItems: "center", marginTop: 8 },
  btnDisabled: { opacity: 0.55 },
  btnText: { color: "#000", fontWeight: "700", fontSize: 16 },
  linkRow: { alignItems: "center", paddingVertical: 4 },
  linkText: { color: C.primary, fontSize: 14 },
  divider: { flexDirection: "row", alignItems: "center", gap: 12, marginVertical: 4 },
  dividerLine: { flex: 1, height: 1, backgroundColor: C.border },
  dividerText: { color: C.muted, fontSize: 13 },
  outlineBtn: { borderWidth: 1, borderColor: C.border, borderRadius: 12, paddingVertical: 15, alignItems: "center" },
  outlineBtnText: { color: C.text, fontWeight: "600", fontSize: 15 },
});
