import { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../../src/lib/supabase";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../../src/stores/authStore";

const C = { primary: "#F5A623", bg: "#0A0A0F", card: "#1A1A2E", border: "#2A2A3E", text: "#FFFFFF", muted: "#9CA3AF", success: "#10B981", error: "#EF4444" };

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export default function BookingScreen() {
  const { session } = useAuthStore();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [selectedDate, setSelectedDate] = useState(today);

  const days = Array.from({ length: 7 }, (_, i) => addDays(today, i));

  const { data: classes = [], isLoading } = useQuery({
    queryKey: ["mobile-classes", selectedDate.toISOString().split("T")[0]],
    queryFn: async () => {
      const start = new Date(selectedDate);
      const end = new Date(selectedDate);
      end.setDate(end.getDate() + 1);
      const { data, error } = await supabase
        .from("gym_classes")
        .select("id, name, starts_at, duration_minutes, max_capacity, teacher_name, room")
        .gte("starts_at", start.toISOString())
        .lt("starts_at", end.toISOString())
        .order("starts_at");
      if (error) throw error;
      return data ?? [];
    },
  });

  const bookMut = useMutation({
    mutationFn: async (classId: string) => {
      const { error } = await supabase.from("bookings").insert({ class_id: classId, member_id: session?.user.id, status: "confirmed" });
      if (error) throw error;
    },
    onSuccess: () => Alert.alert("Booked!", "Your class has been booked successfully."),
    onError: (err: Error) => Alert.alert("Error", err.message),
  });

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Book a Class</Text>
      </View>

      {/* Day picker */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dayPicker}>
        {days.map((d) => {
          const isSelected = d.toDateString() === selectedDate.toDateString();
          const isToday = d.toDateString() === today.toDateString();
          return (
            <TouchableOpacity key={d.toISOString()} style={[styles.dayBtn, isSelected && styles.dayBtnSelected]} onPress={() => setSelectedDate(d)} activeOpacity={0.7}>
              <Text style={[styles.dayName, isSelected && styles.dayTextSelected]}>
                {d.toLocaleDateString("fr-FR", { weekday: "short" }).slice(0, 3).toUpperCase()}
              </Text>
              <Text style={[styles.dayNum, isSelected && styles.dayTextSelected]}>{d.getDate()}</Text>
              {isToday && <View style={[styles.todayDot, isSelected && styles.todayDotSelected]} />}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Classes list */}
      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {isLoading ? (
          [1, 2, 3].map((i) => <View key={i} style={styles.skeleton} />)
        ) : (classes as unknown[]).length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📅</Text>
            <Text style={styles.emptyText}>No classes scheduled for this day.</Text>
          </View>
        ) : (
          (classes as Array<{ id: string; name: string; starts_at: string; duration_minutes: number; max_capacity: number; teacher_name?: string; room?: string }>).map((cls) => (
            <View key={cls.id} style={styles.classCard}>
              <View style={styles.timeCol}>
                <Text style={styles.timeText}>
                  {new Date(cls.starts_at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                </Text>
                <Text style={styles.durationText}>{cls.duration_minutes}min</Text>
              </View>
              <View style={styles.classInfo}>
                <Text style={styles.className}>{cls.name}</Text>
                {cls.teacher_name && <Text style={styles.classMeta}>{cls.teacher_name}</Text>}
                {cls.room && <Text style={styles.classMeta}>📍 {cls.room}</Text>}
                <Text style={styles.classMeta}>👥 Max {cls.max_capacity}</Text>
              </View>
              <TouchableOpacity
                style={styles.bookBtn}
                onPress={() => bookMut.mutate(cls.id)}
                disabled={bookMut.isPending}
                activeOpacity={0.75}
              >
                <Text style={styles.bookBtnText}>Book</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  header: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 4 },
  title: { fontSize: 24, fontWeight: "800", color: C.text },
  dayPicker: { paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  dayBtn: { width: 52, alignItems: "center", paddingVertical: 10, borderRadius: 14, backgroundColor: C.card, borderWidth: 1, borderColor: C.border },
  dayBtnSelected: { backgroundColor: C.primary, borderColor: C.primary },
  dayName: { fontSize: 10, fontWeight: "700", color: C.muted, letterSpacing: 0.5 },
  dayNum: { fontSize: 20, fontWeight: "800", color: C.text, marginTop: 2 },
  dayTextSelected: { color: "#000" },
  todayDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: C.primary, marginTop: 3 },
  todayDotSelected: { backgroundColor: "#000" },
  list: { padding: 16, gap: 12, paddingBottom: 32 },
  skeleton: { height: 90, backgroundColor: C.card, borderRadius: 14 },
  empty: { alignItems: "center", paddingVertical: 60, gap: 12 },
  emptyIcon: { fontSize: 40 },
  emptyText: { color: C.muted, fontSize: 15 },
  classCard: { backgroundColor: C.card, borderRadius: 14, padding: 16, flexDirection: "row", alignItems: "center", gap: 12, borderWidth: 1, borderColor: C.border },
  timeCol: { width: 52, alignItems: "center" },
  timeText: { fontSize: 15, fontWeight: "700", color: C.primary },
  durationText: { fontSize: 11, color: C.muted, marginTop: 2 },
  classInfo: { flex: 1, gap: 3 },
  className: { fontSize: 15, fontWeight: "700", color: C.text },
  classMeta: { fontSize: 12, color: C.muted },
  bookBtn: { backgroundColor: C.primary, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10 },
  bookBtnText: { color: "#000", fontWeight: "700", fontSize: 13 },
});
