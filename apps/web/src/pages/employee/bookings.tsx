import { useState, useCallback } from "react";
import { Calendar, Users, X, Plus } from "lucide-react";
import { useClasses } from "@/hooks/useClasses";
import { useClassBookings, useCreateBooking, useCancelBooking } from "@/hooks/useBookings";
import { useMembers } from "@/hooks/useMembers";
import { useAuthStore } from "@/stores/authStore";
import { SearchInput } from "@/components/ui/SearchInput";
import { StatusBadge } from "@/components/ui/StatusBadge";

type SelectedClass = { id: string; name: string; capacity: number };

function BookingList({ classId, capacity }: { classId: string; capacity: number }) {
  const { data: bookings, isLoading } = useClassBookings(classId);
  const { mutateAsync: cancelBooking } = useCancelBooking();

  if (isLoading) {
    return <div className="h-24 rounded bg-neutral-700 animate-pulse" />;
  }

  return (
    <div>
      <p className="text-text-secondary text-sm mb-3">
        {bookings?.length ?? 0}/{capacity} places réservées
      </p>
      <ul className="space-y-2" role="list">
        {(bookings ?? []).map((b) => {
          const p = (b as { members?: { user_profiles?: { first_name?: string; last_name?: string } } }).members?.user_profiles;
          return (
            <li key={b.id} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gold-400/10 flex items-center justify-center text-gold-400 text-xs font-bold">
                {p?.first_name?.charAt(0) ?? "?"}
              </div>
              <span className="flex-1 text-white text-sm">
                {p?.first_name ?? "—"} {p?.last_name ?? ""}
              </span>
              <StatusBadge status={b.status} />
              <button
                type="button"
                onClick={() => cancelBooking(b.id)}
                className="p-1 text-text-muted hover:text-status-error transition-colors rounded"
                aria-label={`Annuler la réservation de ${p?.first_name ?? "ce membre"}`}
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </li>
          );
        })}
        {(bookings?.length ?? 0) === 0 && (
          <li className="text-text-secondary text-sm">Aucune réservation</li>
        )}
      </ul>
    </div>
  );
}

function AddBookingPanel({ classId, onDone }: { classId: string; onDone: () => void }) {
  const [search, setSearch] = useState("");
  const { data: members, isLoading } = useMembers({ search: search || undefined });
  const { mutateAsync: createBooking, isPending } = useCreateBooking();

  const handleSearch = useCallback((v: string) => setSearch(v), []);

  const book = async (memberId: string) => {
    await createBooking({ classId, memberId });
    onDone();
  };

  return (
    <div className="space-y-3">
      <SearchInput
        placeholder="Rechercher un membre..."
        onSearch={handleSearch}
        aria-label="Rechercher un membre à inscrire"
      />
      {search.length >= 2 && (
        <ul className="space-y-1 max-h-48 overflow-y-auto" role="list">
          {isLoading ? (
            <li className="text-text-secondary text-sm px-2">Recherche…</li>
          ) : (members ?? []).length === 0 ? (
            <li className="text-text-secondary text-sm px-2">Aucun membre trouvé</li>
          ) : (
            (members ?? []).slice(0, 8).map((m) => {
              const p = (m as { user_profiles?: { first_name?: string; last_name?: string } }).user_profiles;
              return (
                <li key={m.id}>
                  <button
                    type="button"
                    onClick={() => book(m.id)}
                    disabled={isPending}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-left disabled:opacity-50"
                    aria-label={`Inscrire ${p?.first_name ?? "membre"} ${p?.last_name ?? ""}`}
                  >
                    <span className="text-white text-sm flex-1">
                      {p?.first_name ?? "—"} {p?.last_name ?? ""}
                    </span>
                    <Plus className="w-4 h-4 text-gold-400" aria-hidden="true" />
                  </button>
                </li>
              );
            })
          )}
        </ul>
      )}
    </div>
  );
}

export default function BookingsPage() {
  const { profile } = useAuthStore();
  const locationId = profile?.location_id ?? undefined;
  const today = new Date().toISOString().split("T")[0];

  const { data: classes, isLoading } = useClasses({ locationId, date: today });
  const [selectedClass, setSelectedClass] = useState<SelectedClass | null>(null);
  const [addMode, setAddMode] = useState(false);

  return (
    <div className="p-6 space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-white">Réservations</h1>
        <p className="text-text-secondary mt-1">
          Gérer les réservations du {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Class list */}
        <section aria-label="Today's classes">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gold-400" aria-hidden="true" />
            Cours aujourd'hui
          </h2>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-16 rounded-xl bg-neutral-700 animate-pulse" />
              ))}
            </div>
          ) : (classes ?? []).length === 0 ? (
            <p className="text-text-secondary text-sm">Aucun cours aujourd'hui.</p>
          ) : (
            <ul className="space-y-2" role="list">
              {(classes ?? []).map((cls) => (
                <li key={cls.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedClass({ id: cls.id, name: cls.name, capacity: cls.capacity });
                      setAddMode(false);
                    }}
                    aria-pressed={selectedClass?.id === cls.id}
                    className={`w-full text-left rounded-xl border p-4 transition-all ${
                      selectedClass?.id === cls.id
                        ? "border-gold-400 bg-gold-400/5"
                        : "border-border bg-surface-card hover:border-neutral-500"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">{cls.name}</p>
                        <p className="text-text-muted text-xs">
                          {new Date(cls.starts_at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                          {" – "}
                          {new Date(cls.ends_at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-text-secondary text-sm">
                        <Users className="w-4 h-4" aria-hidden="true" />
                        <span>0/{cls.capacity}</span>
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Booking detail panel */}
        {selectedClass && (
          <section aria-label={`Réservations: ${selectedClass.name}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">{selectedClass.name}</h2>
              <button
                type="button"
                onClick={() => setAddMode((v) => !v)}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-gold-400 text-black text-sm font-semibold rounded-lg hover:bg-gold-300 transition-colors"
                aria-label="Ajouter une réservation"
              >
                <Plus className="w-4 h-4" aria-hidden="true" />
                Ajouter
              </button>
            </div>

            {addMode && (
              <div className="glass-card p-4 mb-4">
                <h3 className="text-sm font-semibold text-white mb-3">Inscrire un membre</h3>
                <AddBookingPanel
                  classId={selectedClass.id}
                  onDone={() => setAddMode(false)}
                />
              </div>
            )}

            <div className="glass-card p-4">
              <BookingList classId={selectedClass.id} capacity={selectedClass.capacity} />
            </div>
          </section>
        )}

        {!selectedClass && (
          <div className="glass-card p-8 flex items-center justify-center">
            <p className="text-text-secondary text-sm text-center">
              Sélectionnez un cours pour voir les réservations
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
