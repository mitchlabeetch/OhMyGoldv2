import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, User, Activity, ShieldCheck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { StatusBadge } from "@/components/ui/StatusBadge";

type Tab = "profile" | "activity" | "permissions";

const TABS: { id: Tab; label: string; icon: typeof User }[] = [
  { id: "profile", label: "Profil", icon: User },
  { id: "activity", label: "Activité", icon: Activity },
  { id: "permissions", label: "Permissions", icon: ShieldCheck },
];

function useUserProfile(id: string) {
  return useQuery({
    queryKey: ["admin", "user-profiles", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
  });
}

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: user, isLoading, isError } = useUserProfile(id ?? "");
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  if (isError) {
    return (
      <div className="p-6">
        <p className="text-status-error">Erreur lors du chargement de l'utilisateur.</p>
      </div>
    );
  }

  const initials = user
    ? `${user.first_name?.charAt(0) ?? ""}${user.last_name?.charAt(0) ?? ""}`.toUpperCase()
    : "??";

  return (
    <div className="p-6 space-y-6">
      {/* Back */}
      <Link
        to="/admin/users"
        className="inline-flex items-center gap-2 text-text-secondary hover:text-white transition-colors text-sm"
        aria-label="Retour aux utilisateurs"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        Retour
      </Link>

      {/* Profile Card */}
      <div className="glass-card p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div
            className="w-16 h-16 rounded-2xl bg-gold-400/20 border border-gold-400/30 flex items-center justify-center text-gold-400 text-xl font-bold"
            aria-label={`Avatar: ${initials}`}
          >
            {isLoading ? "…" : initials}
          </div>
          <div className="flex-1">
            {isLoading ? (
              <div className="space-y-2">
                <div className="h-5 w-48 rounded bg-neutral-700 animate-pulse" />
                <div className="h-4 w-36 rounded bg-neutral-700 animate-pulse" />
              </div>
            ) : (
              <>
                <h1 className="text-xl font-bold text-white">
                  {user?.first_name} {user?.last_name}
                </h1>
                <p className="text-text-secondary text-sm">{user?.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs bg-gold-400/15 text-gold-400 px-2 py-0.5 rounded-full font-medium capitalize">
                    {user?.role}
                  </span>
                  <StatusBadge
                    status={user?.is_active ? "active" : "inactive"}
                    label={user?.is_active ? "Actif" : "Inactif"}
                  />
                </div>
              </>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 min-w-0 sm:min-w-[160px]">
            <button
              type="button"
              className="px-3 py-1.5 bg-surface-card border border-border rounded-lg text-sm text-white hover:bg-white/10 transition-colors w-full text-left"
              aria-label="Modifier le rôle"
            >
              Modifier le rôle
            </button>
            <button
              type="button"
              className="px-3 py-1.5 bg-surface-card border border-border rounded-lg text-sm text-text-secondary hover:bg-white/10 transition-colors w-full text-left"
              aria-label="Réinitialiser le mot de passe"
            >
              Réinitialiser MDP
            </button>
            <button
              type="button"
              className="px-3 py-1.5 bg-status-error/10 border border-status-error/30 rounded-lg text-sm text-status-error hover:bg-status-error/20 transition-colors w-full text-left"
              aria-label="Désactiver ce compte"
            >
              Désactiver
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <nav className="flex gap-1 border-b border-border" aria-label="Onglets utilisateur">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              aria-selected={activeTab === tab.id}
              role="tab"
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-gold-400 text-gold-400"
                  : "border-transparent text-text-secondary hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" aria-hidden="true" />
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* Tab content */}
      <div role="tabpanel">
        {activeTab === "profile" && (
          <div className="glass-card p-6 space-y-4">
            {[
              { label: "Prénom", value: user?.first_name },
              { label: "Nom", value: user?.last_name },
              { label: "Email", value: user?.email },
              { label: "Rôle", value: user?.role },
            ].map(({ label, value }) => (
              <div key={label} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                <span className="text-text-muted text-sm w-32">{label}</span>
                {isLoading ? (
                  <div className="h-4 w-32 rounded bg-neutral-700 animate-pulse" />
                ) : (
                  <span className="text-white text-sm">{value ?? "—"}</span>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === "activity" && (
          <div className="glass-card p-6">
            <p className="text-text-secondary text-sm">Aucune activité récente.</p>
          </div>
        )}

        {activeTab === "permissions" && (
          <div className="glass-card p-6">
            <p className="text-text-secondary text-sm">
              Les permissions sont déterminées par le rôle : <strong className="text-white capitalize">{user?.role ?? "—"}</strong>.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
