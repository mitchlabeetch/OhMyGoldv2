import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  LayoutDashboard,
  CalendarDays,
  QrCode,
  User,
  UserCheck,
  ShoppingCart,
  Users,
  BarChart3,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { AppRole } from "@ohmygold/shared";
import { useAuth } from "@/hooks/useAuth";

interface TabItem {
  labelKey: string;
  path: string;
  Icon: LucideIcon;
}

const BOTTOM_TABS: Record<string, TabItem[]> = {
  member: [
    { labelKey: "nav.dashboard", path: "/dashboard", Icon: LayoutDashboard },
    { labelKey: "nav.booking", path: "/client/booking", Icon: CalendarDays },
    { labelKey: "nav.myCard", path: "/client/card", Icon: QrCode },
    { labelKey: "nav.profile", path: "/client/profile", Icon: User },
  ],
  receptionist: [
    { labelKey: "nav.dashboard", path: "/dashboard", Icon: LayoutDashboard },
    { labelKey: "nav.checkIn", path: "/employee/check-in", Icon: UserCheck },
    { labelKey: "nav.pos", path: "/employee/pos", Icon: ShoppingCart },
  ],
  coach: [
    { labelKey: "nav.dashboard", path: "/dashboard", Icon: LayoutDashboard },
    { labelKey: "nav.classes", path: "/teacher/classes", Icon: CalendarDays },
    { labelKey: "nav.members", path: "/teacher/roster", Icon: Users },
  ],
  admin: [
    { labelKey: "nav.dashboard", path: "/dashboard", Icon: LayoutDashboard },
    { labelKey: "nav.members", path: "/admin/users", Icon: Users },
    { labelKey: "nav.reports", path: "/admin/reports", Icon: BarChart3 },
  ],
  super_admin: [
    { labelKey: "nav.dashboard", path: "/dashboard", Icon: LayoutDashboard },
    { labelKey: "nav.members", path: "/admin/users", Icon: Users },
    { labelKey: "nav.reports", path: "/admin/reports", Icon: BarChart3 },
  ],
  visitor: [
    { labelKey: "nav.dashboard", path: "/", Icon: LayoutDashboard },
    { labelKey: "nav.pricing", path: "/pricing", Icon: CalendarDays },
  ],
};

export function BottomTabs() {
  const { t } = useTranslation("common");
  const { role } = useAuth();

  const effectiveRole: AppRole = role ?? "visitor";
  const tabs: TabItem[] = BOTTOM_TABS[effectiveRole] ?? BOTTOM_TABS.visitor;

  return (
    <nav
      aria-label="Bottom navigation"
      className="fixed bottom-0 left-0 right-0 z-30 h-16 flex items-stretch bg-surface-card border-t border-neutral-800 lg:hidden"
    >
      {tabs.map(({ labelKey, path, Icon }) => (
        <NavLink
          key={path}
          to={path}
          end={path === "/" || path === "/dashboard"}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 ${
              isActive
                ? "text-gold-400"
                : "text-neutral-500 hover:text-neutral-300"
            }`
          }
          aria-label={t(labelKey)}
        >
          {({ isActive }) => (
            <>
              <Icon
                className={`w-5 h-5 ${isActive ? "text-gold-400" : "text-neutral-500"}`}
                aria-hidden="true"
              />
              <span>{t(labelKey)}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
