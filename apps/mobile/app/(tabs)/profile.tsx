import { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useAuthStore } from "../../src/stores/authStore";

const C = { primary: "#F5A623", bg: "#0A0A0F", card: "#1A1A2E", border: "#2A2A3E", text: "#FFFFFF", muted: "#9CA3AF", error: "#EF4444" };

function Row({ icon, label, onPress, danger, value, onValueChange }: { icon: string; label: string; onPress?: () => void; danger?: boolean; value?: boolean; onValueChange?: (v: boolean) => void }) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} disabled={!onPress && onValueChange == null} activeOpacity={0.7}>
      <Text style={styles.rowIcon}>{icon}</Text>
      <Text style={[styles.rowLabel, danger && styles.dangerText]}>{label}</Text>
      {onValueChange != null ? <Switch value={value} onValueChange={onValueChange} trackColor={{ false: C.border, true: C.primary }} thumbColor="#fff" /> : <Text style={styles.chevron}>›</Text>}
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const { session, profile, signOut } = useAuthStore();
  const [notifs, setNotifs] = useState(true);
  const [marketing, setMarketing] = useState(false);

  const name = (profile as { full_name?: string } | null)?.full_name ?? session?.user?.email?.split("@")[0] ?? "Member";
  const email = session?.user?.email ?? "";
  const initials = name.slice(0, 2).toUpperCase();

  async function handleSignOut() {
    Alert.alert("Sign out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign out", style: "destructive", onPress: async () => {
          await signOut();
          router.replace("/auth/login");
        },
      },
    ]);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Profile</Text>

        {/* User card */}
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{name}</Text>
            <Text style={styles.userEmail}>{email}</Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleBadgeText}>💎 Gold Member</Text>
            </View>
          </View>
        </View>

        {/* Account */}
        <Text style={styles.sectionLabel}>Account</Text>
        <View style={styles.section}>
          <Row icon="✏️" label="Edit Profile" onPress={() => Alert.alert("Coming soon", "Profile editing will be available in the next update.")} />
          <Row icon="🔒" label="Change Password" onPress={() => Alert.alert("Coming soon", "Use the web app to change your password.")} />
          <Row icon="🎟️" label="My Subscription" onPress={() => Alert.alert("Subscription", "Manage your subscription in the web app.")} />
        </View>

        {/* Notifications */}
        <Text style={styles.sectionLabel}>Notifications</Text>
        <View style={styles.section}>
          <Row icon="🔔" label="Push Notifications" value={notifs} onValueChange={setNotifs} />
          <Row icon="📧" label="Marketing Emails" value={marketing} onValueChange={setMarketing} />
        </View>

        {/* Language */}
        <Text style={styles.sectionLabel}>Preferences</Text>
        <View style={styles.section}>
          <Row icon="🌍" label="Language: Français" onPress={() => Alert.alert("Language", "EN / FR switching coming soon.")} />
          <Row icon="🌙" label="Dark Mode" onPress={() => {}} />
        </View>

        {/* Support */}
        <Text style={styles.sectionLabel}>Support</Text>
        <View style={styles.section}>
          <Row icon="❓" label="Help & FAQ" onPress={() => Alert.alert("Help", "Contact support@ohmygold.fr")} />
          <Row icon="📄" label="Terms of Service" onPress={() => {}} />
          <Row icon="🛡️" label="Privacy Policy" onPress={() => {}} />
        </View>

        {/* Sign out */}
        <View style={[styles.section, { marginTop: 8 }]}>
          <Row icon="🚪" label="Sign Out" onPress={handleSignOut} danger />
        </View>

        <Text style={styles.version}>OhMyGold v2.0 · Built with ❤️ for Gold's Gym France</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  scroll: { paddingHorizontal: 20, paddingBottom: 40, paddingTop: 8 },
  title: { fontSize: 24, fontWeight: "800", color: C.text, marginBottom: 20 },
  userCard: { backgroundColor: C.card, borderRadius: 20, padding: 20, flexDirection: "row", alignItems: "center", gap: 16, marginBottom: 28, borderWidth: 1, borderColor: C.border },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: "#2A2A3E", borderWidth: 2, borderColor: C.primary, alignItems: "center", justifyContent: "center" },
  avatarText: { fontSize: 20, fontWeight: "800", color: C.primary },
  userInfo: { flex: 1, gap: 4 },
  userName: { fontSize: 18, fontWeight: "700", color: C.text },
  userEmail: { fontSize: 13, color: C.muted },
  roleBadge: { alignSelf: "flex-start", backgroundColor: C.primary + "15", borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, marginTop: 4 },
  roleBadgeText: { color: C.primary, fontSize: 12, fontWeight: "600" },
  sectionLabel: { fontSize: 12, fontWeight: "700", color: C.muted, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 8, marginLeft: 4 },
  section: { backgroundColor: C.card, borderRadius: 16, borderWidth: 1, borderColor: C.border, overflow: "hidden", marginBottom: 20 },
  row: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: C.border + "80", gap: 12 },
  rowIcon: { fontSize: 18, width: 26, textAlign: "center" },
  rowLabel: { flex: 1, fontSize: 15, color: C.text },
  dangerText: { color: C.error },
  chevron: { color: C.muted, fontSize: 20 },
  version: { textAlign: "center", color: C.muted, fontSize: 12, marginTop: 8 },
});
