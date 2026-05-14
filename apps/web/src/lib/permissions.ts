import type { AppRole } from "@ohmygold/shared";

/**
 * OhMyGold RBAC — Permission Matrix
 * Defines which roles can perform which actions.
 * Mirrors database RLS policies for client-side UI gating.
 */

export type Permission =
  // Members
  | "members:read"
  | "members:create"
  | "members:update"
  | "members:delete"
  // Classes
  | "classes:read"
  | "classes:create"
  | "classes:update"
  | "classes:delete"
  // Bookings
  | "bookings:read_own"
  | "bookings:read_all"
  | "bookings:create"
  | "bookings:cancel_own"
  | "bookings:cancel_any"
  // Payments
  | "payments:read_own"
  | "payments:read_all"
  | "payments:create"
  | "payments:refund"
  // Access
  | "access:grant"
  | "access:read_own"
  | "access:read_all"
  // Users/Roles
  | "users:read"
  | "users:update_role"
  | "users:deactivate"
  // Settings
  | "settings:read"
  | "settings:update"
  // Locations
  | "locations:read"
  | "locations:manage"
  // Analytics
  | "analytics:read_basic"
  | "analytics:read_full"
  // Audit log
  | "audit:read_own"
  | "audit:read_all"
  // Notifications
  | "notifications:send";

const PERMISSIONS_BY_ROLE: Record<AppRole, Set<Permission>> = {
  super_admin: new Set<Permission>([
    "members:read", "members:create", "members:update", "members:delete",
    "classes:read", "classes:create", "classes:update", "classes:delete",
    "bookings:read_own", "bookings:read_all", "bookings:create", "bookings:cancel_own", "bookings:cancel_any",
    "payments:read_own", "payments:read_all", "payments:create", "payments:refund",
    "access:grant", "access:read_own", "access:read_all",
    "users:read", "users:update_role", "users:deactivate",
    "settings:read", "settings:update",
    "locations:read", "locations:manage",
    "analytics:read_basic", "analytics:read_full",
    "audit:read_own", "audit:read_all",
    "notifications:send",
  ]),

  admin: new Set<Permission>([
    "members:read", "members:create", "members:update", "members:delete",
    "classes:read", "classes:create", "classes:update", "classes:delete",
    "bookings:read_own", "bookings:read_all", "bookings:create", "bookings:cancel_own", "bookings:cancel_any",
    "payments:read_own", "payments:read_all", "payments:create", "payments:refund",
    "access:grant", "access:read_own", "access:read_all",
    "users:read", "users:update_role", "users:deactivate",
    "settings:read", "settings:update",
    "locations:read",
    "analytics:read_basic", "analytics:read_full",
    "audit:read_own", "audit:read_all",
    "notifications:send",
  ]),

  coach: new Set<Permission>([
    "members:read",
    "classes:read", "classes:create", "classes:update",
    "bookings:read_own", "bookings:read_all", "bookings:cancel_any",
    "access:read_own",
    "locations:read",
    "analytics:read_basic",
    "audit:read_own",
  ]),

  // teacher: new roadmap role — same permissions as coach (class instructor)
  teacher: new Set<Permission>([
    "members:read",
    "classes:read", "classes:create", "classes:update",
    "bookings:read_own", "bookings:read_all", "bookings:cancel_any",
    "access:read_own",
    "locations:read",
    "analytics:read_basic",
    "audit:read_own",
  ]),

  receptionist: new Set<Permission>([
    "members:read", "members:create", "members:update",
    "classes:read",
    "bookings:read_own", "bookings:read_all", "bookings:create", "bookings:cancel_own", "bookings:cancel_any",
    "payments:read_own", "payments:read_all", "payments:create",
    "access:grant", "access:read_own", "access:read_all",
    "locations:read",
    "audit:read_own",
  ]),

  // employee: new roadmap role — same permissions as receptionist (front-desk)
  employee: new Set<Permission>([
    "members:read", "members:create", "members:update",
    "classes:read",
    "bookings:read_own", "bookings:read_all", "bookings:create", "bookings:cancel_own", "bookings:cancel_any",
    "payments:read_own", "payments:read_all", "payments:create",
    "access:grant", "access:read_own", "access:read_all",
    "locations:read",
    "audit:read_own",
  ]),

  // manager: new roadmap role — location-level management, between admin and employee
  manager: new Set<Permission>([
    "members:read", "members:create", "members:update", "members:delete",
    "classes:read", "classes:create", "classes:update", "classes:delete",
    "bookings:read_own", "bookings:read_all", "bookings:create", "bookings:cancel_own", "bookings:cancel_any",
    "payments:read_own", "payments:read_all", "payments:create", "payments:refund",
    "access:grant", "access:read_own", "access:read_all",
    "users:read",
    "settings:read",
    "locations:read",
    "analytics:read_basic", "analytics:read_full",
    "audit:read_own", "audit:read_all",
    "notifications:send",
  ]),

  member: new Set<Permission>([
    "bookings:read_own", "bookings:create", "bookings:cancel_own",
    "payments:read_own",
    "access:read_own",
    "classes:read",
    "locations:read",
    "audit:read_own",
  ]),

  // client: new roadmap role — same permissions as member (paying gym member)
  client: new Set<Permission>([
    "bookings:read_own", "bookings:create", "bookings:cancel_own",
    "payments:read_own",
    "access:read_own",
    "classes:read",
    "locations:read",
    "audit:read_own",
  ]),

  visitor: new Set<Permission>([
    "classes:read",
    "locations:read",
  ]),
};

/**
 * Check if a role has a specific permission.
 */
export function hasPermission(role: AppRole | undefined | null, permission: Permission): boolean {
  if (!role) return false;
  return PERMISSIONS_BY_ROLE[role]?.has(permission) ?? false;
}

/**
 * Check if a role has ALL specified permissions.
 */
export function hasAllPermissions(role: AppRole | undefined | null, permissions: Permission[]): boolean {
  return permissions.every((p) => hasPermission(role, p));
}

/**
 * Check if a role has ANY of the specified permissions.
 */
export function hasAnyPermission(role: AppRole | undefined | null, permissions: Permission[]): boolean {
  return permissions.some((p) => hasPermission(role, p));
}

/**
 * Get all permissions for a role.
 */
export function getPermissions(role: AppRole): Set<Permission> {
  return PERMISSIONS_BY_ROLE[role] ?? new Set();
}

/**
 * Role hierarchy — higher = more access.
 * Legacy roles (coach, receptionist, member) map to the same level as their
 * new roadmap counterparts (teacher, employee, client).
 */
export const ROLE_HIERARCHY: Record<AppRole, number> = {
  visitor: 0,
  member: 1,
  client: 1,       // new roadmap alias for member
  receptionist: 2,
  employee: 2,     // new roadmap alias for receptionist
  coach: 2,
  teacher: 2,      // new roadmap alias for coach
  manager: 3,      // new roadmap role — between admin and staff
  admin: 4,
  super_admin: 5,
};

/**
 * Check if `role` is at least as privileged as `requiredRole`.
 */
export function hasMinimumRole(role: AppRole | undefined | null, requiredRole: AppRole): boolean {
  if (!role) return false;
  return (ROLE_HIERARCHY[role] ?? -1) >= ROLE_HIERARCHY[requiredRole];
}
