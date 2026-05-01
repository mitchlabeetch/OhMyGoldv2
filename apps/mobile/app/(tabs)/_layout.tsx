import { Redirect, Tabs } from "expo-router";
import { useAuthStore } from "../../src/stores/authStore";
import { Home, Calendar, QrCode, User } from "lucide-react-native";

export default function TabsLayout() {
  const { session } = useAuthStore();

  if (!session) {
    return <Redirect href="/auth/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#1A1A2E",
          borderTopColor: "#2A2A3E",
          height: 64,
          paddingBottom: 10,
          paddingTop: 4,
        },
        tabBarActiveTintColor: "#F5A623",
        tabBarInactiveTintColor: "#6B7280",
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <Home size={size ?? 22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="booking"
        options={{
          title: "Book",
          tabBarIcon: ({ color, size }) => <Calendar size={size ?? 22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="card"
        options={{
          title: "My Card",
          tabBarIcon: ({ color, size }) => <QrCode size={size ?? 22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => <User size={size ?? 22} color={color} />,
        }}
      />
    </Tabs>
  );
}
