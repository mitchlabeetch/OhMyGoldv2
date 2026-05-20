import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore, useRole } from "@/stores/authStore";
import { supabase } from "@/lib/supabase";
import { hasPermission, hasAnyPermission, hasAllPermissions } from "@ohmygold/shared";
import type { Permission, AppRole } from "@ohmygold/shared";

export function useAuth() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const profile = useAuthStore((s) => s.profile);
  const session = useAuthStore((s) => s.session);
  const isLoading = useAuthStore((s) => s.isLoading);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const error = useAuthStore((s) => s.error);
  const login = useAuthStore((s) => s.login);
  const loginWithGoogle = useAuthStore((s) => s.loginWithGoogle);
  const loginWithApple = useAuthStore((s) => s.loginWithApple);
  const storeLogout = useAuthStore((s) => s.logout);
  const clearError = useAuthStore((s) => s.clearError);

  const role = useRole();

  const logout = useCallback(async () => {
    await storeLogout();
    navigate("/login");
  }, [storeLogout, navigate]);

  const forgotPassword = useCallback(async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    if (error) throw error;
  }, []);

  const resetPassword = useCallback(async (password: string) => {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
  }, []);

  const sendMagicLink = useCallback(async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) throw error;
  }, []);

  const enrollMFA = useCallback(async () => {
    const { data, error } = await supabase.auth.mfa.enroll({ factorType: "totp" });
    if (error) throw error;
    return data;
  }, []);

  const verifyMFA = useCallback(async (factorId: string, code: string) => {
    const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({
      factorId,
    });
    if (challengeError) throw challengeError;

    const { data, error } = await supabase.auth.mfa.verify({
      factorId,
      challengeId: challengeData.id,
      code,
    });
    if (error) throw error;
    return data;
  }, []);

  const unenrollMFA = useCallback(async (factorId: string) => {
    const { error } = await supabase.auth.mfa.unenroll({ factorId });
    if (error) throw error;
  }, []);

  const listMFAFactors = useCallback(async () => {
    const { data, error } = await supabase.auth.mfa.listFactors();
    if (error) throw error;
    return data;
  }, []);

  return {
    user,
    profile,
    session,
    role,
    isLoading,
    isAuthenticated,
    error,
    login,
    loginWithGoogle,
    loginWithApple,
    logout,
    forgotPassword,
    resetPassword,
    sendMagicLink,
    enrollMFA,
    verifyMFA,
    unenrollMFA,
    listMFAFactors,
    clearError,
  };
}

// Permission hook
export function usePermissions() {
  const role = useRole();

  const can = useCallback(
    (permission: Permission): boolean => {
      if (!role) return false;
      return hasPermission(role, permission);
    },
    [role],
  );

  const canAny = useCallback(
    (permissions: Permission[]): boolean => {
      if (!role) return false;
      return hasAnyPermission(role, permissions);
    },
    [role],
  );

  const canAll = useCallback(
    (permissions: Permission[]): boolean => {
      if (!role) return false;
      return hasAllPermissions(role, permissions);
    },
    [role],
  );

  const isRole = useCallback(
    (r: AppRole | AppRole[]): boolean => {
      if (!role) return false;
      return Array.isArray(r) ? r.includes(role) : role === r;
    },
    [role],
  );

  return { can, canAny, canAll, isRole, role };
}
