import { useState } from "react";
import { User, Lock, Bell, Globe, Shield, Camera } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { supabase } from "@/lib/supabase";

const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "password", label: "Password", icon: Lock },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "language", label: "Language", icon: Globe },
  { id: "security", label: "Security", icon: Shield },
] as const;

type Tab = (typeof TABS)[number]["id"];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const profile = useAuthStore((s) => s.profile);
  const refreshProfile = useAuthStore((s) => s.refreshProfile);

  return (
    <div className="py-8 px-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">Settings</h1>

      <div className="flex gap-6">
        {/* Sidebar tabs */}
        <nav
          className="w-48 shrink-0 space-y-1"
          aria-label="Settings navigation"
        >
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={[
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                activeTab === id
                  ? "bg-gold-500/10 text-gold-400 border border-gold-500/20"
                  : "text-text-secondary hover:text-white hover:bg-surface-elevated",
              ].join(" ")}
              aria-current={activeTab === id ? "page" : undefined}
            >
              <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
              {label}
            </button>
          ))}
        </nav>

        {/* Tab content */}
        <div className="flex-1">
          {activeTab === "profile" && (
            <ProfileTab profile={profile} onSave={refreshProfile} />
          )}
          {activeTab === "password" && <PasswordTab />}
          {activeTab === "notifications" && <NotificationsTab />}
          {activeTab === "language" && <LanguageTab />}
          {activeTab === "security" && <SecurityTab />}
        </div>
      </div>
    </div>
  );
}

function ProfileTab({
  profile,
  onSave,
}: {
  profile: { first_name?: string; last_name?: string; email?: string } | null;
  onSave?: () => Promise<void> | void;
}) {
  const [first_name, setFirstName] = useState(profile?.first_name ?? "");
  const [last_name, setLastName] = useState(profile?.last_name ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    setSaveError(null);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;
      if (!user) throw new Error("Unable to load the current user.");

      const { error: updateError } = await supabase
        .from("user_profiles")
        .update({ first_name, last_name })
        .eq("id", user.id);

      if (updateError) throw updateError;

      await onSave?.();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : "Unable to save your profile.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="bg-surface-card rounded-xl border border-border p-6 space-y-5">
      {saveError && (
        <p className="rounded-lg bg-status-error/10 px-3 py-2 text-sm text-status-error">
          {saveError}
        </p>
      )}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-surface-elevated border border-border flex items-center justify-center">
          <Camera className="w-6 h-6 text-text-muted" aria-hidden="true" />
        </div>
        <div>
          <h2 className="font-semibold text-white">Profile Photo</h2>
          <button className="text-sm text-gold-400 hover:text-gold-300 transition-colors">
            Upload photo
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label
            className="text-sm text-text-secondary font-medium"
            htmlFor="s-first-name"
          >
            First name
          </label>
          <input
            id="s-first-name"
            className="w-full bg-surface-elevated border border-border rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-gold-500/50 outline-none"
            value={first_name}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <label
            className="text-sm text-text-secondary font-medium"
            htmlFor="s-last-name"
          >
            Last name
          </label>
          <input
            id="s-last-name"
            className="w-full bg-surface-elevated border border-border rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-gold-500/50 outline-none"
            value={last_name}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <label className="text-sm text-text-secondary font-medium">Email</label>
        <input
          className="w-full bg-surface-elevated border border-border rounded-lg px-3 py-2 text-text-muted text-sm cursor-not-allowed"
          value={profile?.email ?? ""}
          disabled
        />
        <p className="text-xs text-text-muted">
          Email cannot be changed here. Contact support.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2 bg-gold-500 text-black rounded-lg font-semibold text-sm hover:bg-gold-400 disabled:opacity-60 transition-colors"
        >
          {saving ? "Saving…" : saved ? "Saved ✓" : "Save changes"}
        </button>
      </div>
    </section>
  );
}

