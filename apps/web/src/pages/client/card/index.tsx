import { useState } from "react";
import { useTranslation } from "react-i18next";
import { QrCode, Download, Eye, EyeOff, CreditCard } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

function QRPlaceholder({ value }: { value: string }) {
  // SVG-based QR placeholder showing a bordered square with the value hint
  return (
    <div className="w-64 h-64 bg-white rounded-2xl flex flex-col items-center justify-center p-4 gap-2">
      <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        {/* Corner markers */}
        <rect x="10" y="10" width="50" height="50" rx="4" fill="none" stroke="#000" strokeWidth="8" />
        <rect x="22" y="22" width="26" height="26" rx="2" fill="#000" />
        <rect x="140" y="10" width="50" height="50" rx="4" fill="none" stroke="#000" strokeWidth="8" />
        <rect x="152" y="22" width="26" height="26" rx="2" fill="#000" />
        <rect x="10" y="140" width="50" height="50" rx="4" fill="none" stroke="#000" strokeWidth="8" />
        <rect x="22" y="152" width="26" height="26" rx="2" fill="#000" />
        {/* Data dots pattern */}
        {[70,80,90,100,110,120,130].map((x) =>
          [70,80,90,100,110,120,130].map((y) => {
            const hash = (x * 17 + y * 31 + value.charCodeAt(0)) % 3;
            return hash === 0 ? <rect key={`${x}-${y}`} x={x} y={y} width="8" height="8" fill="#000" /> : null;
          })
        )}
        {/* Center logo hint */}
        <circle cx="100" cy="100" r="14" fill="white" />
        <text x="100" y="105" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#F5A623">G</text>
      </svg>
      <p className="text-neutral-400 text-xs font-mono truncate max-w-full">{value.slice(0, 20)}</p>
    </div>
  );
}

export default function ClientCard() {
  const { t } = useTranslation(["common"]);
  const user = useAuthStore((s) => s.user);
  const [visible, setVisible] = useState(true);

  const { data: card, isLoading } = useQuery({
    queryKey: ["membership-card", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      // Get member profile
      const { data: member } = await supabase
        .from("members")
        .select("id, membership_cards(*), membership_plans(name), subscriptions(status, current_period_end)")
        .eq("user_id", user.id)
        .maybeSingle();
      return member;
    },
    enabled: !!user?.id,
  });

  const memberCard = (card as { membership_cards?: Array<{ card_number: string; qr_code_data: string; is_active: boolean; expiry_date?: string }> } | null)?.membership_cards?.[0];
  const planName = (card as { membership_plans?: { name: string } } | null)?.membership_plans?.name ?? "Member";
  const subStatus = (card as { subscriptions?: Array<{ status: string; current_period_end?: string }> } | null)?.subscriptions?.[0];

  if (isLoading) {
    return <div className="p-6"><div className="h-96 bg-surface-card rounded-2xl animate-pulse" /></div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <QrCode className="w-6 h-6 text-gold-400" />
        <h1 className="text-2xl font-bold text-white">{t("nav.myCard")}</h1>
      </div>

      {/* Card design */}
      <div className="max-w-sm mx-auto">
        <div className="bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 border border-gold-400/30 rounded-3xl p-6 space-y-6 shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gold-400 font-bold text-lg tracking-wide">GOLD'S GYM</p>
              <p className="text-neutral-400 text-xs uppercase tracking-widest">France</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gold-400/20 border border-gold-400/40 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-gold-400" />
            </div>
          </div>

          {/* QR code */}
          <div className="flex justify-center">
            {visible ? (
              <QRPlaceholder value={memberCard?.qr_code_data ?? memberCard?.card_number ?? user?.id ?? "MEMBER"} />
            ) : (
              <div className="w-64 h-64 bg-neutral-800 rounded-2xl flex items-center justify-center border border-neutral-700">
                <EyeOff className="w-12 h-12 text-neutral-600" />
              </div>
            )}
          </div>

          {/* Member info */}
          <div className="space-y-1">
            <p className="text-white font-bold text-lg">{user?.email?.split("@")[0] ?? "Member"}</p>
            <p className="text-gold-400 text-sm font-medium">{planName}</p>
            {memberCard?.card_number && (
              <p className="text-neutral-500 text-xs font-mono">{memberCard.card_number}</p>
            )}
            {memberCard?.expiry_date && (
              <p className="text-neutral-500 text-xs">
                Valid until {new Date(memberCard.expiry_date).toLocaleDateString("fr-FR")}
              </p>
            )}
            {subStatus?.status && (
              <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-semibold ${subStatus.status === "active" ? "bg-green-400/10 text-green-400" : "bg-neutral-700 text-neutral-400"}`}>
                {subStatus.status}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => setVisible((v) => !v)}
            className="flex-1 flex items-center justify-center gap-2 py-3 border border-neutral-800 text-neutral-300 rounded-xl hover:border-neutral-600 transition-colors text-sm"
          >
            {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {visible ? "Hide QR" : "Show QR"}
          </button>
          <button
            className="flex-1 flex items-center justify-center gap-2 py-3 border border-gold-400/40 text-gold-400 rounded-xl hover:bg-gold-400/10 transition-colors text-sm"
          >
            <Download className="w-4 h-4" /> Save card
          </button>
        </div>
        <p className="text-center text-neutral-600 text-xs mt-3">
          Present this QR code at the gym entrance for quick check-in.
        </p>
      </div>
    </div>
  );
}
