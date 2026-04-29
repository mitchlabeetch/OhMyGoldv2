import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Edit, MapPin, Clock, Users, Layers } from "lucide-react";
import { useLocation } from "@/hooks/useLocations";
import { StatusBadge } from "@/components/ui/StatusBadge";

type Tab = "overview" | "zones" | "equipment" | "hours" | "staff";

const TABS: { id: Tab; label: string }[] = [
  { id: "overview", label: "Vue d'ensemble" },
  { id: "zones", label: "Zones" },
  { id: "equipment", label: "Équipement" },
  { id: "hours", label: "Horaires" },
  { id: "staff", label: "Personnel" },
];

function SkeletonBlock() {
  return <div className="h-6 rounded bg-neutral-700 animate-pulse" aria-busy="true" />;
}

export default function LocationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: location, isLoading, isError } = useLocation(id ?? "");
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  if (isError) {
    return (
      <div className="p-6">
        <p className="text-status-error">Erreur lors du chargement du club.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <Link
          to="/admin/locations"
          className="inline-flex items-center gap-2 text-text-secondary hover:text-white transition-colors text-sm"
          aria-label="Retour aux clubs"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Retour
        </Link>
        <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold-400/10 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-gold-400" aria-hidden="true" />
            </div>
            {isLoading ? (
              <div className="space-y-2">
                <div className="h-5 w-32 rounded bg-neutral-700 animate-pulse" />
                <div className="h-3 w-24 rounded bg-neutral-700 animate-pulse" />
              </div>
            ) : (
              <div>
                <h1 className="text-xl font-bold text-white">{location?.name}</h1>
                <p className="text-text-secondary text-sm">{location?.city}</p>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            {!isLoading && location && (
              <StatusBadge
                status={location.is_active ? "active" : "inactive"}
                label={location.is_active ? "Actif" : "Inactif"}
              />
            )}
            <Link
              to={`/admin/locations/${id}/edit`}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-surface-card border border-border rounded-lg text-sm text-white hover:bg-white/10 transition-colors"
              aria-label="Modifier ce club"
            >
              <Edit className="w-4 h-4" aria-hidden="true" />
              Modifier
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <nav className="flex gap-1 border-b border-border" aria-label="Onglets">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            aria-selected={activeTab === tab.id}
            aria-controls={`tab-${tab.id}`}
            role="tab"
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-gold-400 text-gold-400"
                : "border-transparent text-text-secondary hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Tab content */}
      <div role="tabpanel" id={`tab-${activeTab}`}>
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: MapPin, label: "Adresse", value: isLoading ? null : `${location?.address ?? "—"}, ${location?.city ?? "—"}` },
              { icon: Clock, label: "Fuseau horaire", value: isLoading ? null : (location?.timezone ?? "—") },
              { icon: Users, label: "Téléphone", value: isLoading ? null : (location?.phone ?? "—") },
              { icon: Layers, label: "Email", value: isLoading ? null : (location?.email ?? "—") },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="glass-card p-4 flex items-start gap-3">
                <Icon className="w-5 h-5 text-text-muted mt-0.5" aria-hidden="true" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-text-muted mb-1">{label}</p>
                  {isLoading ? <SkeletonBlock /> : <p className="text-white text-sm">{value}</p>}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "zones" && (
          <div className="glass-card p-6">
            <h2 className="text-white font-semibold mb-4">Zones du club</h2>
            {isLoading ? (
              <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <SkeletonBlock key={i} />)}</div>
            ) : (
              <p className="text-text-secondary text-sm">Aucune zone configurée.</p>
            )}
          </div>
        )}

        {activeTab === "equipment" && (
          <div className="glass-card p-6">
            <h2 className="text-white font-semibold mb-4">Équipements</h2>
            <p className="text-text-secondary text-sm">Aucun équipement enregistré.</p>
          </div>
        )}

        {activeTab === "hours" && (
          <div className="glass-card p-6">
            <h2 className="text-white font-semibold mb-4">Horaires d'ouverture</h2>
            <p className="text-text-secondary text-sm">Horaires non configurés.</p>
          </div>
        )}

        {activeTab === "staff" && (
          <div className="glass-card p-6">
            <h2 className="text-white font-semibold mb-4">Personnel</h2>
            <p className="text-text-secondary text-sm">Aucun membre du personnel assigné.</p>
          </div>
        )}
      </div>
    </div>
  );
}
