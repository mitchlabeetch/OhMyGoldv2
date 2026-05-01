// ============================================================
// OhMyGold Shared Types
// ============================================================

// ---- Enums ----

export type AppRole =
  | "super_admin"
  | "admin"
  | "manager"      // location-level manager (new roadmap role)
  | "coach"        // legacy alias for teacher
  | "teacher"      // class instructor (new roadmap role)
  | "receptionist" // legacy alias for employee
  | "employee"     // front-desk staff (new roadmap role)
  | "member"       // legacy alias for client
  | "client"       // paying gym member (new roadmap role)
  | "visitor";

export type MembershipStatus =
  | "active"
  | "inactive"
  | "suspended"
  | "expired"
  | "pending";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded" | "cancelled";

export type ClassStatus = "scheduled" | "in_progress" | "completed" | "cancelled";

export type BookingStatus = "booked" | "attended" | "cancelled" | "no_show" | "waitlisted";

export type ContractType = "monthly" | "annual" | "quarterly" | "day_pass" | "trial";

export type Gender = "male" | "female" | "non_binary" | "prefer_not_to_say";

export type NotificationChannel = "email" | "sms" | "push" | "in_app";

export type AuditAction =
  | "login"
  | "logout"
  | "register"
  | "password_reset"
  | "profile_update"
  | "member_create"
  | "member_update"
  | "member_delete"
  | "booking_create"
  | "booking_cancel"
  | "payment_process"
  | "payment_refund"
  | "class_create"
  | "class_update"
  | "class_cancel"
  | "access_grant"
  | "access_deny";

// ---- Base Types ----

export interface TimestampedRecord {
  created_at: string;
  updated_at: string;
}

export interface SoftDeletable {
  deleted_at: string | null;
}

// ---- User / Auth Types ----

export interface UserProfile extends TimestampedRecord {
  id: string; // matches auth.users.id
  email: string;
  role: AppRole;
  first_name: string;
  last_name: string;
  phone: string | null;
  avatar_url: string | null;
  language: "fr" | "en";
  timezone: string;
  is_active: boolean;
  metadata: Record<string, unknown>;
}

export interface Session {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  user: UserProfile;
}

// ---- Gym / Location Types ----

export interface GymLocation extends TimestampedRecord {
  id: string;
  name: string;
  address: string;
  city: string;
  postal_code: string;
  country: string;
  phone: string | null;
  email: string | null;
  latitude: number | null;
  longitude: number | null;
  is_active: boolean;
  metadata: Record<string, unknown>;
}

// ---- Member Types ----

export interface Member extends TimestampedRecord, SoftDeletable {
  id: string;
  profile_id: string;
  gym_id: string;
  membership_number: string;
  membership_status: MembershipStatus;
  contract_type: ContractType;
  contract_start: string;
  contract_end: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  medical_notes: string | null;
  notes: string | null;
  gender: Gender | null;
  date_of_birth: string | null;
}

export interface MemberWithProfile extends Member {
  profile: UserProfile;
}

// ---- Class Types ----

export interface GymClass extends TimestampedRecord {
  id: string;
  gym_id: string;
  coach_id: string | null;
  name: string;
  description: string | null;
  category: string;
  duration_minutes: number;
  max_capacity: number;
  current_bookings: number;
  scheduled_at: string;
  status: ClassStatus;
  room: string | null;
  is_recurring: boolean;
  recurrence_rule: string | null;
  metadata: Record<string, unknown>;
}

export interface ClassWithCoach extends GymClass {
  coach: UserProfile | null;
}

// ---- Booking Types ----

export interface Booking extends TimestampedRecord {
  id: string;
  class_id: string;
  member_id: string;
  status: BookingStatus;
  booked_at: string;
  cancelled_at: string | null;
  attended_at: string | null;
  waitlist_position: number | null;
}

// ---- Membership / Contract Types ----

export interface MembershipPlan extends TimestampedRecord {
  id: string;
  gym_id: string;
  name: string;
  description: string | null;
  price_cents: number;
  currency: string;
  contract_type: ContractType;
  duration_days: number | null;
  features: string[];
  is_active: boolean;
  sort_order: number;
}

