import { Redirect, Tabs } from "expo-router";
import { useAuthStore } from "../../src/stores/authStore";
import { Chrome as Home, Users, Calendar, CreditCard, User } from "lucide-react-native";

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
          backgroundColor: "#171717",
          borderTopColor: "#2A2A2A",
          height: 60,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: "#FFEC00",
        tabBarInactiveTintColor: "#737373",
        tabBarLabelStyle: { fontSize: 10, fontWeight: "600" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Accueil",
          tabBarIcon: ({ color }) => <Home size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="classes"
        options={{
          title: "Cours",
          tabBarIcon: ({ color }) => <Calendar size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="members"
        options={{
          title: "Membres",
          tabBarIcon: ({ color }) => <Users size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="payments"
        options={{
          title: "Paiements",
          tabBarIcon: ({ color }) => <CreditCard size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          tabBarIcon: ({ color }) => <User size={22} color={color} />,
        }}
      />
    </Tabs>
  );
}
