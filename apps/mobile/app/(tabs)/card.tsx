import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Share } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "../../src/stores/authStore";

const C = { primary: "#F5A623", bg: "#0A0A0F", card: "#1A1A2E", border: "#2A2A3E", text: "#FFFFFF", muted: "#9CA3AF" };

function QRBlock({ value }: { value: string }) {
  // Grid-based QR visual placeholder
  const size = 9;
  const grid: boolean[][] = Array.from({ length: size }, (_, r) =>
    Array.from({ length: size }, (_, c) => {
      if ((r < 3 && c < 3) || (r < 3 && c > 5) || (r > 5 && c < 3)) return true; // corner markers
      const hash = (r * 7 + c * 13 + value.charCodeAt(0) + value.charCodeAt(Math.min(1, value.length - 1))) % 3;
      return hash === 0;
    })
  );

  return (
    <View style={qr.container}>
      {grid.map((row, r) => (
        <View key={r} style={qr.row}>
          {row.map((filled, c) => (
            <View key={c} style={[qr.cell, filled && qr.cellFilled]} />
          ))}
        </View>
      ))}
    </View>
  );
}

const qr = StyleSheet.create({
  container: { backgroundColor: "#fff", padding: 20, borderRadius: 16, gap: 4 },
  row: { flexDirection: "row", gap: 4 },
  cell: { width: 22, height: 22, borderRadius: 3, backgroundColor: "transparent" },
  cellFilled: { backgroundColor: "#0A0A0F" },
});

export default function CardScreen() {
  const { session, profile } = useAuthStore();
  const [visible, setVisible] = useState(true);

  const name = (profile as { full_name?: string } | null)?.full_name ?? session?.user?.email?.split("@")[0] ?? "Member";
  const cardId = session?.user?.id?.slice(0, 12).toUpperCase() ?? "OMG-000000000";

  async function handleShare() {
    await Share.share({ message: `My Gold's Gym France membership card: ${cardId}` });
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>My Card</Text>
      </View>

      <View style={styles.cardWrapper}>
        {/* Membership card */}
        <View style={styles.card}>
          {/* Top */}
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.gymName}>GOLD'S GYM</Text>
              <Text style={styles.gymSub}>FRANCE</Text>
            </View>
            <View style={styles.logoBox}>
              <Text style={styles.logoEmoji}>💪</Text>
            </View>
          </View>

          {/* QR */}
          <View style={styles.qrArea}>
            {visible ? (
              <QRBlock value={cardId} />
            ) : (
              <View style={styles.hiddenQR}>
                <Text style={styles.hiddenIcon}>🔒</Text>
                <Text style={styles.hiddenText}>QR hidden</Text>
              </View>
            )}
          </View>

          {/* Member info */}
          <View style={styles.memberInfo}>
            <Text style={styles.memberName}>{name}</Text>
            <Text style={styles.memberPlan}>Gold Member</Text>
            <Text style={styles.cardNumber}>{cardId}</Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => setVisible((v) => !v)} activeOpacity={0.75}>
            <Text style={styles.actionText}>{visible ? "🙈 Hide QR" : "👁 Show QR"}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={handleShare} activeOpacity={0.75}>
            <Text style={styles.actionText}>📤 Share</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.hint}>
          Present this QR code at the gym entrance for quick check-in.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  header: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 4 },
  title: { fontSize: 24, fontWeight: "800", color: C.text },
  cardWrapper: { flex: 1, alignItems: "center", paddingTop: 24, paddingHorizontal: 20 },
  card: { width: "100%", maxWidth: 360, backgroundColor: "#16162A", borderRadius: 28, padding: 24, borderWidth: 1.5, borderColor: C.primary + "50", shadowColor: C.primary, shadowOpacity: 0.15, shadowRadius: 24, shadowOffset: { width: 0, height: 8 } },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 },
  gymName: { fontSize: 18, fontWeight: "900", color: C.primary, letterSpacing: 2 },
  gymSub: { fontSize: 11, color: C.muted, letterSpacing: 4, marginTop: 1 },
  logoBox: { width: 40, height: 40, borderRadius: 20, backgroundColor: C.primary + "20", borderWidth: 1, borderColor: C.primary + "40", alignItems: "center", justifyContent: "center" },
  logoEmoji: { fontSize: 20 },
  qrArea: { alignItems: "center", marginBottom: 24 },
  hiddenQR: { width: 200, height: 200, backgroundColor: C.card, borderRadius: 16, alignItems: "center", justifyContent: "center", gap: 8 },
  hiddenIcon: { fontSize: 36 },
  hiddenText: { color: C.muted, fontSize: 13 },
  memberInfo: { borderTopWidth: 1, borderTopColor: C.border, paddingTop: 16, gap: 4 },
  memberName: { fontSize: 18, fontWeight: "800", color: C.text },
  memberPlan: { fontSize: 13, color: C.primary, fontWeight: "600" },
  cardNumber: { fontSize: 12, color: C.muted, fontFamily: "monospace", marginTop: 4 },
  actions: { flexDirection: "row", gap: 12, marginTop: 20, width: "100%", maxWidth: 360 },
  actionBtn: { flex: 1, backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 14, paddingVertical: 14, alignItems: "center" },
  actionText: { color: C.text, fontWeight: "600", fontSize: 14 },
  hint: { color: C.muted, fontSize: 12, textAlign: "center", marginTop: 20, paddingHorizontal: 16, lineHeight: 18 },
});
