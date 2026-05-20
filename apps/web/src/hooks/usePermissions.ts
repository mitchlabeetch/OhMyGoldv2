import { useCallback } from "react";
import { useAuthStore } from "@/stores/authStore";
import {
  hasPermission,
  hasAllPermissions,
  hasAnyPermission,
  hasMinimumRole,
  type Permission,
} from "@/lib/permissions";
import type { AppRole } from "@ohmygold/shared";

/**
 * React hook for RBAC permission checks.
 *
 * @example
 * const { can, canAll, canAny, isAtLeast } = usePermissions();
 * if (can('members:create')) { ... }
 */
export function usePermissions() {
  const profile = useAuthStore((s) => s.profile);
  const role = profile?.role as AppRole | undefined;

  const can = useCallback(
    (permission: Permission) => hasPermission(role, permission),
    [role]
  );

  const canAll = useCallback(
    (permissions: Permission[]) => hasAllPermissions(role, permissions),
    [role]
  );

  const canAny = useCallback(
    (permissions: Permission[]) => hasAnyPermission(role, permissions),
    [role]
  );

  const isAtLeast = useCallback(
    (requiredRole: AppRole) => hasMinimumRole(role, requiredRole),
    [role]
  );

  const isRole = useCallback(
    (r: AppRole) => role === r,
    [role]
  );

  return {
    role,
    can,
    canAll,
    canAny,
    isAtLeast,
    isRole,
    isAuthenticated: Boolean(profile),
    isStaff: hasAnyPermission(role, ["members:read", "access:grant"]),
    isAdmin: hasMinimumRole(role, "admin"),
    isSuperAdmin: role === "super_admin",
  };
}
