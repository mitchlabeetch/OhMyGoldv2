import { useState, useEffect, type ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { BottomTabs } from "./BottomTabs";
import { useAuth } from "@/hooks/useAuth";

const SIDEBAR_COLLAPSED_KEY = "omg_sidebar_collapsed";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { isAuthenticated } = useAuth();

  // Load persisted collapsed state
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "true";
    } catch {
      return false;
    }
  });

  // Mobile drawer open state
  const [mobileOpen, setMobileOpen] = useState(false);

  // Persist collapsed state
  useEffect(() => {
    try {
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(collapsed));
    } catch {
      // localStorage unavailable — ignore
    }
  }, [collapsed]);

  // Close mobile drawer on resize to desktop
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const handler = (e: MediaQueryListEvent) => {
      if (e.matches) setMobileOpen(false);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const handleMenuToggle = () => {
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    if (isDesktop) {
      setCollapsed((v) => !v);
    } else {
      setMobileOpen((v) => !v);
    }
  };

  if (!isAuthenticated) {
    // No shell for unauthenticated pages (login, register, etc.)
    return <>{children}</>;
  }

  const sidebarWidth = collapsed ? "lg:pl-16" : "lg:pl-64";

  return (
    <div className="min-h-screen bg-surface text-neutral-100">
      {/* Sidebar — desktop: always visible; mobile: overlay drawer */}
      <>
        {/* Desktop sidebar */}
        <div className="hidden lg:block">
          <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />
        </div>

        {/* Mobile sidebar overlay */}
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-30 bg-black/60 lg:hidden"
              aria-hidden="true"
              onClick={() => setMobileOpen(false)}
            />
            {/* Drawer */}
            <div className="fixed top-0 left-0 z-40 h-full lg:hidden">
              <Sidebar collapsed={false} onToggle={() => setMobileOpen(false)} />
            </div>
          </>
        )}
      </>

      {/* Topbar */}
      <div
        className={`transition-all duration-300 ${collapsed ? "lg:left-16" : "lg:left-64"}`}
      >
        <Topbar onMenuToggle={handleMenuToggle} />
      </div>

      {/* Main content */}
      <div
        className={`transition-all duration-300 ${sidebarWidth}`}
      >
        <main
          id="main-content"
          className="min-h-screen pt-16 pb-16 lg:pb-0"
          tabIndex={-1}
        >
          {children}
        </main>
      </div>

      {/* Bottom tabs — mobile only */}
      <BottomTabs />
    </div>
  );
}
