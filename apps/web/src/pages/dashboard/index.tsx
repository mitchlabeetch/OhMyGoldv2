import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "@/stores/authStore";
import { LayoutDashboard, TrendingUp, Users, Calendar, Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { t } = useTranslation(["dashboard", "common"]);
  const profile = useAuthStore((s) => s.profile);

  const stats = [
    {
      label: t("dashboard:stats.activeMembers"),
      value: "—",
      icon: Users,
      color: "text-gold-400",
      bg: "bg-gold-400/10",
    },
    {
      label: t("dashboard:stats.classesScheduled"),
      value: "—",
      icon: Calendar,
      color: "text-status-info",
      bg: "bg-status-info/10",
    },
    {
      label: t("dashboard:stats.revenueToday"),
      value: "—",
      icon: TrendingUp,
      color: "text-status-success",
      bg: "bg-status-success/10",
    },
  ];

  return (
    <div className="min-h-screen bg-surface">
      {/* Top bar */}
      <header className="sticky top-0 z-40 h-16 bg-surface-secondary/80 backdrop-blur border-b border-border flex items-center px-6 gap-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold-400 to-gold-700 flex items-center justify-center">
            <span className="text-sm font-black text-black">G</span>
          </div>
          <span className="font-bold text-white text-sm hidden sm:block">OhMyGold</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-white">
              {profile?.first_name} {profile?.last_name}
            </p>
            <p className="text-xs text-text-muted capitalize">{profile?.role}</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-gold-500/20 border border-gold-500/40 flex items-center justify-center text-gold-400 text-xs font-bold">
            {profile?.first_name?.charAt(0)}
            {profile?.last_name?.charAt(0)}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold text-white">
            {t("dashboard:welcome", { name: profile?.first_name ?? "…" })}
          </h1>
          <p className="text-text-secondary mt-1">{t("dashboard:overview")}</p>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {stats.map(({ label, value, icon: Icon, color, bg }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card p-6 flex items-center gap-4"
            >
              <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center`}>
                <Icon className={`w-6 h-6 ${color}`} />
              </div>
              <div>
                <p className="text-text-secondary text-sm">{label}</p>
                <p className="text-2xl font-bold text-white mt-0.5">{value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Placeholder content */}
        <div className="glass-card p-8 text-center">
          <LayoutDashboard className="w-12 h-12 text-text-muted mx-auto mb-3" />
          <h2 className="text-lg font-semibold text-white mb-2">Phase 4 — Core Gym Management</h2>
          <p className="text-text-secondary text-sm">
            Les fonctionnalités de gestion (membres, cours, paiements, accès) seront implémentées
            en Phase 4.
          </p>
          <Link
            to="/settings/security"
            className="mt-4 inline-flex items-center gap-2 text-gold-400 hover:text-gold-300 text-sm transition-colors"
          >
            Configurer la double authentification →
          </Link>
        </div>
      </div>
    </div>
  );
}
