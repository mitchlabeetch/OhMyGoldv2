import { Fragment } from "react";
import { Shield, CheckCircle2, XCircle } from "lucide-react";

const ROLES = [
  "super_admin",
  "admin",
  "manager",
  "employee",
  "teacher",
  "client",
  "visitor",
] as const;
type Role = (typeof ROLES)[number];

const PERMISSIONS: {
  id: string;
  label: string;
  category: string;
  allowed: Role[];
}[] = [
  // Users
  {
    id: "users.read",
    label: "View users",
    category: "Users",
    allowed: ["super_admin", "admin", "manager"],
  },
  {
    id: "users.write",
    label: "Manage users",
    category: "Users",
    allowed: ["super_admin", "admin"],
  },
  // Locations
  {
    id: "locations.read",
    label: "View locations",
    category: "Locations",
    allowed: [
      "super_admin",
      "admin",
      "manager",
      "employee",
      "teacher",
      "client",
    ],
  },
  {
    id: "locations.write",
    label: "Manage locations",
    category: "Locations",
    allowed: ["super_admin", "admin"],
  },
  // Classes
  {
    id: "classes.read",
    label: "View classes",
    category: "Classes",
    allowed: [
      "super_admin",
      "admin",
      "manager",
      "employee",
      "teacher",
      "client",
      "visitor",
    ],
  },
  {
    id: "classes.write",
    label: "Manage classes",
    category: "Classes",
    allowed: ["super_admin", "admin", "manager", "teacher"],
  },
  // Bookings
  {
    id: "bookings.read",
    label: "View bookings",
    category: "Bookings",
    allowed: ["super_admin", "admin", "manager", "employee"],
  },
  {
    id: "bookings.write",
    label: "Manage bookings",
    category: "Bookings",
    allowed: ["super_admin", "admin", "manager", "employee"],
  },
  {
    id: "bookings.own",
    label: "Book own classes",
    category: "Bookings",
    allowed: [
      "super_admin",
      "admin",
      "manager",
      "employee",
      "teacher",
      "client",
    ],
  },
  // Members
  {
    id: "members.read",
    label: "View members",
    category: "Members",
    allowed: ["super_admin", "admin", "manager", "employee"],
  },
  {
    id: "members.write",
    label: "Manage members",
    category: "Members",
    allowed: ["super_admin", "admin", "manager"],
  },
  // Billing
  {
    id: "billing.read",
    label: "View billing",
    category: "Billing",
    allowed: ["super_admin", "admin", "manager"],
  },
  {
    id: "billing.write",
    label: "Manage billing",
    category: "Billing",
    allowed: ["super_admin", "admin"],
  },
  // POS
  {
    id: "pos.use",
    label: "Use POS",
    category: "POS",
    allowed: ["super_admin", "admin", "manager", "employee"],
  },
  {
    id: "pos.refund",
    label: "Issue refunds",
    category: "POS",
    allowed: ["super_admin", "admin", "manager"],
  },
  // Inventory
  {
    id: "inventory.read",
    label: "View inventory",
    category: "Inventory",
    allowed: ["super_admin", "admin", "manager"],
  },
  {
    id: "inventory.write",
    label: "Manage inventory",
    category: "Inventory",
    allowed: ["super_admin", "admin", "manager"],
  },
  // Analytics
  {
    id: "analytics.read",
    label: "View analytics",
    category: "Analytics",
    allowed: ["super_admin", "admin", "manager"],
  },
  {
    id: "analytics.global",
    label: "Global analytics",
    category: "Analytics",
    allowed: ["super_admin", "admin"],
  },
  // Settings
  {
    id: "settings.read",
    label: "View settings",
    category: "Settings",
    allowed: ["super_admin", "admin"],
  },
  {
    id: "settings.write",
    label: "Manage settings",
    category: "Settings",
    allowed: ["super_admin", "admin"],
  },
];

const ROLE_LABELS: Record<Role, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  manager: "Manager",
  employee: "Employee",
  teacher: "Teacher",
  client: "Client",
  visitor: "Visitor",
};

const categories = [...new Set(PERMISSIONS.map((p) => p.category))];

export default function AdminRoles() {
  return (
    <div className="py-8 px-4 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-gold-500/10">
          <Shield className="w-5 h-5 text-gold-400" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Roles & Permissions</h1>
          <p className="text-text-secondary text-sm">
            Read-only permission matrix. All permissions are enforced at the
            database level via Row Level Security.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface-elevated border-b border-border">
              <th className="text-left px-4 py-3 text-text-secondary font-semibold min-w-[200px]">
                Permission
              </th>
              {ROLES.map((role) => (
                <th
                  key={role}
                  className="px-3 py-3 text-center text-text-secondary font-semibold whitespace-nowrap"
                >
                  {ROLE_LABELS[role]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <Fragment key={cat}>
                <tr key={`cat-${cat}`} className="bg-surface-card/50">
                  <td
                    colSpan={ROLES.length + 1}
                    className="px-4 py-2 text-xs font-bold text-gold-400 uppercase tracking-wider"
                  >
                    {cat}
                  </td>
                </tr>
                {PERMISSIONS.filter((p) => p.category === cat).map((perm) => (
                  <tr
                    key={perm.id}
                    className="border-t border-border/50 hover:bg-surface-elevated/40 transition-colors"
                  >
                    <td className="px-4 py-2.5 text-text-secondary">
                      {perm.label}
                    </td>
                    {ROLES.map((role) => {
                      const allowed = perm.allowed.includes(role);
                      return (
                        <td key={role} className="px-3 py-2.5 text-center">
                          {allowed ? (
                            <CheckCircle2
                              className="w-4 h-4 text-status-success inline"
                              aria-label={`${ROLE_LABELS[role]} can ${perm.label}`}
                            />
                          ) : (
                            <XCircle
                              className="w-4 h-4 text-neutral-600 inline"
                              aria-label={`${ROLE_LABELS[role]} cannot ${perm.label}`}
                            />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-text-muted">
        Permissions are enforced by PostgreSQL Row Level Security policies. This
        matrix reflects the current policy definitions. Changes require a
        database migration.
      </p>
    </div>
  );
}
