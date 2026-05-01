import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { LogOut, User, Settings, CreditCard } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

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

export function UserMenu() {
  const { t } = useTranslation("common");
  const { profile, role, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  const handleLogout = async () => {
    setOpen(false);
    await logout();
  };

  const navigateTo = (path: string) => {
    setOpen(false);
    navigate(path);
  };

  const initials = getInitials(profile?.first_name, profile?.last_name);
  const displayName =
    profile ? `${profile.first_name} ${profile.last_name}` : "…";
  const roleLabel = role ? t(ROLE_LABEL_KEYS[role] ?? "roles.visitor") : "";

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={displayName}
        aria-haspopup="true"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-neutral-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
      >
        {profile?.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt={displayName}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-gold-400/40"
          />
        ) : (
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gold-400 text-surface text-sm font-bold select-none">
            {initials}
          </span>
        )}
        <span className="hidden sm:block text-sm font-medium text-neutral-100 max-w-[120px] truncate">
          {profile?.first_name ?? "…"}
        </span>
      </button>

      {open && (
        <div
          ref={dropdownRef}
          role="menu"
          aria-label={t("layout.profile")}
          className="absolute right-0 top-11 z-50 w-56 rounded-xl bg-surface-card border border-neutral-800 shadow-xl animate-fade-in"
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-neutral-800">
            <div className="flex items-center gap-3">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={displayName}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-gold-400 text-surface text-base font-bold select-none">
                  {initials}
                </span>
              )}
              <div className="min-w-0">
                <p className="text-sm font-semibold text-neutral-100 truncate">{displayName}</p>
                <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full bg-gold-400/10 text-gold-400 text-[10px] font-semibold uppercase tracking-wide">
                  {roleLabel}
                </span>
              </div>
            </div>
          </div>

          {/* Menu items */}
          <div className="py-1">
            <button
              type="button"
              role="menuitem"
              onClick={() => navigateTo("/client/profile")}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-300 hover:text-neutral-100 hover:bg-neutral-800 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-gold-400"
            >
              <User className="w-4 h-4 text-neutral-500" aria-hidden="true" />
              {t("layout.profile")}
            </button>

            <button
              type="button"
              role="menuitem"
              onClick={() => navigateTo("/settings")}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-300 hover:text-neutral-100 hover:bg-neutral-800 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-gold-400"
            >
              <Settings className="w-4 h-4 text-neutral-500" aria-hidden="true" />
              {t("layout.settings")}
            </button>

            {role === "member" && (
              <button
                type="button"
                role="menuitem"
                onClick={() => navigateTo("/client/subscription")}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-300 hover:text-neutral-100 hover:bg-neutral-800 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-gold-400"
              >
                <CreditCard className="w-4 h-4 text-neutral-500" aria-hidden="true" />
                {t("layout.mySubscription")}
              </button>
            )}
          </div>

          <div className="border-t border-neutral-800 py-1">
            <button
              type="button"
              role="menuitem"
              onClick={() => void handleLogout()}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-red-400"
            >
              <LogOut className="w-4 h-4" aria-hidden="true" />
              {t("layout.logout")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
