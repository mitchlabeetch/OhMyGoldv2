import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Calendar,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  Users,
  ChevronRight,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

type BookingStatus = "booked" | "waitlisted" | "held" | "cancelled" | "attended" | "no_show";

const STATUS_STYLES: Record<BookingStatus, string> = {
  booked:     "bg-status-success/10 text-status-success border-status-success/30",
  waitlisted: "bg-status-warning/10 text-status-warning border-status-warning/30",
  held:       "bg-blue-500/10 text-blue-400 border-blue-500/30",
  cancelled:  "bg-neutral-700/50 text-neutral-400 border-neutral-600",
  attended:   "bg-status-success/10 text-status-success border-status-success/30",
  no_show:    "bg-status-error/10 text-status-error border-status-error/30",
};

const STATUS_ICONS: Record<BookingStatus, typeof CheckCircle2> = {
  booked:     CheckCircle2,
  waitlisted: Clock,
  held:       Clock,
  cancelled:  XCircle,
  attended:   CheckCircle2,
  no_show:    XCircle,
};

export default function ManagerBookings() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "all">("all");

  const { data: bookings, isLoading } = useQuery({
    queryKey: ["manager-bookings", statusFilter],
    queryFn: async () => {
      let q = supabase
        .from("bookings")
        .select(
          "id, status, waitlist_position, booked_at, created_at, " +
          "members!inner(id, user_profiles!inner(first_name, last_name, email)), " +
          "gym_classes!inner(id, name, scheduled_at, coach_id, max_capacity, current_bookings)"
        )
        .order("booked_at", { ascending: false })
        .limit(100);

      if (statusFilter !== "all") q = q.eq("status", statusFilter);
      const { data, error } = await q;
      if (error) throw error;
      return data ?? [];
    },
  });

  const filtered = (bookings ?? []).filter((b) => {
    if (!search) return true;
    const member = b.members as { user_profiles: { first_name: string; last_name: string; email: string } };
    const p = member.user_profiles;
    const fullName = `${p.first_name} ${p.last_name}`.toLowerCase();
    const cls = b.gym_classes as { name: string };
    return fullName.includes(search.toLowerCase()) || cls.name.toLowerCase().includes(search.toLowerCase()) || p.email.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="py-8 px-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gold-500/10">
            <Calendar className="w-5 h-5 text-gold-400" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Booking Management</h1>
            <p className="text-text-secondary text-sm">
              View, override, and manage class bookings and waitlists
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-text-muted">
          <Users className="w-4 h-4" aria-hidden="true" />
          {bookings?.length ?? 0} total
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" aria-hidden="true" />
          <input
            className="w-full pl-9 pr-4 py-2 bg-surface-elevated border border-border rounded-lg text-sm text-white placeholder-text-muted focus:ring-2 focus:ring-gold-500/50 outline-none"
            placeholder="Search by member name, email, or class…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" aria-hidden="true" />
          <select
            className="pl-9 pr-8 py-2 bg-surface-elevated border border-border rounded-lg text-sm text-white focus:ring-2 focus:ring-gold-500/50 outline-none appearance-none"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as BookingStatus | "all")}
          >
            <option value="all">All statuses</option>
            <option value="booked">Booked</option>
            <option value="waitlisted">Waitlisted</option>
            <option value="held">Held</option>
            <option value="attended">Attended</option>
            <option value="cancelled">Cancelled</option>
            <option value="no_show">No show</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface-card rounded-xl border border-border overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-text-muted text-sm">
            Loading bookings…
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-2">
            <Calendar className="w-8 h-8 text-text-muted" aria-hidden="true" />
            <p className="text-text-muted text-sm">No bookings found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-elevated">
                  <th className="text-left px-4 py-3 text-text-secondary font-semibold">Member</th>
                  <th className="text-left px-4 py-3 text-text-secondary font-semibold">Class</th>
                  <th className="text-left px-4 py-3 text-text-secondary font-semibold">Date</th>
                  <th className="text-left px-4 py-3 text-text-secondary font-semibold">Status</th>
                  <th className="text-left px-4 py-3 text-text-secondary font-semibold">Booked at</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filtered.map((b) => {
                  const member = b.members as { user_profiles: { first_name: string; last_name: string; email: string } };
                  const cls = b.gym_classes as { id: string; name: string; scheduled_at: string; max_capacity: number; current_bookings: number };
                  const status = b.status as BookingStatus;
                  const Icon = STATUS_ICONS[status] ?? CheckCircle2;
                  return (
                    <tr key={b.id} className="hover:bg-surface-elevated/40 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-medium text-white">
                          {member.user_profiles.first_name} {member.user_profiles.last_name}
                        </div>
                        <div className="text-xs text-text-muted">{member.user_profiles.email}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-white">{cls.name}</div>
                        <div className="text-xs text-text-muted">
                          {cls.current_bookings}/{cls.max_capacity} spots
                        </div>
                      </td>
                      <td className="px-4 py-3 text-text-secondary">
                        {new Date(cls.scheduled_at).toLocaleDateString("fr-FR", {
                          day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
                        })}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-xs font-semibold ${STATUS_STYLES[status]}`}>
                          <Icon className="w-3 h-3" aria-hidden="true" />
                          {status}
                          {status === "waitlisted" && b.waitlist_position
                            ? ` #${b.waitlist_position}`
                            : ""}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-text-muted text-xs">
                        {b.booked_at
                          ? new Date(b.booked_at).toLocaleDateString("fr-FR")
                          : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <ChevronRight className="w-4 h-4 text-text-muted" aria-hidden="true" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
