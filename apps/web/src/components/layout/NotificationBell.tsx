import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Bell } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import { useAuth } from "@/hooks/useAuth";

export function NotificationBell() {
  const { t } = useTranslation("common");
  const { isAuthenticated } = useAuth();
  const { notifications, unreadCount, isLoading, markAsRead, markAllAsRead } =
    useNotifications();
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

  if (!isAuthenticated) return null;

  function formatTime(dateStr: string) {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 60) return `${diff}s`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}d`;
  }

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={t("layout.notifications")}
        aria-haspopup="true"
        aria-expanded={open}
        className="relative flex items-center justify-center w-9 h-9 rounded-lg text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
      >
        <Bell className="w-5 h-5" aria-hidden="true" />
        {unreadCount > 0 && (
          <span
            aria-label={`${unreadCount} unread`}
            className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[1.1rem] h-[1.1rem] rounded-full bg-gold-400 text-surface text-[10px] font-bold px-0.5"
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          ref={dropdownRef}
          role="dialog"
          aria-label={t("layout.notifications")}
          className="absolute right-0 top-11 z-50 w-80 rounded-xl bg-surface-card border border-neutral-800 shadow-xl animate-fade-in"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800">
            <span className="text-sm font-semibold text-neutral-100">
              {t("layout.notifications")}
            </span>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={() => void markAllAsRead()}
                className="text-xs text-gold-400 hover:text-gold-300 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-gold-400 rounded"
              >
                {t("layout.markAllRead")}
              </button>
            )}
          </div>

          {/* List */}
          <ul
            className="max-h-80 overflow-y-auto divide-y divide-neutral-800"
            aria-label={t("layout.notifications")}
          >
            {isLoading && (
              <li className="flex items-center justify-center py-8">
                <span className="w-5 h-5 rounded-full border-2 border-gold-400 border-t-transparent animate-spin" />
              </li>
            )}
            {!isLoading && notifications.length === 0 && (
              <li className="flex items-center justify-center py-8 text-sm text-neutral-500">
                {t("layout.noNotifications")}
              </li>
            )}
            {!isLoading &&
              notifications.map((notif) => (
                <li key={notif.id}>
                  <button
                    type="button"
                    onClick={() => {
                      if (!notif.is_read) void markAsRead(notif.id);
                      if (notif.link) window.location.href = notif.link;
                    }}
                    className={`w-full text-left px-4 py-3 hover:bg-neutral-800 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-gold-400 ${
                      !notif.is_read ? "bg-gold-400/5" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {!notif.is_read && (
                        <span className="mt-1.5 flex-shrink-0 w-2 h-2 rounded-full bg-gold-400" aria-hidden="true" />
                      )}
                      <div className={`flex-1 min-w-0 ${notif.is_read ? "pl-5" : ""}`}>
                        <p className="text-sm font-medium text-neutral-100 truncate">
                          {notif.title}
                        </p>
                        <p className="text-xs text-neutral-400 mt-0.5 line-clamp-2">
                          {notif.body}
                        </p>
                      </div>
                      <span className="flex-shrink-0 text-xs text-neutral-500 ml-2">
                        {formatTime(notif.created_at)}
                      </span>
                    </div>
                  </button>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}
