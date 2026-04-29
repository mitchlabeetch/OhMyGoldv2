import { useEffect, ReactNode } from "react";
import { useAuthStore } from "../stores/authStore";
import { View, ActivityIndicator } from "react-native";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { initialize, isLoading } = useAuthStore();

  useEffect(() => {
    initialize();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: "#0A0A0A", alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#FFEC00" />
      </View>
    );
  }

  return <>{children}</>;
}
