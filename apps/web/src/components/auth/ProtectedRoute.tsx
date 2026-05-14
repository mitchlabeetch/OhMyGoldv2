import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";
import type { AppRole, Permission } from "@ohmygold/shared";
import { hasPermission, hasAnyPermission } from "@ohmygold/shared";

interface ProtectedRouteProps {
  children: ReactNode;
  /** Required role(s) — at least one must match */
  roles?: AppRole | readonly AppRole[];
  /** Required permission — user must have this */
  permission?: Permission;
  /** Any of these permissions — user needs at least one */
  anyPermission?: Permission[];
  /** Redirect target when unauthorized (default: /unauthorized) */
  unauthorizedRedirect?: string;
}

export function ProtectedRoute({
  children,
  roles,
  permission,
  anyPermission,
  unauthorizedRedirect = "/unauthorized",
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, profile } = useAuthStore();
  const location = useLocation();

  // Show loading spinner while checking session
  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center" role="status" aria-live="polite" aria-label="Chargement…">
        <Loader2 className="w-8 h-8 animate-spin text-gold-400" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location.pathname }} replace />;
  }

  const userRole = profile?.role;

  // Check role restriction
  if (roles && userRole) {
    const allowed = Array.isArray(roles) ? roles.includes(userRole as any) : userRole === roles;
    if (!allowed) {
      return <Navigate to={unauthorizedRedirect} replace />;
    }
  }

  // Check single permission
  if (permission && userRole && !hasPermission(userRole, permission)) {
    return <Navigate to={unauthorizedRedirect} replace />;
  }

  // Check any-of permissions
  if (anyPermission && userRole && !hasAnyPermission(userRole, anyPermission)) {
    return <Navigate to={unauthorizedRedirect} replace />;
  }

  return <>{children}</>;
}

/** Render children only if user has a given permission, otherwise render fallback */
interface GateProps {
  permission?: Permission;
  anyPermission?: Permission[];
  role?: AppRole | readonly AppRole[];
  children: ReactNode;
  fallback?: ReactNode;
}

export function Gate({ permission, anyPermission, role, children, fallback = null }: GateProps) {
  const { profile } = useAuthStore();
  const userRole = profile?.role;

  if (!userRole) return <>{fallback}</>;

  if (role) {
    const allowed = Array.isArray(role) ? role.includes(userRole as any) : userRole === role;
    if (!allowed) return <>{fallback}</>;
  }

  if (permission && !hasPermission(userRole, permission)) return <>{fallback}</>;
  if (anyPermission && !hasAnyPermission(userRole, anyPermission)) return <>{fallback}</>;

  return <>{children}</>;
}
