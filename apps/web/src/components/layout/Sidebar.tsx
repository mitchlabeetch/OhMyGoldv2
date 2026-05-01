import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  LayoutDashboard,
  Building2,
  Users,
  Settings,
  BarChart3,
  FileText,
  Shield,
  CalendarDays,
  CreditCard,
  UserCheck,
  ShoppingCart,
  TrendingUp,
  User,
  QrCode,
  Home,
  MapPin,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { AppRole } from "@ohmygold/shared";
import { useAuth } from "@/hooks/useAuth";

interface NavItem {
  labelKey: string;
  path: string;
  Icon: LucideIcon;
}

const NAV_ITEMS: Record<string, NavItem[]> = {
  super_admin: [
    { labelKey: "nav.dashboard", path: "/dashboard", Icon: LayoutDashboard },
    { labelKey: "nav.locations", path: "/admin/locations", Icon: Building2 },
    { labelKey: "nav.users", path: "/admin/users", Icon: Users },
    { labelKey: "nav.settings", path: "/admin/settings", Icon: Settings },
    { labelKey: "nav.analytics", path: "/admin/analytics", Icon: BarChart3 },
    { labelKey: "nav.reports", path: "/admin/reports", Icon: FileText },
    { labelKey: "nav.auditLog", path: "/admin/audit-log", Icon: Shield },
  ],
  admin: [
    { labelKey: "nav.dashboard", path: "/dashboard", Icon: LayoutDashboard },
    { labelKey: "nav.locations", path: "/admin/locations", Icon: Building2 },
    { labelKey: "nav.users", path: "/admin/users", Icon: Users },
    { labelKey: "nav.settings", path: "/admin/settings", Icon: Settings },
    { labelKey: "nav.analytics", path: "/admin/analytics", Icon: BarChart3 },
    { labelKey: "nav.reports", path: "/admin/reports", Icon: FileText },
    { labelKey: "nav.auditLog", path: "/admin/audit-log", Icon: Shield },
  ],
  // manager: location-level management (new roadmap role)
  manager: [
    { labelKey: "nav.dashboard", path: "/manager/dashboard", Icon: LayoutDashboard },
    { labelKey: "nav.members", path: "/manager/members", Icon: Users },
    { labelKey: "nav.classes", path: "/manager/classes", Icon: CalendarDays },
    { labelKey: "nav.billing", path: "/manager/billing", Icon: CreditCard },
    { labelKey: "nav.checkIn", path: "/employee/check-in", Icon: UserCheck },
    { labelKey: "nav.booking", path: "/employee/bookings", Icon: CalendarDays },
    { labelKey: "nav.pos", path: "/employee/pos", Icon: ShoppingCart },
    { labelKey: "nav.analytics", path: "/admin/analytics", Icon: BarChart3 },
  ],
  receptionist: [
    { labelKey: "nav.dashboard", path: "/dashboard", Icon: LayoutDashboard },
    { labelKey: "nav.members", path: "/manager/members", Icon: Users },
    { labelKey: "nav.classes", path: "/manager/classes", Icon: CalendarDays },
    { labelKey: "nav.billing", path: "/manager/billing", Icon: CreditCard },
    { labelKey: "nav.analytics", path: "/manager/analytics", Icon: BarChart3 },
    { labelKey: "nav.staff", path: "/manager/staff", Icon: UserCheck },
    { labelKey: "nav.checkIn", path: "/employee/check-in", Icon: UserCheck },
    { labelKey: "nav.booking", path: "/employee/bookings", Icon: CalendarDays },
    { labelKey: "nav.pos", path: "/employee/pos", Icon: ShoppingCart },
  ],
  // employee: front-desk staff (new roadmap role, same as receptionist)
  employee: [
    { labelKey: "nav.dashboard", path: "/dashboard", Icon: LayoutDashboard },
    { labelKey: "nav.checkIn", path: "/employee/check-in", Icon: UserCheck },
    { labelKey: "nav.booking", path: "/employee/bookings", Icon: CalendarDays },
    { labelKey: "nav.pos", path: "/employee/pos", Icon: ShoppingCart },
    { labelKey: "nav.members", path: "/manager/members", Icon: Users },
  ],
  coach: [
    { labelKey: "nav.dashboard", path: "/dashboard", Icon: LayoutDashboard },
    { labelKey: "nav.classes", path: "/teacher/classes", Icon: CalendarDays },
    { labelKey: "nav.members", path: "/teacher/roster", Icon: Users },
    { labelKey: "nav.analytics", path: "/teacher/progress", Icon: TrendingUp },
  ],
  // teacher: class instructor (new roadmap role, same as coach)
  teacher: [
    { labelKey: "nav.dashboard", path: "/teacher/dashboard", Icon: LayoutDashboard },
    { labelKey: "nav.classes", path: "/teacher/classes", Icon: CalendarDays },
    { labelKey: "nav.members", path: "/teacher/roster", Icon: Users },
    { labelKey: "nav.analytics", path: "/teacher/progress", Icon: TrendingUp },
  ],
  member: [
    { labelKey: "nav.dashboard", path: "/dashboard", Icon: LayoutDashboard },
    { labelKey: "nav.booking", path: "/client/booking", Icon: CalendarDays },
    { labelKey: "nav.subscription", path: "/client/subscription", Icon: CreditCard },
    { labelKey: "nav.profile", path: "/client/profile", Icon: User },
    { labelKey: "nav.myCard", path: "/client/card", Icon: QrCode },
  ],
  // client: paying gym member (new roadmap role, same as member)
  client: [
    { labelKey: "nav.dashboard", path: "/client/dashboard", Icon: LayoutDashboard },
    { labelKey: "nav.booking", path: "/client/booking", Icon: CalendarDays },
    { labelKey: "nav.subscription", path: "/client/subscription", Icon: CreditCard },
    { labelKey: "nav.profile", path: "/client/profile", Icon: User },
    { labelKey: "nav.myCard", path: "/client/card", Icon: QrCode },
  ],
  visitor: [
    { labelKey: "nav.dashboard", path: "/", Icon: Home },
    { labelKey: "nav.pricing", path: "/pricing", Icon: CalendarDays },
    { labelKey: "nav.findGym", path: "/locations", Icon: MapPin },
  ],
};

