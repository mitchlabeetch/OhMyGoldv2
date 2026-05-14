import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useAuthStore } from "../../src/stores/authStore";
import { useTranslation } from "react-i18next";

const C = { primary: "#F5A623", bg: "#0A0A0F", card: "#1A1A2E", border: "#2A2A3E", text: "#FFFFFF", muted: "#9CA3AF" };

const QUICK_ACTIONS = [
  { label: "Book a Class", icon: "📅", route: "/booking" as const },
  { label: "My QR Card", icon: "🎫", route: "/card" as const },
  { label: "My Profile", icon: "👤", route: "/profile" as const },
];

export default function DashboardScreen() {
  const { t } = useTranslation("dashboard");
  const { profile } = useAuthStore();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.welcomeText}>
            {t("welcome", { name: profile?.first_name ?? "…" })}
          </Text>
          <Text style={styles.subtitle}>Gold's Gym France</Text>
        </View>

        <View style={styles.placeholder}>
          <Text style={styles.placeholderTitle}>Phase 4 — Core Gym Management</Text>
          <Text style={styles.placeholderText}>
            Les fonctionnalités de gestion seront implémentées en Phase 4.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0A0A0A" },
  content: { padding: 24 },
  header: { marginBottom: 32 },
  welcomeText: { fontSize: 24, fontWeight: "700", color: "#FFFFFF", marginBottom: 4 },
  subtitle: { fontSize: 14, color: "#A3A3A3" },
  placeholder: {
    backgroundColor: "#171717",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#2A2A2A",
    padding: 24,
    alignItems: "center",
  },
  placeholderTitle: { fontSize: 16, fontWeight: "600", color: "#FFFFFF", marginBottom: 8, textAlign: "center" },
  placeholderText: { fontSize: 13, color: "#737373", textAlign: "center", lineHeight: 20 },
});
