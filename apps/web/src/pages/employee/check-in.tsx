import { useState, useRef, useEffect, useCallback } from "react";
import { Search, CheckCircle, XCircle, AlertTriangle, Clock, User } from "lucide-react";
import { useCheckIn, useRecentCheckIns } from "@/hooks/useAccess";
import { useMembers } from "@/hooks/useMembers";
import { useAuthStore } from "@/stores/authStore";
import { StatusBadge } from "@/components/ui/StatusBadge";

type CheckedInMember = {
  id: string;
  first_name: string;
  last_name: string;
  plan: string;
  expiry: string;
  status: string;
  photoInitials: string;
};

type RecentEntry = {
  id: string;
  name: string;
  time: string;
  status: string;
};

export default function CheckInPage() {
  const profile = useAuthStore((s) => s.profile);
  const locationId = profile?.location_id ?? "";

  const [searchQuery, setSearchQuery] = useState("");
  const [checkedIn, setCheckedIn] = useState<CheckedInMember | null>(null);
  const [checkInError, setCheckInError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const { mutateAsync: checkIn, isPending: checkingIn } = useCheckIn();
  const { data: recentData } = useRecentCheckIns(locationId);
  const { data: searchResults, isLoading: searching } = useMembers(
    searchQuery.length >= 2 ? { search: searchQuery } : undefined,
  );

  // Auto-focus search input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowResults(true);
    setCheckedIn(null);
    setCheckInError(null);
  }, []);

  const handleSelectMember = useCallback(
    async (memberId: string) => {
      setShowResults(false);
      setSearchQuery("");
      setCheckInError(null);
      setCheckedIn(null);

      try {
        await checkIn({ memberId, locationId, entryMethod: "manual" });
        // Find member data from search results
        const member = searchResults?.find((m) => m.id === memberId);
        if (member) {
          const p = (member as { user_profiles?: { first_name?: string; last_name?: string } }).user_profiles;
          const sub = (member as { subscriptions?: Array<{ membership_plans?: { name?: string }; ends_at?: string }> }).subscriptions?.[0];
          setCheckedIn({
            id: memberId,
            first_name: p?.first_name ?? "—",
            last_name: p?.last_name ?? "",
            plan: sub?.membership_plans?.name ?? "—",
            expiry: sub?.ends_at ? new Date(sub.ends_at).toLocaleDateString("fr-FR") : "—",
            status: member.status,
            photoInitials: `${p?.first_name?.charAt(0) ?? "?"}${p?.last_name?.charAt(0) ?? ""}`.toUpperCase(),
          });
        }
      } catch (err) {
        setCheckInError("Impossible d'enregistrer l'accès. Vérifiez l'abonnement.");
        console.error("Check-in failed:", err);
      }
    },
    [checkIn, locationId, searchResults],
  );

  const recentEntries: RecentEntry[] = (recentData ?? []).slice(0, 10).map((ci) => {
    const p = (ci as { members?: { user_profiles?: { first_name?: string; last_name?: string }; status?: string } }).members;
    return {
      id: ci.id,
      name: `${p?.user_profiles?.first_name ?? "?"} ${p?.user_profiles?.last_name ?? ""}`.trim(),
      time: new Date(ci.checked_in_at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
      status: p?.status ?? "active",
    };
  });

  const getStatusAlert = (status: string) => {
    if (status === "active") return null;
    if (status === "expired") return { color: "border-status-warning bg-status-warning/10 text-status-warning", icon: AlertTriangle, msg: "Abonnement expiré" };
    if (status === "suspended") return { color: "border-status-error bg-status-error/10 text-status-error", icon: XCircle, msg: "Compte suspendu" };
    return { color: "border-status-warning bg-status-warning/10 text-status-warning", icon: AlertTriangle, msg: `Statut: ${status}` };
  };

  const alert = checkedIn ? getStatusAlert(checkedIn.status) : null;

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <header>
        <h1 className="text-2xl font-bold text-white">Check-in</h1>
        <p className="text-text-secondary mt-1">Scannez une carte ou recherchez par nom</p>
      </header>

      {/* Search bar */}
      <div className="relative">
        <label htmlFor="checkin-search" className="sr-only">Rechercher un membre</label>
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-5 h-5 text-text-muted pointer-events-none" aria-hidden="true" />
          <input
            id="checkin-search"
            ref={inputRef}
            type="search"
            value={searchQuery}
            onChange={handleSearch}
            onFocus={() => setShowResults(true)}
            placeholder="Nom du membre ou numéro de carte..."
            className="w-full pl-12 pr-4 py-4 bg-surface-card border-2 border-border rounded-2xl text-white text-lg placeholder:text-text-muted focus:outline-none focus:border-gold-400 transition-colors"
            aria-autocomplete="list"
            aria-controls="search-results"
            aria-expanded={showResults && (searchResults ?? []).length > 0}
            autoComplete="off"
          />
          {checkingIn && (
            <div className="absolute right-4 w-5 h-5 rounded-full border-2 border-gold-400 border-t-transparent animate-spin" aria-hidden="true" />
          )}
        </div>

        {/* Dropdown results */}
        {showResults && searchQuery.length >= 2 && (
          <div
            id="search-results"
            role="listbox"
            aria-label="Résultats de recherche"
            className="absolute z-10 top-full mt-1 w-full bg-surface-card border border-border rounded-xl shadow-lg overflow-hidden"
          >
            {searching ? (
              <div className="p-4 text-center text-text-secondary text-sm">Recherche…</div>
            ) : (searchResults ?? []).length === 0 ? (
              <div className="p-4 text-center text-text-secondary text-sm">Aucun membre trouvé</div>
            ) : (
              (searchResults ?? []).slice(0, 8).map((m) => {
                const p = (m as { user_profiles?: { first_name?: string; last_name?: string } }).user_profiles;
                const initials = `${p?.first_name?.charAt(0) ?? "?"}${p?.last_name?.charAt(0) ?? ""}`.toUpperCase();
                return (
                  <button
                    key={m.id}
                    type="button"
                    role="option"
                    aria-selected="false"
                    onClick={() => handleSelectMember(m.id)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors text-left"
                  >
                    <div className="w-9 h-9 rounded-full bg-gold-400/15 flex items-center justify-center text-gold-400 text-sm font-bold flex-shrink-0">
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium">
                        {p?.first_name ?? "—"} {p?.last_name ?? ""}
                      </p>
                      <p className="text-text-muted text-xs truncate">ID: {m.id.slice(0, 8)}</p>
                    </div>
                    <StatusBadge status={m.status} />
                  </button>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Error */}
      {checkInError && (
        <div className="flex items-center gap-3 p-4 rounded-xl border border-status-error/30 bg-status-error/10" role="alert">
          <XCircle className="w-5 h-5 text-status-error flex-shrink-0" aria-hidden="true" />
          <p className="text-status-error text-sm">{checkInError}</p>
        </div>
      )}

      {/* Success card */}
      {checkedIn && (
        <div
          className={`rounded-2xl border-2 p-6 ${alert ? alert.color : "border-status-success bg-status-success/10"}`}
          role="status"
          aria-live="polite"
          aria-label={`Check-in: ${checkedIn.first_name} ${checkedIn.last_name}`}
        >
          {alert ? (
            <div className="flex items-center gap-2 mb-4">
              <alert.icon className="w-5 h-5" aria-hidden="true" />
              <span className="font-semibold">{alert.msg}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 mb-4 text-status-success">
              <CheckCircle className="w-5 h-5" aria-hidden="true" />
              <span className="font-semibold">Accès autorisé</span>
            </div>
          )}
          <div className="flex items-center gap-5">
            <div
              className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-white text-2xl font-bold"
              aria-hidden="true"
            >
              {checkedIn.photoInitials}
            </div>
            <div>
              <p className="text-white text-xl font-bold">{checkedIn.first_name} {checkedIn.last_name}</p>
              <p className="text-text-secondary text-sm mt-0.5">{checkedIn.plan}</p>
              <p className="text-text-muted text-xs mt-1">Expire le {checkedIn.expiry}</p>
            </div>
          </div>
        </div>
      )}

      {/* Recent check-ins */}
      <section className="glass-card p-6" aria-label="Recent check-ins" aria-live="polite">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-gold-400" aria-hidden="true" />
          Accès récents
        </h2>
        {recentEntries.length === 0 ? (
          <div className="flex items-center gap-3 py-4">
            <User className="w-8 h-8 text-text-muted" aria-hidden="true" />
            <p className="text-text-secondary text-sm">Aucun accès enregistré aujourd'hui</p>
          </div>
        ) : (
          <ul className="space-y-2" role="list">
            {recentEntries.map((entry) => (
              <li key={entry.id} className="flex items-center gap-3">
                <div
                  className="w-2 h-2 rounded-full bg-status-success flex-shrink-0"
                  aria-hidden="true"
                />
                <span className="text-white text-sm flex-1">{entry.name}</span>
                <span className="text-text-muted text-xs">{entry.time}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