const ROLE_LABEL_KEYS: Record<string, string> = {
  super_admin: "roles.super_admin",
  admin: "roles.admin",
  manager: "roles.manager",
  coach: "roles.coach",
  teacher: "roles.teacher",
  receptionist: "roles.receptionist",
  employee: "roles.employee",
  member: "roles.member",
  client: "roles.client",
  visitor: "roles.visitor",
};

function getInitials(firstName?: string, lastName?: string): string {
  const f = firstName?.[0]?.toUpperCase() ?? "";
  const l = lastName?.[0]?.toUpperCase() ?? "";
  return f + l || "?";
}

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export function Sidebar({ collapsed = false, onToggle }: SidebarProps) {
  const { t } = useTranslation("common");
  const { profile, role, logout } = useAuth();

  const effectiveRole: AppRole = role ?? "visitor";
  const navItems: NavItem[] = NAV_ITEMS[effectiveRole] ?? NAV_ITEMS.visitor;
  const roleLabel = t(ROLE_LABEL_KEYS[effectiveRole] ?? "roles.visitor");
  const initials = getInitials(profile?.first_name, profile?.last_name);
  const displayName = profile
    ? `${profile.first_name} ${profile.last_name}`
    : "…";

  return (
    <aside
      aria-label="Sidebar navigation"
      className={`fixed top-0 left-0 z-40 h-full flex flex-col bg-surface-card border-r border-neutral-800 transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Branding */}
      <div
        className={`flex items-center h-16 border-b border-neutral-800 px-4 ${
          collapsed ? "justify-center" : "gap-3"
        }`}
      >
        {/* Logo placeholder */}
        <div
          className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg bg-gold-400"
          aria-hidden="true"
        >
          <span className="text-surface text-xs font-black">G</span>
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-sm font-bold text-neutral-100 truncate">OhMyGold</p>
            <p className="text-[10px] text-neutral-500 truncate">Gold's Gym France</p>
          </div>
        )}
      </div>

      {/* Nav items */}
      <nav
        className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5"
        aria-label="Main navigation"
      >
        {navItems.map(({ labelKey, path, Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === "/" || path === "/dashboard"}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors group focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 ${
                isActive
                  ? "bg-gold-400/10 text-gold-400"
                  : "text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800"
              } ${collapsed ? "justify-center px-2" : ""}`
            }
            aria-label={collapsed ? t(labelKey) : undefined}
            title={collapsed ? t(labelKey) : undefined}
          >
            {({ isActive }) => (
              <>
                <Icon
                  className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-gold-400" : "text-neutral-500 group-hover:text-neutral-300"}`}
                  aria-hidden="true"
                />
                {!collapsed && (
                  <span className="truncate">{t(labelKey)}</span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom: toggle + user info */}
      <div className="border-t border-neutral-800 p-2 space-y-1">
        {/* Collapse toggle */}
        <button
          type="button"
          onClick={onToggle}
          aria-label={collapsed ? t("layout.expandMenu") : t("layout.collapseMenu")}
          className={`flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 ${
            collapsed ? "justify-center" : ""
          }`}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
              <span className="text-sm font-medium">{t("layout.collapseMenu")}</span>
            </>
          )}
        </button>

        {/* User info */}
        <div
          className={`flex items-center gap-3 rounded-lg px-3 py-2 ${collapsed ? "justify-center" : ""}`}
        >
          {profile?.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={displayName}
              className="w-8 h-8 rounded-full object-cover flex-shrink-0 ring-2 ring-gold-400/30"
            />
          ) : (
            <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-gold-400 text-surface text-xs font-bold select-none">
              {initials}
            </span>
          )}
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-neutral-100 truncate">{displayName}</p>
              <p className="text-[10px] text-gold-400 font-medium truncate">{roleLabel}</p>
            </div>
          )}
        </div>

        {/* Logout */}
        <button
          type="button"
          onClick={() => void logout()}
          aria-label={t("layout.logout")}
          title={collapsed ? t("layout.logout") : undefined}
          className={`flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-sm text-neutral-400 hover:text-red-400 hover:bg-red-500/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
          {!collapsed && <span>{t("layout.logout")}</span>}
        </button>
      </div>
    </aside>
  );
}
