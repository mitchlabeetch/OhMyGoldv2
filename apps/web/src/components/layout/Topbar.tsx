import { useTranslation } from "react-i18next";
import { Menu, Globe } from "lucide-react";
import { NotificationBell } from "./NotificationBell";
import { UserMenu } from "./UserMenu";

interface TopbarProps {
  onMenuToggle?: () => void;
}

export function Topbar({ onMenuToggle }: TopbarProps) {
  const { t, i18n } = useTranslation("common");

  const currentLang = i18n.language.startsWith("fr") ? "fr" : "en";
  const nextLang = currentLang === "fr" ? "en" : "fr";

  const handleLanguageSwitch = () => {
    void i18n.changeLanguage(nextLang);
  };

  return (
    <header
      className="fixed top-0 right-0 left-0 lg:left-64 z-30 h-16 flex items-center gap-3 px-4 bg-surface-card border-b border-neutral-800 transition-all duration-300"
      role="banner"
    >
      {/* Left: menu toggle */}
      <button
        type="button"
        onClick={onMenuToggle}
        aria-label={t("layout.toggleMenu")}
        className="flex items-center justify-center w-9 h-9 rounded-lg text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 lg:hidden"
      >
        <Menu className="w-5 h-5" aria-hidden="true" />
      </button>

      {/* Desktop collapse toggle - shown on lg+ when sidebar might need toggling */}
      <button
        type="button"
        onClick={onMenuToggle}
        aria-label={t("layout.collapseMenu")}
        className="hidden lg:flex items-center justify-center w-9 h-9 rounded-lg text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
      >
        <Menu className="w-5 h-5" aria-hidden="true" />
      </button>

      {/* Page title — fills remaining space */}
      <div className="flex-1 min-w-0">
        <h1
          className="text-sm font-semibold text-neutral-100 truncate"
          aria-live="polite"
          id="page-title"
        >
          {document.title.replace(" | OhMyGold", "").replace("OhMyGold", "")}
        </h1>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-1">
        {/* Language switcher */}
        <button
          type="button"
          onClick={handleLanguageSwitch}
          aria-label={t("layout.switchLanguage")}
          title={t("layout.switchLanguage")}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 text-xs font-semibold uppercase"
        >
          <Globe className="w-4 h-4" aria-hidden="true" />
          <span>{nextLang}</span>
        </button>

        {/* Notification bell */}
        <NotificationBell />

        {/* User menu */}
        <UserMenu />
      </div>
    </header>
  );
}
