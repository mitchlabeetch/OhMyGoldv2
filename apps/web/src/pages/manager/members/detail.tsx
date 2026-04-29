import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, User, Calendar, CreditCard, FileText, BarChart2, Loader2 } from "lucide-react";
import { useMember } from "@/hooks/useMembers";
import { StatusBadge } from "@/components/ui/StatusBadge";

type Tab = "profile" | "membership" | "attendance" | "payments" | "notes";

const TABS: { id: Tab; label: string; icon: typeof User }[] = [
  { id: "profile", label: "Profil", icon: User },
  { id: "membership", label: "Abonnement", icon: CreditCard },
  { id: "attendance", label: "Présences", icon: BarChart2 },
  { id: "payments", label: "Paiements", icon: FileText },
  { id: "notes", label: "Notes", icon: Calendar },
];

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(amount);
}

export default function MemberDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: member, isLoading, isError } = useMember(id ?? "");
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  if (isError) {
    return (
      <div className="p-6">
        <p className="text-status-error">Erreur lors du chargement du membre.</p>
      </div>
    );
  }

  const profile = (member as { user_profiles?: { first_name?: string; last_name?: string; email?: string; avatar_url?: string } } | undefined)?.user_profiles;
  const subscription = (member as { subscriptions?: Array<{ membership_plans?: { name?: string; price?: number }; starts_at?: string; ends_at?: string; status?: string }> } | undefined)?.subscriptions?.[0];
  const initials = profile
    ? `${profile.first_name?.charAt(0) ?? ""}${profile.last_name?.charAt(0) ?? ""}`.toUpperCase()
    : "??";

  return (
    <div className="p-6 space-y-6">
      <Link
        to="/manager/members"
        className="inline-flex items-center gap-2 text-text-secondary hover:text-white transition-colors text-sm"
        aria-label="Retour aux membres"
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
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" /> : initials}
          </div>
          <div className="flex-1">
            {isLoading ? (
              <div className="space-y-2">
                <div className="h-5 w-40 rounded bg-neutral-700 animate-pulse" />
                <div className="h-4 w-28 rounded bg-neutral-700 animate-pulse" />
              </div>
            ) : (
              <>
                <h1 className="text-xl font-bold text-white">
                  {profile?.first_name ?? "—"} {profile?.last_name ?? ""}
                </h1>
                <p className="text-text-secondary text-sm">{profile?.email ?? "—"}</p>
                <div className="mt-2">
                  <StatusBadge status={(member as { status?: string } | undefined)?.status ?? "pending"} />
                </div>
              </>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 min-w-[140px]">
            <button
              type="button"
              className="px-3 py-1.5 bg-status-warning/10 border border-status-warning/30 rounded-lg text-sm text-status-warning hover:bg-status-warning/20 transition-colors"
              aria-label="Geler l'abonnement"
            >
              Geler
            </button>
            <button
              type="button"
              className="px-3 py-1.5 bg-status-error/10 border border-status-error/30 rounded-lg text-sm text-status-error hover:bg-status-error/20 transition-colors"
              aria-label="Annuler l'abonnement"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <nav className="flex gap-1 border-b border-border overflow-x-auto" aria-label="Onglets membre">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              aria-selected={activeTab === tab.id}
              role="tab"
              className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
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

      {/* Tab Content */}
      <div role="tabpanel">
        {activeTab === "profile" && (
          <div className="glass-card p-6 space-y-4">
            {[
              { label: "Prénom", value: profile?.first_name },
              { label: "Nom", value: profile?.last_name },
              { label: "Email", value: profile?.email },
              { label: "Membre depuis", value: member ? new Date((member as { created_at?: string }).created_at ?? "").toLocaleDateString("fr-FR") : undefined },
            ].map(({ label, value }) => (
              <div key={label} className="flex flex-col sm:flex-row sm:items-center gap-1">
                <span className="text-text-muted text-sm w-36">{label}</span>
                {isLoading ? (
                  <div className="h-4 w-32 rounded bg-neutral-700 animate-pulse" />
                ) : (
                  <span className="text-white text-sm">{value ?? "—"}</span>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === "membership" && (
          <div className="glass-card p-6">
            {!subscription ? (
              <p className="text-text-secondary text-sm">Aucun abonnement actif.</p>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                  <span className="text-text-muted text-sm w-36">Forfait</span>
                  <span className="text-white text-sm font-medium">{subscription.membership_plans?.name ?? "—"}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                  <span className="text-text-muted text-sm w-36">Prix</span>
                  <span className="text-white text-sm">{subscription.membership_plans?.price !== undefined ? formatCurrency(subscription.membership_plans.price) : "—"}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                  <span className="text-text-muted text-sm w-36">Début</span>
                  <span className="text-white text-sm">{subscription.starts_at ? new Date(subscription.starts_at).toLocaleDateString("fr-FR") : "—"}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                  <span className="text-text-muted text-sm w-36">Expiration</span>
                  <span className="text-white text-sm">{subscription.ends_at ? new Date(subscription.ends_at).toLocaleDateString("fr-FR") : "—"}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                  <span className="text-text-muted text-sm w-36">Statut</span>
                  <StatusBadge status={subscription.status ?? "pending"} />
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "attendance" && (
          <div className="glass-card p-6">
            <p className="text-text-secondary text-sm">Historique de présences à venir.</p>
          </div>
        )}

        {activeTab === "payments" && (
          <div className="glass-card p-6">
            <p className="text-text-secondary text-sm">Historique de paiements à venir.</p>
          </div>
        )}

        {activeTab === "notes" && (
          <div className="glass-card p-6">
            <textarea
              className="w-full px-3 py-2 bg-surface-card border border-border rounded-lg text-white text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-gold-400/50 transition-colors resize-none"
              rows={6}
              placeholder="Ajouter une note sur ce membre..."
              aria-label="Notes sur le membre"
            />
            <button
              type="button"
              className="mt-3 px-4 py-2 bg-gold-400 text-black text-sm font-semibold rounded-lg hover:bg-gold-300 transition-colors"
            >
              Enregistrer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