// ---- Payment Types ----

export interface Payment extends TimestampedRecord {
  id: string;
  member_id: string;
  gym_id: string;
  amount_cents: number;
  currency: string;
  status: PaymentStatus;
  payment_method: string;
  reference: string | null;
  description: string | null;
  paid_at: string | null;
  metadata: Record<string, unknown>;
}

// ---- Access Control Types ----

export interface AccessLog extends TimestampedRecord {
  id: string;
  member_id: string;
  gym_id: string;
  granted: boolean;
  method: "badge" | "qr" | "manual";
  denied_reason: string | null;
}

// ---- Notification Types ----

export interface Notification extends TimestampedRecord {
  id: string;
  user_id: string;
  title: string;
  body: string;
  channel: NotificationChannel;
  read_at: string | null;
  action_url: string | null;
  metadata: Record<string, unknown>;
}

// ---- Audit Log Types ----

export interface AuditLog {
  id: string;
  user_id: string | null;
  action: AuditAction;
  resource_type: string | null;
  resource_id: string | null;
  ip_address: string | null;
  user_agent: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

// ---- Permission Types (RBAC) ----

export type Permission =
  | "members:read"
  | "members:write"
  | "members:delete"
  | "classes:read"
  | "classes:write"
  | "classes:delete"
  | "bookings:read"
  | "bookings:write"
  | "bookings:delete"
  | "payments:read"
  | "payments:write"
  | "payments:refund"
  | "reports:read"
  | "reports:export"
  | "access:grant"
  | "access:manage"
  | "settings:read"
  | "settings:write"
  | "users:manage"
  | "gyms:manage";

export const ROLE_PERMISSIONS: Record<AppRole, Permission[]> = {
  super_admin: [
    "members:read",
    "members:write",
    "members:delete",
    "classes:read",
    "classes:write",
    "classes:delete",
    "bookings:read",
    "bookings:write",
    "bookings:delete",
    "payments:read",
    "payments:write",
    "payments:refund",
    "reports:read",
    "reports:export",
    "access:grant",
    "access:manage",
    "settings:read",
    "settings:write",
    "users:manage",
    "gyms:manage",
  ],
  admin: [
    "members:read",
    "members:write",
    "members:delete",
    "classes:read",
    "classes:write",
    "classes:delete",
    "bookings:read",
    "bookings:write",
    "bookings:delete",
    "payments:read",
    "payments:write",
    "payments:refund",
    "reports:read",
    "reports:export",
    "access:grant",
    "access:manage",
    "settings:read",
    "settings:write",
    "users:manage",
  ],
  manager: [
    "members:read",
    "members:write",
    "members:delete",
    "classes:read",
    "classes:write",
    "bookings:read",
    "bookings:write",
    "bookings:delete",
    "payments:read",
    "payments:write",
    "reports:read",
    "access:grant",
    "access:manage",
    "settings:read",
  ],
  coach: [
    "members:read",
    "classes:read",
    "classes:write",
    "bookings:read",
    "bookings:write",
    "reports:read",
  ],
  teacher: [
    "members:read",
    "classes:read",
    "classes:write",
    "bookings:read",
    "bookings:write",
    "reports:read",
  ],
  receptionist: [
    "members:read",
    "members:write",
    "classes:read",
    "bookings:read",
    "bookings:write",
    "payments:read",
    "payments:write",
    "access:grant",
  ],
  employee: [
    "members:read",
    "members:write",
    "classes:read",
    "bookings:read",
    "bookings:write",
    "payments:read",
    "payments:write",
    "access:grant",
  ],
  member: ["classes:read", "bookings:read", "bookings:write"],
  client: ["classes:read", "bookings:read", "bookings:write"],
  visitor: ["classes:read"],
};

export function hasPermission(role: AppRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function hasAnyPermission(role: AppRole, permissions: Permission[]): boolean {
  return permissions.some((p) => hasPermission(role, p));
}

export function hasAllPermissions(role: AppRole, permissions: Permission[]): boolean {
  return permissions.every((p) => hasPermission(role, p));
}