function PasswordTab() {
  const [form, setForm] = useState({ current: "", next: "", confirm: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleChange() {
    setError(null);
    if (!form.next || form.next.length < 8)
      return setError("New password must be at least 8 characters.");
    if (form.next !== form.confirm) return setError("Passwords do not match.");
    setSaving(true);
    const { error: err } = await supabase.auth.updateUser({
      password: form.next,
    });
    setSaving(false);
    if (err) return setError(err.message);
    setSuccess(true);
    setForm({ current: "", next: "", confirm: "" });
    setTimeout(() => setSuccess(false), 3000);
  }

  return (
    <section className="bg-surface-card rounded-xl border border-border p-6 space-y-4">
      <h2 className="font-semibold text-white">Change Password</h2>
      {error && (
        <p className="text-sm text-status-error bg-status-error/10 rounded-lg px-3 py-2">
          {error}
        </p>
      )}
      {success && (
        <p className="text-sm text-status-success bg-status-success/10 rounded-lg px-3 py-2">
          Password updated successfully.
        </p>
      )}
      {(["current", "next", "confirm"] as const).map((field) => (
        <div key={field} className="space-y-1.5">
          <label
            className="text-sm text-text-secondary font-medium capitalize"
            htmlFor={`pw-${field}`}
          >
            {field === "next"
              ? "New password"
              : field === "confirm"
                ? "Confirm new password"
                : "Current password"}
          </label>
          <input
            id={`pw-${field}`}
            type="password"
            className="w-full bg-surface-elevated border border-border rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-gold-500/50 outline-none"
            value={form[field]}
            onChange={(e) =>
              setForm((p) => ({ ...p, [field]: e.target.value }))
            }
          />
        </div>
      ))}
      <button
        onClick={handleChange}
        disabled={saving}
        className="px-5 py-2 bg-gold-500 text-black rounded-lg font-semibold text-sm hover:bg-gold-400 disabled:opacity-60 transition-colors"
      >
        {saving ? "Updating…" : "Update Password"}
      </button>
    </section>
  );
}

function NotificationsTab() {
  const [prefs, setPrefs] = useState({
    bookings: true,
    promotions: false,
    reminders: true,
    news: false,
  });

  return (
    <section className="bg-surface-card rounded-xl border border-border p-6 space-y-4">
      <h2 className="font-semibold text-white">Notification Preferences</h2>
      {Object.entries(prefs).map(([key, val]) => (
        <label
          key={key}
          className="flex items-center justify-between cursor-pointer py-1"
        >
          <span className="text-sm text-white capitalize">
            {key} notifications
          </span>
          <button
            role="switch"
            aria-checked={val}
            onClick={() =>
              setPrefs((p) => ({ ...p, [key]: !p[key as keyof typeof p] }))
            }
            className={`w-11 h-6 rounded-full transition-colors ${val ? "bg-gold-500" : "bg-surface-elevated border border-border"}`}
          >
            <span
              className={`block w-4 h-4 rounded-full bg-white mx-1 transition-transform ${val ? "translate-x-5" : "translate-x-0"}`}
            />
          </button>
        </label>
      ))}
    </section>
  );
}

function LanguageTab() {
  const [lang, setLang] = useState("fr");
  return (
    <section className="bg-surface-card rounded-xl border border-border p-6 space-y-4">
      <h2 className="font-semibold text-white">Language</h2>
      <div className="space-y-1.5">
        <label
          className="text-sm text-text-secondary font-medium"
          htmlFor="lang-select"
        >
          Display language
        </label>
        <select
          id="lang-select"
          className="w-full bg-surface-elevated border border-border rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-gold-500/50 outline-none"
          value={lang}
          onChange={(e) => setLang(e.target.value)}
        >
          <option value="fr">Français</option>
          <option value="en">English</option>
        </select>
      </div>
      <button className="px-5 py-2 bg-gold-500 text-black rounded-lg font-semibold text-sm hover:bg-gold-400 transition-colors">
        Save preference
      </button>
    </section>
  );
}

function SecurityTab() {
  return (
    <section className="bg-surface-card rounded-xl border border-border p-6 space-y-4">
      <h2 className="font-semibold text-white">Security</h2>
      <div className="flex items-center justify-between py-2">
        <div>
          <div className="text-sm font-medium text-white">
            Two-factor authentication
          </div>
          <div className="text-xs text-text-muted">
            Add an extra layer of security to your account
          </div>
        </div>
        <button className="px-4 py-1.5 rounded-lg bg-surface-elevated text-text-secondary font-semibold text-sm border border-border hover:bg-surface-card transition-colors">
          Enable
        </button>
      </div>
      <div className="flex items-center justify-between py-2 border-t border-border">
        <div>
          <div className="text-sm font-medium text-white">Active sessions</div>
          <div className="text-xs text-text-muted">
            Manage devices where you are logged in
          </div>
        </div>
        <button className="px-4 py-1.5 rounded-lg bg-status-error/10 text-status-error font-semibold text-sm border border-status-error/30 hover:bg-status-error/20 transition-colors">
          Sign out all
        </button>
      </div>
    </section>
  );
}
