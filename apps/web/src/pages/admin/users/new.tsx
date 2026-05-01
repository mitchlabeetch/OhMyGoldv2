import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Shield, MapPin, Save } from "lucide-react";

const ROLES = [
  { value: "admin", label: "Admin" },
  { value: "manager", label: "Manager" },
  { value: "employee", label: "Employee" },
  { value: "teacher", label: "Teacher" },
  { value: "client", label: "Client" },
];

export default function AdminUserNew() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    role: "client",
    location_id: "",
    send_invite: true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (k: string, v: string | boolean) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.email || !form.first_name || !form.last_name) {
      setError("First name, last name and email are required.");
      return;
    }
    setSaving(true);
    try {
      // TODO: call admin invite Edge Function or supabase.auth.admin.inviteUserByEmail
      await new Promise((r) => setTimeout(r, 500)); // placeholder
      navigate("/admin/users");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create user");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/admin/users")}
          className="p-2 rounded-lg hover:bg-surface-elevated text-text-muted hover:text-white transition-colors"
          aria-label="Back to users"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">New User</h1>
          <p className="text-text-secondary text-sm">Create a new user account and assign a role</p>
        </div>
      </div>

      {error && (
        <div className="bg-status-error/10 border border-status-error/30 rounded-lg px-4 py-3 text-status-error text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal info */}
        <section className="bg-surface-card rounded-xl border border-border p-6 space-y-4">
          <div className="flex items-center gap-2 text-white font-semibold mb-1">
            <User className="w-4 h-4 text-gold-400" aria-hidden="true" />
            Personal Information
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm text-text-secondary font-medium" htmlFor="first_name">First name *</label>
              <input
                id="first_name"
                className="w-full bg-surface-elevated border border-border rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-gold-500/50 outline-none"
                value={form.first_name}
                onChange={(e) => handleChange("first_name", e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm text-text-secondary font-medium" htmlFor="last_name">Last name *</label>
              <input
                id="last_name"
                className="w-full bg-surface-elevated border border-border rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-gold-500/50 outline-none"
                value={form.last_name}
                onChange={(e) => handleChange("last_name", e.target.value)}
                required
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm text-text-secondary font-medium" htmlFor="email">Email address *</label>
            <input
              id="email"
              type="email"
              className="w-full bg-surface-elevated border border-border rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-gold-500/50 outline-none"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              required
            />
          </div>
        </section>

        {/* Role & location */}
        <section className="bg-surface-card rounded-xl border border-border p-6 space-y-4">
          <div className="flex items-center gap-2 text-white font-semibold mb-1">
            <Shield className="w-4 h-4 text-gold-400" aria-hidden="true" />
            Role & Access
          </div>
          <div className="space-y-1.5">
            <label className="text-sm text-text-secondary font-medium" htmlFor="role">Role *</label>
            <select
              id="role"
              className="w-full bg-surface-elevated border border-border rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-gold-500/50 outline-none"
              value={form.role}
              onChange={(e) => handleChange("role", e.target.value)}
            >
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm text-text-secondary font-medium" htmlFor="location_id">
              <MapPin className="w-3 h-3 inline mr-1" aria-hidden="true" />
              Primary Location
            </label>
            <input
              id="location_id"
              placeholder="Location ID (optional)"
              className="w-full bg-surface-elevated border border-border rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-gold-500/50 outline-none"
              value={form.location_id}
              onChange={(e) => handleChange("location_id", e.target.value)}
            />
          </div>
        </section>

        {/* Options */}
        <section className="bg-surface-card rounded-xl border border-border p-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded accent-gold-500"
              checked={form.send_invite}
              onChange={(e) => handleChange("send_invite", e.target.checked)}
            />
            <span className="text-white text-sm font-medium">Send email invitation</span>
          </label>
          <p className="text-xs text-text-muted mt-1 ml-7">
            The user will receive an email to set their password.
          </p>
        </section>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate("/admin/users")}
            className="px-5 py-2.5 rounded-lg bg-surface-elevated text-text-secondary font-semibold text-sm hover:bg-surface-card border border-border transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gold-500 text-black font-semibold text-sm hover:bg-gold-400 disabled:opacity-60 transition-colors"
          >
            <Save className="w-4 h-4" aria-hidden="true" />
            {saving ? "Creating…" : "Create User"}
          </button>
        </div>
      </form>
    </div>
  );
}
