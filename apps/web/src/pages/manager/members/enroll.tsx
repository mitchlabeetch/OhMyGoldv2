import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CheckCircle, Loader2, ChevronRight, ChevronLeft } from "lucide-react";
import { Wizard } from "@/components/ui/Wizard";
import { useMembershipPlans } from "@/hooks/usePlans";
import { supabase } from "@/lib/supabase";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(amount);
}

type PersonalInfo = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
};

type Plan = {
  id: string;
  name: string;
  price: number;
  duration_days: number;
  features: string[];
};

const inputClass =
  "w-full px-3 py-2 bg-surface-card border border-border rounded-lg text-white text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400/50 transition-colors";
const labelClass = "block text-sm font-medium text-text-secondary mb-1";

export default function EnrollPage() {
  const { t } = useTranslation(["members"]);
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [enrolledId, setEnrolledId] = useState<string | null>(null);

  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    birthDate: "",
  });
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  const { data: plans, isLoading: plansLoading } = useMembershipPlans({ isPublic: true });

  const STEPS = [
    { label: t("members:enrollment.step1") },
    { label: t("members:enrollment.step2") },
    { label: t("members:enrollment.step3") },
    { label: t("members:enrollment.step4") },
  ];

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      // Invite user via standard signup flow (server-side admin enrollment
      // should be handled via an Edge Function in production)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: personalInfo.email,
        password: crypto.randomUUID() + "Aa1!",
        options: {
          data: {
            first_name: personalInfo.firstName,
            last_name: personalInfo.lastName,
          },
        },
      });
      if (authError) throw authError;
      if (!authData.user) throw new Error("No user returned from signup");

      // Create member record
      const { data: member, error: memberError } = await supabase
        .from("members")
        .insert({ user_id: authData.user.id, status: "active" })
        .select()
        .single();
      if (memberError) throw memberError;

      // Create subscription if plan selected
      if (selectedPlan) {
        const startsAt = new Date();
        const endsAt = new Date();
        endsAt.setDate(endsAt.getDate() + selectedPlan.duration_days);
        await supabase.from("subscriptions").insert({
          member_id: member.id,
          plan_id: selectedPlan.id,
          status: "active",
          starts_at: startsAt.toISOString(),
          ends_at: endsAt.toISOString(),
        });
      }

      setEnrolledId(member.id);
      setStep(3);
    } catch (err) {
      console.error("Enrollment failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const canProceedStep0 =
    personalInfo.firstName.trim() &&
    personalInfo.lastName.trim() &&
    personalInfo.email.trim();

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-white">{t("members:enrollment.title")}</h1>
      </header>

      <Wizard steps={STEPS} currentStep={step}>
        {/* Step 0: Personal Info */}
        {step === 0 && (
          <div className="glass-card p-6 space-y-5">
            <h2 className="text-lg font-semibold text-white">{t("members:enrollment.step1")}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="enroll-fname" className={labelClass}>
                  Prénom <span className="text-status-error" aria-hidden="true">*</span>
                </label>
                <input
                  id="enroll-fname"
                  type="text"
                  value={personalInfo.firstName}
                  onChange={(e) => setPersonalInfo((p) => ({ ...p, firstName: e.target.value }))}
                  required
                  aria-required="true"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="enroll-lname" className={labelClass}>
                  Nom <span className="text-status-error" aria-hidden="true">*</span>
                </label>
                <input
                  id="enroll-lname"
                  type="text"
                  value={personalInfo.lastName}
                  onChange={(e) => setPersonalInfo((p) => ({ ...p, lastName: e.target.value }))}
                  required
                  aria-required="true"
                  className={inputClass}
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="enroll-email" className={labelClass}>
                  Email <span className="text-status-error" aria-hidden="true">*</span>
                </label>
                <input
                  id="enroll-email"
                  type="email"
                  value={personalInfo.email}
                  onChange={(e) => setPersonalInfo((p) => ({ ...p, email: e.target.value }))}
                  required
                  aria-required="true"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="enroll-phone" className={labelClass}>Téléphone</label>
                <input
                  id="enroll-phone"
                  type="tel"
                  value={personalInfo.phone}
                  onChange={(e) => setPersonalInfo((p) => ({ ...p, phone: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="enroll-birth" className={labelClass}>Date de naissance</label>
                <input
                  id="enroll-birth"
                  type="date"
                  value={personalInfo.birthDate}
                  onChange={(e) => setPersonalInfo((p) => ({ ...p, birthDate: e.target.value }))}
                  className={inputClass}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setStep(1)}
                disabled={!canProceedStep0}
                className="inline-flex items-center gap-2 px-5 py-2 bg-gold-400 text-black text-sm font-semibold rounded-lg hover:bg-gold-300 disabled:opacity-50 transition-colors"
              >
                Suivant
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        {/* Step 1: Plan Selection */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold text-white mb-4">{t("members:enrollment.step2")}</h2>
              {plansLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-40 rounded-xl bg-neutral-700 animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" role="radiogroup" aria-label="Choisir un forfait">
                  {(plans ?? []).map((plan) => (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => setSelectedPlan(plan as Plan)}
                      aria-pressed={selectedPlan?.id === plan.id}
                      className={`text-left p-5 rounded-xl border-2 transition-all ${
                        selectedPlan?.id === plan.id
                          ? "border-gold-400 bg-gold-400/5"
                          : "border-border hover:border-neutral-500 bg-surface-card"
                      }`}
                    >
                      <p className="font-semibold text-white">{plan.name}</p>
                      <p className="text-2xl font-bold text-gold-400 mt-1">{formatCurrency(plan.price)}</p>
                      <p className="text-text-secondary text-xs mt-1">{plan.duration_days} jours</p>
                      {(plan.features ?? []).length > 0 && (
                        <ul className="mt-3 space-y-1">
                          {(plan.features as string[]).map((f) => (
                            <li key={f} className="text-xs text-text-secondary flex items-center gap-1">
                              <span className="text-gold-400" aria-hidden="true">✓</span>
                              {f}
                            </li>
                          ))}
                        </ul>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setStep(0)}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:text-white transition-colors"
              >
                <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                Retour
              </button>
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!selectedPlan}
                className="inline-flex items-center gap-2 px-5 py-2 bg-gold-400 text-black text-sm font-semibold rounded-lg hover:bg-gold-300 disabled:opacity-50 transition-colors"
              >
                Suivant
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Confirm */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="glass-card p-6 space-y-5">
              <h2 className="text-lg font-semibold text-white">{t("members:enrollment.step3")}</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Prénom</span>
                  <span className="text-white">{personalInfo.firstName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Nom</span>
                  <span className="text-white">{personalInfo.lastName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Email</span>
                  <span className="text-white">{personalInfo.email}</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between text-sm">
                  <span className="text-text-secondary">Forfait</span>
                  <span className="text-white font-medium">{selectedPlan?.name ?? "—"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Montant</span>
                  <span className="text-gold-400 font-bold text-base">
                    {selectedPlan ? formatCurrency(selectedPlan.price) : "—"}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:text-white transition-colors"
              >
                <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                Retour
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="inline-flex items-center gap-2 px-5 py-2 bg-gold-400 text-black text-sm font-semibold rounded-lg hover:bg-gold-300 disabled:opacity-50 transition-colors"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
                Confirmer l'inscription
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Success */}
        {step === 3 && (
          <div className="glass-card p-8 text-center space-y-5">
            <div
              className="w-16 h-16 rounded-full bg-status-success/15 flex items-center justify-center mx-auto"
              aria-hidden="true"
            >
              <CheckCircle className="w-8 h-8 text-status-success" />
            </div>
            <h2 className="text-xl font-bold text-white">{t("members:enrollment.step4")}</h2>
            <p className="text-text-secondary">
              {personalInfo.firstName} {personalInfo.lastName} a été inscrit avec succès.
            </p>
            {selectedPlan && (
              <div className="inline-block mx-auto border border-gold-400/30 rounded-xl p-5 bg-gold-400/5 text-left min-w-[220px]">
                <p className="text-xs text-text-muted mb-1">Carte membre</p>
                <p className="text-white font-bold text-lg">{personalInfo.firstName} {personalInfo.lastName}</p>
                <p className="text-gold-400 text-sm mt-1">{selectedPlan.name}</p>
                <p className="text-text-muted text-xs mt-2">ID: {enrolledId?.slice(0, 8) ?? "—"}</p>
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={() => navigate("/manager/members")}
                className="px-5 py-2 bg-gold-400 text-black text-sm font-semibold rounded-lg hover:bg-gold-300 transition-colors"
              >
                Retour à la liste
              </button>
              <button
                type="button"
                onClick={() => {
                  setStep(0);
                  setPersonalInfo({ firstName: "", lastName: "", email: "", phone: "", birthDate: "" });
                  setSelectedPlan(null);
                  setEnrolledId(null);
                }}
                className="px-5 py-2 bg-surface-card border border-border text-sm text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                Inscrire un autre membre
              </button>
            </div>
          </div>
        )}
      </Wizard>
    </div>
  );
}
