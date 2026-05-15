import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useAuthStore } from "../../src/stores/authStore";

const C = {
  primary: "#F5A623",
  bg: "#0A0A0F",
  card: "#1A1A2E",
  border: "#2A2A3E",
  text: "#FFFFFF",
  muted: "#9CA3AF",
};

const QUICK_ACTIONS = [
  { label: "Book a Class", icon: "📅", route: "/booking" as const },
  { label: "My QR Card", icon: "🎫", route: "/card" as const },
  { label: "My Profile", icon: "👤", route: "/profile" as const },
];

export default function HomeScreen() {
  const { profile, session } = useAuthStore();
  const name =
    (profile as { first_name?: string; full_name?: string } | null)?.first_name ??
    (profile as { full_name?: string } | null)?.full_name?.split(" ")[0] ??
    session?.user?.email?.split("@")[0] ??
    "Member";

  const today = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good day, {name} 👋</Text>
            <Text style={styles.date}>{today.charAt(0).toUpperCase() + today.slice(1)}</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{name.slice(0, 2).toUpperCase()}</Text>
          </View>
        </View>

        {/* Brand banner */}
        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>💪 GOLD'S GYM FRANCE</Text>
          <Text style={styles.bannerSub}>Premium Fitness Experience</Text>
        </View>

        {/* Quick actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsRow}>
          {QUICK_ACTIONS.map((a) => (
            <TouchableOpacity
              key={a.label}
              style={styles.actionBtn}
              onPress={() => router.push(a.route)}
              activeOpacity={0.75}
            >
              <Text style={styles.actionIcon}>{a.icon}</Text>
              <Text style={styles.actionLabel}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Today's schedule placeholder */}
        <Text style={styles.sectionTitle}>Today's Classes</Text>
        <View style={styles.card}>
          {[
            { time: "08:00", name: "BodyPump", teacher: "Sophie M.", spots: 5 },
            { time: "10:30", name: "Yoga Flow", teacher: "Marc D.", spots: 2 },
            { time: "18:00", name: "HIIT Express", teacher: "Julie P.", spots: 8 },
          ].map((cls) => (
            <View key={cls.time} style={styles.classRow}>
              <View style={styles.classTime}>
                <Text style={styles.classTimeText}>{cls.time}</Text>
              </View>
              <View style={styles.classInfo}>
                <Text style={styles.className}>{cls.name}</Text>
                <Text style={styles.classTeacher}>{cls.teacher}</Text>
              </View>
              <TouchableOpacity
                style={[styles.bookBtn, cls.spots <= 3 && styles.bookBtnLow]}
                onPress={() => router.push("/booking")}
              >
                <Text style={styles.bookBtnText}>{cls.spots <= 0 ? "Full" : "Book"}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Tip */}
        <View style={styles.tipCard}>
          <Text style={styles.tipText}>
            🏆 Tip: Book early to secure your spot in popular classes!
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  scroll: { paddingHorizontal: 20, paddingBottom: 32, paddingTop: 8 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  greeting: { fontSize: 22, fontWeight: "800", color: C.text },
  date: { fontSize: 13, color: C.muted, marginTop: 2 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: C.card,
    borderWidth: 1.5,
    borderColor: C.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: C.primary, fontWeight: "700", fontSize: 15 },
  banner: {
    backgroundColor: C.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2A2A3E",
  },
  bannerTitle: { fontSize: 18, fontWeight: "900", color: C.primary, letterSpacing: 1 },
  bannerSub: { fontSize: 12, color: C.muted, marginTop: 4 },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: C.text, marginBottom: 12 },
  actionsRow: { flexDirection: "row", gap: 12, marginBottom: 24 },
  actionBtn: {
    flex: 1,
    backgroundColor: C.card,
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: C.border,
    gap: 8,
  },
  actionIcon: { fontSize: 24 },
  actionLabel: { fontSize: 11, color: C.muted, fontWeight: "600", textAlign: "center" },
  card: {
    backgroundColor: C.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
    overflow: "hidden",
    marginBottom: 16,
  },
  classRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    gap: 12,
  },
  classTime: { width: 46 },
  classTimeText: { color: C.primary, fontWeight: "700", fontSize: 13 },
  classInfo: { flex: 1 },
  className: { color: C.text, fontWeight: "600", fontSize: 14 },
  classTeacher: { color: C.muted, fontSize: 12, marginTop: 2 },
  bookBtn: {
    backgroundColor: C.primary,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  bookBtnLow: { backgroundColor: "#EF4444" },
  bookBtnText: { color: "#000", fontWeight: "700", fontSize: 13 },
  tipCard: {
    backgroundColor: "#1A1A2E",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: C.primary + "30",
  },
  tipText: { color: C.muted, fontSize: 13, lineHeight: 20 },
});
