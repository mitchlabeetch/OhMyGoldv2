import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Plus, MapPin } from "lucide-react";
import { useLocations } from "@/hooks/useLocations";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SearchInput } from "@/components/ui/SearchInput";
import { EmptyState } from "@/components/ui/EmptyState";
import type { GymLocation } from "@/hooks/useLocations";
import type { Column } from "@/components/ui/DataTable";

export default function LocationsListPage() {
  const { t } = useTranslation(["common"]);
  const { data: locations, isLoading } = useLocations();
  const [search, setSearch] = useState("");

  const handleSearch = useCallback((val: string) => setSearch(val), []);

  const filtered = (locations ?? []).filter(
    (loc) =>
      loc.name.toLowerCase().includes(search.toLowerCase()) ||
      loc.city.toLowerCase().includes(search.toLowerCase()),
  );

  const columns: Column<GymLocation>[] = [
    {
      key: "name",
      label: "Nom",
      sortable: true,
      render: (loc) => (
        <Link
          to={`/admin/locations/${loc.id}`}
          className="font-medium text-white hover:text-gold-400 transition-colors"
        >
          {loc.name}
        </Link>
      ),
    },
    { key: "city", label: "Ville", sortable: true },
    {
      key: "is_active",
      label: "Statut",
      render: (loc) => <StatusBadge status={loc.is_active ? "active" : "inactive"} label={loc.is_active ? "Actif" : "Inactif"} />,
    },
    { key: "phone", label: "Téléphone", render: (loc) => loc.phone ?? "—" },
    {
      key: "actions",
      label: "",
      render: (loc) => (
        <div className="flex items-center gap-2 justify-end">
          <Link
            to={`/admin/locations/${loc.id}`}
            className="text-xs text-gold-400 hover:text-gold-300 transition-colors font-medium"
            aria-label={`Voir ${loc.name}`}
          >
            Voir
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Clubs</h1>
          <p className="text-text-secondary text-sm mt-1">
            {filtered.length} club{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          to="/admin/locations/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-gold-400 text-black text-sm font-semibold rounded-lg hover:bg-gold-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gold-400/50"
          aria-label="Ajouter un club"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          Ajouter un club
        </Link>
      </header>

      <div className="flex gap-3">
        <SearchInput
          placeholder="Rechercher un club..."
          onSearch={handleSearch}
          className="flex-1 max-w-sm"
          aria-label="Rechercher un club"
        />
      </div>

      {!isLoading && filtered.length === 0 && search === "" ? (
        <EmptyState
          icon={MapPin}
          title="Aucun club"
          description="Ajoutez votre premier club pour commencer."
          action={{ label: "Ajouter un club", onClick: () => { window.location.href = "/admin/locations/new"; } }}
        />
      ) : (
        <DataTable
          columns={columns}
          data={filtered}
          isLoading={isLoading}
          emptyMessage={search ? "Aucun club trouvé" : "Aucun club"}
        />
      )}
    </div>
  );
}
