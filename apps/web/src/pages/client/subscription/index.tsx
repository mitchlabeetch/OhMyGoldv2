import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CreditCard, Pause, TrendingUp, X, Calendar, AlertCircle, CheckCircle } from "lucide-react";
import { useSubscription, useSubscriptionHistory, useFreezeSubscription, useCancelSubscription, useUpgradeSubscription } from "@/hooks/useSubscriptions";
import { useAuthStore } from "@/stores/authStore";
import { useMembershipPlans } from "@/hooks/usePlans";

function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-surface-card border border-neutral-800 rounded-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <button onClick={onClose} className="text-neutral-400 hover:text-white p-1"><X className="w-5 h-5" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default function ClientSubscription() {
  const { t } = useTranslation(["common"]);
  const { profile } = useAuthStore();
  const memberId = (profile as { member_id?: string } | null)?.member_id ?? "";

  const { data: subscription, isLoading } = useSubscription(memberId);
  const { data: history = [] } = useSubscriptionHistory(memberId);
  const { data: plans = [] } = useMembershipPlans();
  const freezeMut = useFreezeSubscription();
  const cancelMut = useCancelSubscription();
  const upgradeMut = useUpgradeSubscription();

  const [modal, setModal] = useState<"freeze" | "cancel" | "upgrade" | null>(null);
  const [freezeUntil, setFreezeUntil] = useState("");
  const [freezeReason, setFreezeReason] = useState("");
  const [cancelReason, setCancelReason] = useState("");
  const [selectedPlanId, setSelectedPlanId] = useState("");

  const sub = subscription as {
    id: string;
    status: string;
    current_period_end?: string;
    next_billing_date?: string;
    membership_plans?: { name: string; price: number; billing_interval: string; features: Record<string, boolean> };
  } | null | undefined;

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        {[1, 2, 3].map((i) => <div key={i} className="h-24 bg-surface-card rounded-xl animate-pulse" />)}
      </div>
    );
  }

  if (!sub) {
    return (
      <div className="p-6">
        <div className="text-center py-16">
          <CreditCard className="w-12 h-12 mx-auto mb-3 text-neutral-600" />
          <p className="text-neutral-400 mb-4">No active subscription found.</p>
        </div>
      </div>
    );
  }

  const statusColor = sub.status === "active" ? "text-green-400 bg-green-400/10" : sub.status === "frozen" ? "text-blue-400 bg-blue-400/10" : "text-red-400 bg-red-400/10";

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <CreditCard className="w-6 h-6 text-gold-400" />
        <h1 className="text-2xl font-bold text-white">{t("nav.subscription")}</h1>
      </div>

      {/* Current plan card */}
      <div className="bg-gradient-to-br from-gold-400/20 to-gold-400/5 border border-gold-400/30 rounded-2xl p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <p className="text-neutral-400 text-sm mb-1">Current Plan</p>
            <h2 className="text-2xl font-bold text-white">{sub.membership_plans?.name ?? "Plan"}</h2>
            <p className="text-gold-400 font-semibold mt-1">
              {sub.membership_plans?.price?.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}{" "}
              <span className="text-sm text-neutral-400">/ {sub.membership_plans?.billing_interval ?? "month"}</span>
            </p>
          </div>
          <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${statusColor}`}>
            {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
          </span>
        </div>

        {sub.next_billing_date && (
          <div className="flex items-center gap-2 text-sm text-neutral-400">
            <Calendar className="w-4 h-4" />
            Next billing: {new Date(sub.next_billing_date).toLocaleDateString("fr-FR")}
          </div>
        )}

        {/* Features */}
        {sub.membership_plans?.features && Object.keys(sub.membership_plans.features).length > 0 && (
          <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 gap-2">
            {Object.entries(sub.membership_plans.features).map(([key, val]) => (
              <div key={key} className="flex items-center gap-2 text-sm">
                <CheckCircle className={`w-4 h-4 ${val ? "text-green-400" : "text-neutral-600"}`} />
                <span className={val ? "text-white" : "text-neutral-600"}>{key.replace(/_/g, " ")}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      {sub.status === "active" && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => setModal("freeze")}
            className="flex items-center justify-center gap-2 py-3 px-4 border border-blue-500/40 text-blue-400 rounded-xl hover:bg-blue-500/10 transition-colors"
          >
            <Pause className="w-4 h-4" /> Freeze
          </button>
          <button
            onClick={() => setModal("upgrade")}
            className="flex items-center justify-center gap-2 py-3 px-4 border border-gold-400/40 text-gold-400 rounded-xl hover:bg-gold-400/10 transition-colors"
          >
            <TrendingUp className="w-4 h-4" /> Upgrade
          </button>
          <button
            onClick={() => setModal("cancel")}
            className="flex items-center justify-center gap-2 py-3 px-4 border border-red-500/40 text-red-400 rounded-xl hover:bg-red-500/10 transition-colors"
          >
            <X className="w-4 h-4" /> Cancel
          </button>
        </div>
      )}

      {/* Billing history */}
      {(history as unknown[]).length > 0 && (
        <div className="bg-surface-card border border-neutral-800 rounded-xl overflow-hidden">
          <h3 className="text-white font-semibold p-4 border-b border-neutral-800">Billing History</h3>
          <div className="divide-y divide-neutral-800">
            {(history as Array<{ id: string; event_type: string; created_at: string; prorated_amount?: number }>).slice(0, 10).map((ev) => (
              <div key={ev.id} className="flex items-center justify-between p-4">
                <div>
                  <p className="text-white text-sm capitalize">{ev.event_type.replace(/_/g, " ")}</p>
                  <p className="text-neutral-500 text-xs">{new Date(ev.created_at).toLocaleDateString("fr-FR")}</p>
                </div>
                {ev.prorated_amount != null && (
                  <span className={`text-sm font-semibold ${ev.prorated_amount >= 0 ? "text-green-400" : "text-red-400"}`}>
                    {ev.prorated_amount >= 0 ? "+" : ""}
                    {ev.prorated_amount.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Freeze modal */}
      <Modal open={modal === "freeze"} onClose={() => setModal(null)} title="Freeze Subscription">
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 bg-blue-500/10 rounded-lg text-blue-400 text-sm">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <p>Your subscription will be paused and billing suspended until the date you select.</p>
          </div>
          <div>
            <label className="block text-sm text-neutral-400 mb-1">Freeze until</label>
            <input type="date" value={freezeUntil} onChange={(e) => setFreezeUntil(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white" />
          </div>
          <div>
            <label className="block text-sm text-neutral-400 mb-1">Reason (optional)</label>
            <input value={freezeReason} onChange={(e) => setFreezeReason(e.target.value)}
              placeholder="Vacation, injury..."
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white placeholder-neutral-600" />
          </div>
          <button
            disabled={!freezeUntil || freezeMut.isPending}
            onClick={() => { freezeMut.mutate({ subscriptionId: sub.id, freezeUntil, reason: freezeReason }, { onSuccess: () => setModal(null) }); }}
            className="w-full py-3 bg-blue-500 text-white font-semibold rounded-xl disabled:opacity-50 hover:bg-blue-600"
          >
            {freezeMut.isPending ? "Freezing…" : "Confirm Freeze"}
          </button>
        </div>
      </Modal>

      {/* Upgrade modal */}
      <Modal open={modal === "upgrade"} onClose={() => setModal(null)} title="Upgrade Plan">
        <div className="space-y-4">
          <div className="space-y-2">
            {(plans as Array<{ id: string; name: string; price: number; billing_interval: string }>).filter((p) => p.id !== sub.id).map((p) => (
              <button key={p.id} onClick={() => setSelectedPlanId(p.id)}
                className={`w-full flex items-center justify-between p-4 rounded-xl border transition-colors ${selectedPlanId === p.id ? "border-gold-400 bg-gold-400/10" : "border-neutral-800 hover:border-neutral-600"}`}>
                <span className="text-white font-medium">{p.name}</span>
                <span className="text-gold-400 font-semibold">{p.price?.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}/{p.billing_interval}</span>
              </button>
            ))}
          </div>
          <button
            disabled={!selectedPlanId || upgradeMut.isPending}
            onClick={() => { upgradeMut.mutate({ subscriptionId: sub.id, newPlanId: selectedPlanId }, { onSuccess: () => setModal(null) }); }}
            className="w-full py-3 bg-gold-400 text-black font-semibold rounded-xl disabled:opacity-50 hover:bg-gold-400/90"
          >
            {upgradeMut.isPending ? "Upgrading…" : "Confirm Upgrade"}
          </button>
        </div>
      </Modal>

      {/* Cancel modal */}
      <Modal open={modal === "cancel"} onClose={() => setModal(null)} title="Cancel Subscription">
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 bg-red-500/10 rounded-lg text-red-400 text-sm">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <p>Your access will remain active until the end of the current billing period.</p>
          </div>
          <div>
            <label className="block text-sm text-neutral-400 mb-1">Reason</label>
            <select value={cancelReason} onChange={(e) => setCancelReason(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white">
              <option value="">Select a reason…</option>
              <option value="moving">Moving away</option>
              <option value="cost">Cost</option>
              <option value="injury">Injury / health</option>
              <option value="schedule">Schedule conflict</option>
              <option value="other">Other</option>
            </select>
          </div>
          <button
            disabled={!cancelReason || cancelMut.isPending}
            onClick={() => { cancelMut.mutate({ subscriptionId: sub.id, reason: cancelReason }, { onSuccess: () => setModal(null) }); }}
            className="w-full py-3 bg-red-500 text-white font-semibold rounded-xl disabled:opacity-50 hover:bg-red-600"
          >
            {cancelMut.isPending ? "Cancelling…" : "Confirm Cancellation"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
