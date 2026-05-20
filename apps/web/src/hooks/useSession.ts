import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/authStore";
import { useToast } from "@ohmygold/ui-shared";

/**
 * Session management hook.
 * - Monitors session expiry and auto-refresh.
 * - Handles multi-device sign-out (TOKEN_REFRESHED, SIGNED_OUT events).
 * - Idle timeout after 30 minutes of inactivity (configurable).
 */
export function useSession(idleTimeoutMinutes = 30) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const signOut = useAuthStore((s) => s.signOut);
  const refreshProfile = useAuthStore((s) => s.refreshProfile);

  const handleSignedOut = useCallback(() => {
    navigate("/auth/login", { replace: true });
    toast({
      type: "info",
      title: "Session terminée",
      description: "Votre session a expiré. Reconnectez-vous.",
    });
  }, [navigate, toast]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        handleSignedOut();
      } else if (event === "TOKEN_REFRESHED" && session) {
        // Token refreshed successfully — nothing to do
      } else if (event === "USER_UPDATED" && session) {
        refreshProfile();
      }
    });

    return () => subscription.unsubscribe();
  }, [handleSignedOut, refreshProfile]);

  // ---- Idle timeout ----
  useEffect(() => {
    let idleTimer: ReturnType<typeof setTimeout> | null = null;
    const timeoutMs = idleTimeoutMinutes * 60 * 1000;

    const resetTimer = () => {
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(async () => {
        await signOut();
        toast({
          type: "warning",
          title: "Session expirée",
          description: `Vous avez été déconnecté après ${idleTimeoutMinutes} minutes d'inactivité.`,
        });
        navigate("/auth/login", { replace: true });
      }, timeoutMs);
    };

    const events = ["mousedown", "keydown", "scroll", "touchstart", "pointermove"];
    events.forEach((e) => window.addEventListener(e, resetTimer, { passive: true }));
    resetTimer();

    return () => {
      if (idleTimer) clearTimeout(idleTimer);
      events.forEach((e) => window.removeEventListener(e, resetTimer));
    };
  }, [idleTimeoutMinutes, signOut, navigate, toast]);
}

/**
 * Sign out from all devices by revoking all refresh tokens.
 */
export async function signOutAllDevices(): Promise<void> {
  await supabase.auth.signOut({ scope: "global" });
}
