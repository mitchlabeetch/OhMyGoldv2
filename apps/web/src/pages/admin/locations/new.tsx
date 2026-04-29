import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useCreateLocation } from "@/hooks/useLocations";

const TIMEZONES = [
  "Europe/Paris",
  "Europe/London",
  "Europe/Berlin",
  "Europe/Madrid",
  "America/New_York",
  "America/Los_Angeles",
  "Asia/Tokyo",
];

export default function NewLocationPage() {
  const navigate = useNavigate();
  const { mutateAsync: createLocation, isPending } = useCreateLocation();

  const [form, setForm] = useState({
    name: "",
    address: "",
    city: "",
    phone: "",
    email: "",
    timezone: "Europe/Paris",
    is_active: true,
  });

  const [errors, setErrors] = useState<Partial<typeof form>>({});

  const validate = () => {
    const errs: Partial<typeof form> = {};
    if (!form.name.trim()) errs.name = "Le nom est requis";
    if (!form.address.trim()) errs.address = "L'adresse est requise";
    if (!form.city.trim()) errs.city = "La ville est requise";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (field: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await createLocation(form);
      navigate("/admin/locations");
    } catch (err) {
      console.error("Failed to create location", err);
    }
  };

  const fieldClass = (error?: string) =>
    `w-full px-3 py-2 bg-surface-card border rounded-lg text-white text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 transition-colors ${
      error ? "border-status-error focus:ring-status-error/50" : "border-border focus:ring-gold-400/50 focus:border-gold-400/50"
    }`;

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link
          to="/admin/locations"
          className="inline-flex items-center gap-2 text-text-secondary hover:text-white transition-colors text-sm"
          aria-label="Retour aux clubs"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Retour
        </Link>
        <h1 className="text-xl font-bold text-white">Nouveau club</h1>
      </div>

      <form onSubmit={handleSubmit} className="glass-card p-6 space-y-5" noValidate>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Name */}
          <div className="sm:col-span-2">
            <label htmlFor="loc-name" className="block text-sm font-medium text-text-secondary mb-1">
              Nom du club <span aria-hidden="true" className="text-status-error">*</span>
            </label>
            <input
              id="loc-name"
              type="text"
              value={form.name}
              onChange={handleChange("name")}
              placeholder="Gold's Gym Paris"
              required
              aria-required="true"
              aria-describedby={errors.name ? "loc-name-err" : undefined}
              aria-invalid={!!errors.name}
              className={fieldClass(errors.name)}
            />
            {errors.name && (
              <p id="loc-name-err" role="alert" className="text-status-error text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Address */}
          <div className="sm:col-span-2">
            <label htmlFor="loc-address" className="block text-sm font-medium text-text-secondary mb-1">
              Adresse <span aria-hidden="true" className="text-status-error">*</span>
            </label>
            <input
              id="loc-address"
              type="text"
              value={form.address}
              onChange={handleChange("address")}
              placeholder="12 rue de la Paix"
              required
              aria-required="true"
              aria-describedby={errors.address ? "loc-address-err" : undefined}
              aria-invalid={!!errors.address}
              className={fieldClass(errors.address)}
            />
            {errors.address && (
              <p id="loc-address-err" role="alert" className="text-status-error text-xs mt-1">{errors.address}</p>
            )}
          </div>

          {/* City */}
          <div>
            <label htmlFor="loc-city" className="block text-sm font-medium text-text-secondary mb-1">
              Ville <span aria-hidden="true" className="text-status-error">*</span>
            </label>
            <input
              id="loc-city"
              type="text"
              value={form.city}
              onChange={handleChange("city")}
              placeholder="Paris"
              required
              aria-required="true"
              aria-invalid={!!errors.city}
              className={fieldClass(errors.city)}
            />
            {errors.city && <p role="alert" className="text-status-error text-xs mt-1">{errors.city}</p>}
          </div>

          {/* Timezone */}
          <div>
            <label htmlFor="loc-tz" className="block text-sm font-medium text-text-secondary mb-1">
              Fuseau horaire
            </label>
            <select
              id="loc-tz"
              value={form.timezone}
              onChange={handleChange("timezone")}
              className={fieldClass()}
            >
              {TIMEZONES.map((tz) => (
                <option key={tz} value={tz}>{tz}</option>
              ))}
            </select>
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="loc-phone" className="block text-sm font-medium text-text-secondary mb-1">
              Téléphone
            </label>
            <input
              id="loc-phone"
              type="tel"
              value={form.phone}
              onChange={handleChange("phone")}
              placeholder="+33 1 23 45 67 89"
              className={fieldClass()}
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="loc-email" className="block text-sm font-medium text-text-secondary mb-1">
              Email
            </label>
            <input
              id="loc-email"
              type="email"
              value={form.email}
              onChange={handleChange("email")}
              placeholder="paris@goldsgym.fr"
              className={fieldClass()}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            to="/admin/locations"
            className="px-4 py-2 text-sm text-text-secondary hover:text-white transition-colors"
          >
            Annuler
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-2 px-6 py-2 bg-gold-400 text-black text-sm font-semibold rounded-lg hover:bg-gold-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-gold-400/50"
          >
            {isPending && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
            Créer le club
          </button>
        </div>
      </form>
    </div>
  );
}
