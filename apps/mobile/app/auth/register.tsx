import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert, ScrollView } from "react-native";
import { Link, router } from "expo-router";
import { supabase } from "../../src/lib/supabase";

const C = { primary: "#F5A623", bg: "#0A0A0F", card: "#1A1A2E", border: "#2A2A3E", text: "#FFFFFF", muted: "#9CA3AF", error: "#EF4444" };

export default function RegisterScreen() {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "", confirm: "" });
  const [terms, setTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  function update(k: keyof typeof form) {
    return (v: string) => setForm((prev) => ({ ...prev, [k]: v }));
  }

  async function handleRegister() {
    if (!form.firstName || !form.lastName || !form.email || !form.password) {
      Alert.alert("Missing fields", "Please fill in all required fields."); return;
    }
    if (form.password !== form.confirm) {
      Alert.alert("Password mismatch", "Passwords do not match."); return;
    }
    if (form.password.length < 8) {
      Alert.alert("Weak password", "Password must be at least 8 characters."); return;
    }
    if (!terms) {
      Alert.alert("Terms required", "Please accept the terms of service."); return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: form.email.trim(),
        password: form.password,
        options: { data: { first_name: form.firstName, last_name: form.lastName, full_name: `${form.firstName} ${form.lastName}` } },
      });
      if (error) throw error;
      Alert.alert("Account created!", "Please check your email to confirm your account.", [{ text: "OK", onPress: () => router.replace("/auth/login") }]);
    } catch (err: unknown) {
      Alert.alert("Registration failed", err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  const fields: Array<{ key: keyof typeof form; label: string; placeholder: string; keyboard?: "email-address"; secure?: boolean; autoComplete?: "given-name" | "family-name" | "email" | "new-password" }> = [
    { key: "firstName", label: "First Name", placeholder: "Jean", autoComplete: "given-name" },
    { key: "lastName", label: "Last Name", placeholder: "Dupont", autoComplete: "family-name" },
    { key: "email", label: "Email", placeholder: "jean@example.com", keyboard: "email-address", autoComplete: "email" },
    { key: "password", label: "Password", placeholder: "Min. 8 characters", secure: true, autoComplete: "new-password" },
    { key: "confirm", label: "Confirm Password", placeholder: "Repeat password", secure: true, autoComplete: "new-password" },
  ];

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <ScrollView contentContainerStyle={styles.inner} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Create account</Text>
        <Text style={styles.subtitle}>Join Gold's Gym France today</Text>

        <View style={styles.form}>
          {fields.map((f) => (
            <View key={f.key} style={styles.field}>
              <Text style={styles.label}>{f.label}</Text>
              <TextInput
                style={styles.input}
                placeholder={f.placeholder}
                value={form[f.key]}
                onChangeText={update(f.key)}
                keyboardType={f.keyboard ?? "default"}
                autoCapitalize={f.keyboard === "email-address" ? "none" : "words"}
                secureTextEntry={f.secure}
                autoComplete={f.autoComplete}
                placeholderTextColor={C.muted}
              />
            </View>
          ))}

          <TouchableOpacity style={styles.checkRow} onPress={() => setTerms((v) => !v)} activeOpacity={0.7}>
            <View style={[styles.checkbox, terms && styles.checkboxChecked]}>
              {terms && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkLabel}>I accept the Terms of Service and Privacy Policy</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, loading && styles.btnDisabled]}
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.85}
          >
            <Text style={styles.btnText}>{loading ? "Creating account…" : "Create Account"}</Text>
          </TouchableOpacity>

          <Link href="/auth/login" asChild>
            <TouchableOpacity style={styles.linkRow}>
              <Text style={styles.linkText}>Already have an account? Sign in</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  inner: { flexGrow: 1, paddingHorizontal: 24, paddingVertical: 60 },
  title: { fontSize: 30, fontWeight: "800", color: C.text, marginBottom: 6 },
  subtitle: { fontSize: 15, color: C.muted, marginBottom: 32 },
  form: { gap: 16 },
  field: { gap: 6 },
  label: { fontSize: 13, color: C.muted, fontWeight: "500" },
  input: { backgroundColor: C.card, color: C.text, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 15, borderWidth: 1, borderColor: C.border },
  checkRow: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  checkbox: { width: 20, height: 20, borderRadius: 4, borderWidth: 1.5, borderColor: C.border, alignItems: "center", justifyContent: "center", marginTop: 2 },
  checkboxChecked: { backgroundColor: C.primary, borderColor: C.primary },
  checkmark: { color: "#000", fontSize: 12, fontWeight: "700" },
  checkLabel: { flex: 1, color: C.muted, fontSize: 13, lineHeight: 18 },
  btn: { backgroundColor: C.primary, borderRadius: 12, paddingVertical: 16, alignItems: "center", marginTop: 4 },
  btnDisabled: { opacity: 0.55 },
  btnText: { color: "#000", fontWeight: "700", fontSize: 16 },
  linkRow: { alignItems: "center", paddingVertical: 4 },
  linkText: { color: C.primary, fontSize: 14, textAlign: "center" },
});
