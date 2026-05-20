import { createContext, useContext, useEffect, useRef, type ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/authStore";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";

interface AuthContextValue {
  initialized: boolean;
}

const AuthContext = createContext<AuthContextValue>({ initialized: false });

export function AuthProvider({ children }: { children: ReactNode }) {
  const setUser = useAuthStore((s) => s.setUser);
  const setSession = useAuthStore((s) => s.setSession);
  const setLoading = useAuthStore((s) => s.setLoading);
  const fetchProfile = useAuthStore((s) => s.fetchProfile);
  const checkSession = useAuthStore((s) => s.checkSession);
  const initialized = useRef(false);

  useEffect(() => {
    // Initialize session on mount
    if (!initialized.current) {
      initialized.current = true;
      checkSession();
    }

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (event === "SIGNED_IN" && session?.user) {
        await fetchProfile(session.user.id);
      }

      if (event === "SIGNED_OUT") {
        useAuthStore.setState({
          user: null,
          profile: null,
          session: null,
          isAuthenticated: false,
        });
      }

      if (event === "TOKEN_REFRESHED" && session?.user) {
        // Silently refresh profile in background
        fetchProfile(session.user.id).catch(console.error);
      }

      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser, setSession, setLoading, fetchProfile, checkSession]);

  return <AuthContext.Provider value={{ initialized: true }}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  return useContext(AuthContext);
}
