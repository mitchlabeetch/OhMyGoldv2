import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import type { Session, User } from "@supabase/supabase-js";
import type { UserProfile, AppRole } from "@ohmygold/shared";
import { supabase } from "@/lib/supabase";

interface AuthState {
  // State
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;

  // Actions
  setUser: (user: User | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithApple: () => Promise<void>;
  logout: () => Promise<void>;
  signOut: () => Promise<void>;
  checkSession: () => Promise<void>;
  fetchProfile: (userId: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        user: null,
        profile: null,
        session: null,
        isLoading: true,
        isAuthenticated: false,
        error: null,

        // Setters
        setUser: (user) => set({ user, isAuthenticated: !!user }),
        setProfile: (profile) => set({ profile }),
        setSession: (session) => set({ session }),
        setLoading: (isLoading) => set({ isLoading }),
        setError: (error) => set({ error }),
        clearError: () => set({ error: null }),

        // Login with email + password
        login: async (email, password, rememberMe = false) => {
          set({ isLoading: true, error: null });
          try {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;

            set({
              user: data.user,
              session: data.session,
              isAuthenticated: true,
            });

            if (rememberMe) {
              localStorage.setItem("omg_remember_email", email);
            } else {
              localStorage.removeItem("omg_remember_email");
            }

            await get().fetchProfile(data.user.id);
          } catch (err: unknown) {
            const message =
              err instanceof Error ? err.message : "Une erreur est survenue. Veuillez réessayer.";
            set({ error: message });
            throw err;
          } finally {
            set({ isLoading: false });
          }
        },

        // Google OAuth
        loginWithGoogle: async () => {
          set({ isLoading: true, error: null });
          try {
            const { error } = await supabase.auth.signInWithOAuth({
              provider: "google",
              options: {
                redirectTo: `${window.location.origin}/auth/callback`,
                queryParams: { access_type: "offline", prompt: "consent" },
              },
            });
            if (error) throw error;
          } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Erreur Google OAuth";
            set({ error: message, isLoading: false });
            throw err;
          }
        },

        // Apple OAuth
        loginWithApple: async () => {
          set({ isLoading: true, error: null });
          try {
            const { error } = await supabase.auth.signInWithOAuth({
              provider: "apple",
              options: {
                redirectTo: `${window.location.origin}/auth/callback`,
              },
            });
            if (error) throw error;
          } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Erreur Apple Sign-In";
            set({ error: message, isLoading: false });
            throw err;
          }
        },

        // Logout
        logout: async () => {
          set({ isLoading: true });
          try {
            await supabase.auth.signOut();
          } finally {
            set({
              user: null,
              profile: null,
              session: null,
              isAuthenticated: false,
              isLoading: false,
              error: null,
            });
          }
        },

        // Check existing session on app start
        checkSession: async () => {
          set({ isLoading: true });
          try {
            const {
              data: { session },
            } = await supabase.auth.getSession();

            if (session) {
              set({ user: session.user, session, isAuthenticated: true });
              await get().fetchProfile(session.user.id);
            } else {
              set({ user: null, profile: null, session: null, isAuthenticated: false });
            }
          } catch (err) {
            console.error("[Auth] Error checking session:", err);
            set({ user: null, profile: null, session: null, isAuthenticated: false });
          } finally {
            set({ isLoading: false });
          }
        },

        // Fetch user profile from database
        fetchProfile: async (userId: string) => {
          try {
            const { data, error } = await supabase
              .from("user_profiles")
              .select("*")
              .eq("id", userId)
              .single();

            if (error) throw error;
            set({ profile: data as UserProfile });
          } catch (err) {
            console.error("[Auth] Error fetching profile:", err);
            // Don't fail — profile might not exist yet for OAuth users
          }
        },

        // Re-fetch profile for the currently logged-in user
        refreshProfile: async () => {
          const userId = get().user?.id;
          if (userId) await get().fetchProfile(userId);
        },

        // Alias: signOut = logout (used by useSession hook)
        signOut: async () => {
          await get().logout();
        },
      }),
      {
        name: "omg-auth",
        // Only persist non-sensitive data; Supabase handles session storage separately
        partialize: (state) => ({
          user: state.user
            ? {
                id: state.user.id,
                email: state.user.email,
                user_metadata: state.user.user_metadata,
              }
            : null,
        }),
      },
    ),
    { name: "AuthStore" },
  ),
);

// Convenience selector
export const useRole = (): AppRole | null =>
  useAuthStore((s) => s.profile?.role ?? null);

export const useIsAuthenticated = (): boolean => useAuthStore((s) => s.isAuthenticated);
