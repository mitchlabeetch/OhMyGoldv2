import { useState } from "react";
import { useTranslation } from "react-i18next";
import { User, Phone, Mail, MapPin, Target, Shield, Trash2, Download } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { supabase } from "@/lib/supabase";

const GOALS = ["muscle_gain", "weight_loss", "endurance", "flexibility", "stress_relief", "general_fitness", "rehabilitation"];

export default function ClientProfile() {
  const { t } = useTranslation(["common"]);
  const user = useAuthStore((s) => s.user);
  const profile = useAuthStore((s) => s.profile);
  const refreshProfile = useAuthStore((s) => s.refreshProfile);

  const [form, setForm] = useState({
    full_name: (profile as { full_name?: string } | null)?.full_name ?? "",
    phone: (profile as { phone?: string } | null)?.phone ?? "",
  });
  const [goals, setGoals] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [pwError, setPwError] = useState("");
  const [pwSaving, setPwSaving] = useState(false);

  const initials = (form.full_name || user?.email || "?").slice(0, 2).toUpperCase();

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await supabase.from("user_profiles").update({ full_name: form.full_name, phone: form.phone }).eq("id", user!.id);
    await refreshProfile?.();
    setSaved(true);
    setSaving(false);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwError("");
    if (pwForm.next !== pwForm.confirm) { setPwError("Passwords do not match."); return; }
    if (pwForm.next.length < 8) { setPwError("Password must be at least 8 characters."); return; }
    setPwSaving(true);
    const { error } = await supabase.auth.updateUser({ password: pwForm.next });
    setPwSaving(false);
    if (error) { setPwError(error.message); } else { setPwForm({ current: "", next: "", confirm: "" }); }
  }

  function toggleGoal(g: string) {
    setGoals((prev) => prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]);
  }

  return (
    <div className="p-6 space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <User className="w-6 h-6 text-gold-400" />
        <h1 className="text-2xl font-bold text-white">{t("nav.profile")}</h1>
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-gold-400/20 border-2 border-gold-400/40 flex items-center justify-center">
          <span className="text-2xl font-bold text-gold-400">{initials}</span>
        </div>
        <div>
          <p className="text-white font-semibold text-lg">{form.full_name || "Your Name"}</p>
          <p className="text-neutral-400 flex items-center gap-1.5 text-sm"><Mail className="w-3 h-3" />{user?.email}</p>
        </div>
      </div>

      {/* Profile form */}
      <form onSubmit={handleSaveProfile} className="bg-surface-card border border-neutral-800 rounded-xl p-5 space-y-4">
        <h2 className="text-white font-semibold">Personal Information</h2>
        <div>
          <label className="block text-sm text-neutral-400 mb-1">Full Name</label>
          <input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-gold-400"
            placeholder="Your full name" />
        </div>
        <div>
          <label className="block text-sm text-neutral-400 mb-1 flex items-center gap-1"><Phone className="w-3 h-3" /> Phone</label>
          <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-gold-400"
            placeholder="+33 6 00 00 00 00" type="tel" />
        </div>
        <button type="submit" disabled={saving}
          className="bg-gold-400 text-black font-semibold px-6 py-2.5 rounded-lg hover:bg-gold-400/90 disabled:opacity-50">
          {saved ? "✓ Saved" : saving ? "Saving…" : "Save Changes"}
        </button>
      </form>

      {/* Goals */}
      <div className="bg-surface-card border border-neutral-800 rounded-xl p-5 space-y-3">
        <h2 className="text-white font-semibold flex items-center gap-2"><Target className="w-4 h-4 text-gold-400" /> My Goals</h2>
        <div className="flex flex-wrap gap-2">
          {GOALS.map((g) => (
            <button key={g} onClick={() => toggleGoal(g)}
              className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${goals.includes(g) ? "bg-gold-400 border-gold-400 text-black font-semibold" : "border-neutral-700 text-neutral-400 hover:border-neutral-500"}`}>
              {g.replace(/_/g, " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Password change */}
      <form onSubmit={handleChangePassword} className="bg-surface-card border border-neutral-800 rounded-xl p-5 space-y-4">
        <h2 className="text-white font-semibold flex items-center gap-2"><Shield className="w-4 h-4 text-gold-400" /> Change Password</h2>
        {pwError && <p className="text-red-400 text-sm">{pwError}</p>}
        {["next", "confirm"].map((field) => (
          <div key={field}>
            <label className="block text-sm text-neutral-400 mb-1">
              {field === "next" ? "New Password" : "Confirm New Password"}
            </label>
            <input type="password" value={pwForm[field as "next" | "confirm"]}
              onChange={(e) => setPwForm({ ...pwForm, [field]: e.target.value })}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-gold-400" />
          </div>
        ))}
        <button type="submit" disabled={pwSaving}
          className="bg-neutral-800 border border-neutral-700 text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-neutral-700 disabled:opacity-50">
          {pwSaving ? "Updating…" : "Update Password"}
        </button>
      </form>

      {/* GDPR */}
      <div className="bg-surface-card border border-neutral-800 rounded-xl p-5 space-y-3">
        <h2 className="text-white font-semibold flex items-center gap-2"><MapPin className="w-4 h-4 text-gold-400" /> Privacy & Data</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 border border-neutral-700 text-neutral-300 rounded-lg hover:border-neutral-500 text-sm">
            <Download className="w-4 h-4" /> Download my data
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 border border-red-500/40 text-red-400 rounded-lg hover:bg-red-500/10 text-sm">
            <Trash2 className="w-4 h-4" /> Delete my account
          </button>
        </div>
        <p className="text-neutral-600 text-xs">Data requests are processed within 30 days per GDPR Art. 15-17.</p>
      </div>
    </div>
  );
}
