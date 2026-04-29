import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Plus, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SearchInput } from "@/components/ui/SearchInput";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Column } from "@/components/ui/DataTable";

type UserProfile = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  is_active: boolean;
  location_id?: string;
  last_sign_in_at?: string;
};

const ROLES = ["all", "admin", "manager", "employee", "teacher", "client", "visitor"] as const;
type RoleFilter = (typeof ROLES)[number];

function useUserProfiles(search: string, roleFilter: RoleFilter) {
  return useQuery({
    queryKey: ["admin", "user-profiles", search, roleFilter],
    queryFn: async () => {
      let query = supabase
        .from("user_profiles")
        .select("*")
        .order("first_name");

      if (roleFilter !== "all") {
        query = query.eq("role", roleFilter);
      }
      if (search) {
        query = query.or(
          `first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%`,
        );
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []) as UserProfile[];
    },
    staleTime: 2 * 60 * 1000,
  });
}

const ROLE_COLORS: Record<string, string> = {
  admin: "bg-status-error/15 text-status-error",
  manager: "bg-gold-400/15 text-gold-400",
  employee: "bg-status-info/15 text-status-info",
  teacher: "bg-status-warning/15 text-status-warning",
  client: "bg-status-success/15 text-status-success",
  visitor: "bg-neutral-700/50 text-neutral-400",
};

export default function UsersListPage() {
  const { t } = useTranslation(["common"]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");

  const { data: users, isLoading } = useUserProfiles(search, roleFilter);

  const handleSearch = useCallback((val: string) => setSearch(val), []);

  const columns: Column<UserProfile>[] = [
    {
      key: "first_name",
      label: "Nom",
      sortable: true,
      render: (u) => (
        <Link
          to={`/admin/users/${u.id}`}
          className="font-medium text-white hover:text-gold-400 transition-colors"
        >
          {u.first_name} {u.last_name}
        </Link>
      ),
    },
    { key: "email", label: "Email", sortable: true },
    {
      key: "role",
      label: "Rôle",
      render: (u) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ROLE_COLORS[u.role] ?? "bg-neutral-700/50 text-neutral-400"}`}>
          {u.role}
        </span>
      ),
    },
    {
      key: "is_active",
      label: "Statut",
      render: (u) => <StatusBadge status={u.is_active ? "active" : "inactive"} label={u.is_active ? "Actif" : "Inactif"} />,
    },
    {
      key: "last_sign_in_at",
      label: "Dernière connexion",
      render: (u) =>
        u.last_sign_in_at
          ? new Date(u.last_sign_in_at).toLocaleDateString("fr-FR")
          : "—",
    },
    {
      key: "actions",
      label: "",
      render: (u) => (
        <Link
          to={`/admin/users/${u.id}`}
          className="text-xs text-gold-400 hover:text-gold-300 transition-colors font-medium"
          aria-label={`Voir ${u.first_name} ${u.last_name}`}
        >
          Voir
        </Link>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Utilisateurs</h1>
          <p className="text-text-secondary text-sm mt-1">
            {users?.length ?? 0} utilisateur{(users?.length ?? 0) !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          to="/admin/users/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-gold-400 text-black text-sm font-semibold rounded-lg hover:bg-gold-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gold-400/50"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          Créer un utilisateur
        </Link>
      </header>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <SearchInput
          placeholder="Rechercher par nom ou email..."
          onSearch={handleSearch}
          className="flex-1 max-w-sm"
          aria-label="Rechercher un utilisateur"
        />
        <div>
          <label htmlFor="role-filter" className="sr-only">Filtrer par rôle</label>
          <select
            id="role-filter"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as RoleFilter)}
            className="px-3 py-2 bg-surface-card border border-border rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-gold-400/50"
            aria-label="Filtrer par rôle"
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>{r === "all" ? "Tous les rôles" : r}</option>
            ))}
          </select>
        </div>
      </div>

      {!isLoading && (users?.length ?? 0) === 0 && search === "" && roleFilter === "all" ? (
        <EmptyState icon={Users} title="Aucun utilisateur" description="Les utilisateurs apparaîtront ici." />
      ) : (
        <DataTable
          columns={columns}
          data={users ?? []}
          isLoading={isLoading}
          emptyMessage="Aucun utilisateur trouvé"
        />
      )}
    </div>
  );
}
