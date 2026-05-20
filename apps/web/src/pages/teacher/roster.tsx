import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Users, Search } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useClasses } from "@/hooks/useClasses";
import { useClassBookings } from "@/hooks/useBookings";

export default function TeacherRoster() {
  const { t } = useTranslation(["common"]);
  const user = useAuthStore((s) => s.user);
  const [search, setSearch] = useState("");
  const { data: classes = [] } = useClasses({ teacherId: user?.id });

  const classIds = classes.map((c: { id: string }) => c.id);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-gold-400" />
          <h1 className="text-2xl font-bold text-white">{t("nav.members")}</h1>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
        <input
          className="w-full pl-10 pr-4 py-2 bg-surface-card border border-neutral-800 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-gold-400"
          placeholder={t("members.search", { ns: "members" }) ?? "Search members..."}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="bg-surface-card rounded-xl border border-neutral-800 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-800">
              <th className="text-left p-4 text-neutral-400 font-medium">{t("members.table.name", { ns: "members" })}</th>
              <th className="text-left p-4 text-neutral-400 font-medium hidden md:table-cell">Email</th>
              <th className="text-left p-4 text-neutral-400 font-medium hidden lg:table-cell">{t("nav.classes")}</th>
            </tr>
          </thead>
          <tbody>
            {classIds.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-8 text-center text-neutral-500">
                  No classes assigned yet.
                </td>
              </tr>
            ) : (
              <tr>
                <td colSpan={3} className="p-8 text-center text-neutral-500">
                  {classes.length} classe(s) — roster data loads from bookings.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
