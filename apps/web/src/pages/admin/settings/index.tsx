import { useState, type FormEvent } from "react";
import { Loader2, Settings, Lock, Bell, CreditCard } from "lucide-react";

type Section = "general" | "security" | "notifications" | "billing";

const SECTIONS: { id: Section; label: string; icon: typeof Settings }[] = [
  { id: "general", label: "Général", icon: Settings },
  { id: "security", label: "Sécurité", icon: Lock },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "billing", label: "Facturation", icon: CreditCard },
];

const TIMEZONES = ["Europe/Paris", "Europe/London", "Europe/Berlin"];
const LOCALES = ["fr-FR", "en-US", "de-DE", "es-ES"];
const CURRENCIES = ["EUR", "USD", "GBP"];

function useSettings() {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState<Section | null>(null);

  const save = async (section: Section) => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    setSaved(section);
    setTimeout(() => setSaved(null), 2000);
  };

  return { saving, saved, save };
}

function SectionCard({
  title,
  children,
  onSave,
  saving,
  saved,
}: {
  title: string;
  children: React.ReactNode;
  onSave: () => void;
  saving: boolean;
  saved: boolean;
}) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card p-6 space-y-5">
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      {children}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2 bg-gold-400 text-black text-sm font-semibold rounded-lg hover:bg-gold-300 disabled:opacity-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gold-400/50"
        >
          {saving && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
          {saved ? "✓ Enregistré" : "Enregistrer"}
        </button>
      </div>
    </form>
  );
}

const inputClass =
  "w-full px-3 py-2 bg-surface-card border border-border rounded-lg text-white text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400/50 transition-colors";

const labelClass = "block text-sm font-medium text-text-secondary mb-1";

export default function SettingsPage() {
  const { saving, saved, save } = useSettings();
  const [activeSection, setActiveSection] = useState<Section>("general");

  const [general, setGeneral] = useState({ timezone: "Europe/Paris", locale: "fr-FR", currency: "EUR" });
  const [security, setSecurity] = useState({ minPasswordLength: "8", sessionTimeout: "30", mfaRequired: false });
  const [notifications, setNotifications] = useState({ smtpHost: "", smtpPort: "587", fromEmail: "" });
  const [billing, setBilling] = useState({ billingDay: "1" });

  return (
    <div className="p-6 space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-white">Paramètres système</h1>
        <p className="text-text-secondary text-sm mt-1">Configuration globale de la plateforme</p>
      </header>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar nav */}
        <nav className="lg:w-48 flex-shrink-0" aria-label="Sections paramètres">
          <ul className="space-y-1">
            {SECTIONS.map(({ id, label, icon: Icon }) => (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => setActiveSection(id)}
                  aria-current={activeSection === id ? "page" : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeSection === id
                      ? "bg-gold-400/10 text-gold-400"
                      : "text-text-secondary hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Section content */}
        <div className="flex-1 space-y-6">
          {activeSection === "general" && (
            <SectionCard
              title="Général"
              onSave={() => save("general")}
              saving={saving}
              saved={saved === "general"}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="tz" className={labelClass}>Fuseau horaire</label>
                  <select
                    id="tz"
                    value={general.timezone}
                    onChange={(e) => setGeneral((p) => ({ ...p, timezone: e.target.value }))}
                    className={inputClass}
                  >
                    {TIMEZONES.map((tz) => <option key={tz} value={tz}>{tz}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="locale" className={labelClass}>Langue</label>
                  <select
                    id="locale"
                    value={general.locale}
                    onChange={(e) => setGeneral((p) => ({ ...p, locale: e.target.value }))}
                    className={inputClass}
                  >
                    {LOCALES.map((l) => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="currency" className={labelClass}>Devise</label>
                  <select
                    id="currency"
                    value={general.currency}
                    onChange={(e) => setGeneral((p) => ({ ...p, currency: e.target.value }))}
                    className={inputClass}
                  >
                    {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            </SectionCard>
          )}

          {activeSection === "security" && (
            <SectionCard
              title="Sécurité"
              onSave={() => save("security")}
              saving={saving}
              saved={saved === "security"}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="minpwd" className={labelClass}>Longueur min. mot de passe</label>
                  <input
                    id="minpwd"
                    type="number"
                    min={6}
                    max={32}
                    value={security.minPasswordLength}
                    onChange={(e) => setSecurity((p) => ({ ...p, minPasswordLength: e.target.value }))}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="session-timeout" className={labelClass}>Expiration session (min)</label>
                  <input
                    id="session-timeout"
                    type="number"
                    min={5}
                    value={security.sessionTimeout}
                    onChange={(e) => setSecurity((p) => ({ ...p, sessionTimeout: e.target.value }))}
                    className={inputClass}
                  />
                </div>
                <div className="sm:col-span-2 flex items-center gap-3">
                  <input
                    id="mfa-required"
                    type="checkbox"
                    checked={security.mfaRequired}
                    onChange={(e) => setSecurity((p) => ({ ...p, mfaRequired: e.target.checked }))}
                    className="w-4 h-4 rounded accent-gold-400"
                  />
                  <label htmlFor="mfa-required" className="text-sm text-white">
                    Exiger l'authentification à deux facteurs (MFA) pour tous les comptes
                  </label>
                </div>
              </div>
            </SectionCard>
          )}

          {activeSection === "notifications" && (
            <SectionCard
              title="Notifications email"
              onSave={() => save("notifications")}
              saving={saving}
              saved={saved === "notifications"}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="smtp-host" className={labelClass}>Serveur SMTP</label>
                  <input
                    id="smtp-host"
                    type="text"
                    value={notifications.smtpHost}
                    onChange={(e) => setNotifications((p) => ({ ...p, smtpHost: e.target.value }))}
                    placeholder="smtp.example.com"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="smtp-port" className={labelClass}>Port SMTP</label>
                  <input
                    id="smtp-port"
                    type="number"
                    value={notifications.smtpPort}
                    onChange={(e) => setNotifications((p) => ({ ...p, smtpPort: e.target.value }))}
                    className={inputClass}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="from-email" className={labelClass}>Email d'expédition</label>
                  <input
                    id="from-email"
                    type="email"
                    value={notifications.fromEmail}
                    onChange={(e) => setNotifications((p) => ({ ...p, fromEmail: e.target.value }))}
                    placeholder="noreply@goldsgym.fr"
                    className={inputClass}
                  />
                </div>
              </div>
            </SectionCard>
          )}

          {activeSection === "billing" && (
            <SectionCard
              title="Facturation"
              onSave={() => save("billing")}
              saving={saving}
              saved={saved === "billing"}
            >
              <div>
                <label htmlFor="billing-day" className={labelClass}>
                  Jour de prélèvement par défaut (1–28)
                </label>
                <input
                  id="billing-day"
                  type="number"
                  min={1}
                  max={28}
                  value={billing.billingDay}
                  onChange={(e) => setBilling({ billingDay: e.target.value })}
                  className={`${inputClass} max-w-xs`}
                />
              </div>
            </SectionCard>
          )}
        </div>
      </div>
    </div>
  );
}
