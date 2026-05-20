import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema, type RegisterInput, passwordStrength } from "@ohmygold/shared";
import { useAuthStore } from "@/stores/authStore";
import { supabase } from "@/lib/supabase";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, ChevronRight, ChevronLeft, Check, Loader2 } from "lucide-react";

const STEPS = ["account", "personal", "confirm"] as const;
type Step = (typeof STEPS)[number];

export default function RegisterPage() {
  const { t } = useTranslation(["auth", "common"]);
  const navigate = useNavigate();
  const fetchProfile = useAuthStore((s) => s.fetchProfile);

  const [step, setStep] = useState<Step>("account");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(RegisterSchema),
    mode: "onBlur",
  });

  const password = watch("password", "");
  const strength = passwordStrength(password);
  const stepIndex = STEPS.indexOf(step);

  const strengthColors = { weak: "bg-status-error", medium: "bg-status-warning", strong: "bg-status-success" };
  const strengthLabels = { weak: t("auth:register.passwordWeak"), medium: t("auth:register.passwordMedium"), strong: t("auth:register.passwordStrong") };

  const nextStep = async () => {
    const fieldsMap: Record<Step, (keyof RegisterInput)[]> = {
      account: ["email", "password", "confirmPassword"],
      personal: ["firstName", "lastName"],
      confirm: ["acceptTerms"],
    };
    const valid = await trigger(fieldsMap[step]);
    if (valid) setStep(STEPS[stepIndex + 1] as Step);
  };

  const prevStep = () => setStep(STEPS[stepIndex - 1] as Step);

  const onSubmit = async (data: RegisterInput) => {
    setGlobalError(null);
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
            phone: data.phone,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
      if (authData.user) {
        await fetchProfile(authData.user.id);
      }
      setSubmitted(true);
    } catch (err: unknown) {
      setGlobalError(err instanceof Error ? err.message : t("common:errors.generic"));
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md text-center"
        >
          <div className="glass-card p-10">
            <div className="w-16 h-16 rounded-full bg-status-success/10 border border-status-success/30 flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-status-success" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">{t("auth:register.checkEmail")}</h2>
            <p className="text-text-secondary text-sm">{t("auth:register.checkEmailDesc")}</p>
            <Link
              to="/auth/login"
              className="mt-6 inline-block px-6 py-2.5 rounded-xl bg-gold-500 text-black font-semibold text-sm hover:bg-gold-400 transition-colors"
            >
              {t("auth:login.submit")}
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-700 mb-4">
            <span className="text-2xl font-black text-black">G</span>
          </div>
          <h1 className="text-2xl font-bold text-white">{t("auth:register.title")}</h1>
          <p className="text-text-secondary mt-1">{t("auth:register.subtitle")}</p>
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {STEPS.map((s, i) => (
            <React.Fragment key={s}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  i < stepIndex
                    ? "bg-gold-500 text-black"
                    : i === stepIndex
                      ? "bg-gold-500/20 border-2 border-gold-500 text-gold-400"
                      : "bg-surface-elevated border border-border text-text-muted"
                }`}
              >
                {i < stepIndex ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`h-px w-8 transition-all ${i < stepIndex ? "bg-gold-500" : "bg-border"}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {globalError && (
          <div className="mb-4 p-3 rounded-xl bg-status-error/10 border border-status-error/30 text-status-error text-sm" role="alert">
            {globalError}
          </div>
        )}

        <div className="glass-card p-8">
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <AnimatePresence mode="wait">
              {/* Step 1: Account */}
              {step === "account" && (
                <motion.div
                  key="account"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h2 className="text-lg font-semibold text-white">{t("auth:register.step1Title")}</h2>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-1.5">{t("common:email")}</label>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      {...register("email")}
                      className="w-full px-4 py-3 rounded-xl bg-surface-secondary border border-border focus:border-gold-500 focus:ring-1 focus:ring-gold-500 text-white placeholder-text-muted outline-none transition-all text-sm"
                      placeholder="vous@example.com"
                      aria-invalid={!!errors.email}
                    />
                    {errors.email && <p className="mt-1 text-xs text-status-error">{errors.email.message}</p>}
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-1.5">{t("common:password")}</label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        {...register("password")}
                        className="w-full px-4 py-3 pr-12 rounded-xl bg-surface-secondary border border-border focus:border-gold-500 focus:ring-1 focus:ring-gold-500 text-white placeholder-text-muted outline-none transition-all text-sm"
                        placeholder="••••••••"
                        aria-invalid={!!errors.password}
                      />
                      <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary p-1">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {/* Strength indicator */}
                    {password && (
                      <div className="mt-2">
                        <div className="flex gap-1">
                          {["weak", "medium", "strong"].map((level, i) => (
                            <div
                              key={level}
                              className={`h-1 flex-1 rounded-full transition-all ${
                                (strength === "weak" && i === 0) ||
                                (strength === "medium" && i <= 1) ||
                                strength === "strong"
                                  ? strengthColors[strength]
                                  : "bg-border"
                              }`}
                            />
                          ))}
                        </div>
                        <p className={`text-xs mt-1 ${strength === "weak" ? "text-status-error" : strength === "medium" ? "text-status-warning" : "text-status-success"}`}>
                          {strengthLabels[strength]}
                        </p>
                      </div>
                    )}
                    {errors.password && <p className="mt-1 text-xs text-status-error">{errors.password.message}</p>}
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-secondary mb-1.5">{t("auth:register.confirmPassword")}</label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        type={showConfirm ? "text" : "password"}
                        autoComplete="new-password"
                        {...register("confirmPassword")}
                        className="w-full px-4 py-3 pr-12 rounded-xl bg-surface-secondary border border-border focus:border-gold-500 focus:ring-1 focus:ring-gold-500 text-white placeholder-text-muted outline-none transition-all text-sm"
                        placeholder="••••••••"
                        aria-invalid={!!errors.confirmPassword}
                      />
                      <button type="button" onClick={() => setShowConfirm((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary p-1">
                        {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="mt-1 text-xs text-status-error">{errors.confirmPassword.message}</p>}
                  </div>

                  <button type="button" onClick={nextStep} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-black font-semibold transition-all hover:from-gold-400 hover:to-gold-500">
                    {t("common:next")} <ChevronRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )}

              {/* Step 2: Personal */}
              {step === "personal" && (
                <motion.div
                  key="personal"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h2 className="text-lg font-semibold text-white">{t("auth:register.step2Title")}</h2>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-text-secondary mb-1.5">{t("common:firstName")}</label>
                      <input id="firstName" type="text" autoComplete="given-name" {...register("firstName")}
                        className="w-full px-4 py-3 rounded-xl bg-surface-secondary border border-border focus:border-gold-500 focus:ring-1 focus:ring-gold-500 text-white placeholder-text-muted outline-none transition-all text-sm"
                        placeholder="Jean" aria-invalid={!!errors.firstName} />
                      {errors.firstName && <p className="mt-1 text-xs text-status-error">{errors.firstName.message}</p>}
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-text-secondary mb-1.5">{t("common:lastName")}</label>
                      <input id="lastName" type="text" autoComplete="family-name" {...register("lastName")}
                        className="w-full px-4 py-3 rounded-xl bg-surface-secondary border border-border focus:border-gold-500 focus:ring-1 focus:ring-gold-500 text-white placeholder-text-muted outline-none transition-all text-sm"
                        placeholder="Dupont" aria-invalid={!!errors.lastName} />
                      {errors.lastName && <p className="mt-1 text-xs text-status-error">{errors.lastName.message}</p>}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-text-secondary mb-1.5">{t("common:phone")} <span className="text-text-muted">({t("common:optional")})</span></label>
                    <input id="phone" type="tel" autoComplete="tel" {...register("phone")}
                      className="w-full px-4 py-3 rounded-xl bg-surface-secondary border border-border focus:border-gold-500 focus:ring-1 focus:ring-gold-500 text-white placeholder-text-muted outline-none transition-all text-sm"
                      placeholder="+33 6 12 34 56 78" aria-invalid={!!errors.phone} />
                    {errors.phone && <p className="mt-1 text-xs text-status-error">{errors.phone.message}</p>}
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={prevStep} className="flex items-center gap-2 px-4 py-3 rounded-xl border border-border text-text-secondary hover:border-border-emphasis hover:text-white transition-all text-sm font-medium">
                      <ChevronLeft className="w-4 h-4" /> {t("common:back")}
                    </button>
                    <button type="button" onClick={nextStep} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-black font-semibold transition-all hover:from-gold-400 hover:to-gold-500">
                      {t("common:next")} <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Confirm */}
              {step === "confirm" && (
                <motion.div
                  key="confirm"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h2 className="text-lg font-semibold text-white">{t("auth:register.step3Title")}</h2>
                  <p className="text-text-secondary text-sm">{t("auth:register.reviewDetails")}</p>

                  <div className="flex items-start gap-3">
                    <input
                      id="acceptTerms"
                      type="checkbox"
                      {...register("acceptTerms")}
                      className="w-4 h-4 mt-0.5 rounded border-border bg-surface-secondary accent-gold-500 cursor-pointer"
                      aria-invalid={!!errors.acceptTerms}
                    />
                    <label htmlFor="acceptTerms" className="text-sm text-text-secondary cursor-pointer leading-relaxed">
                      {t("auth:register.acceptTermsPre")}{" "}
                      <a href="/legal/terms" className="text-gold-400 hover:text-gold-300 underline" target="_blank" rel="noopener noreferrer">
                        {t("auth:register.terms")}
                      </a>{" "}
                      {t("auth:register.acceptTermsMid")}{" "}
                      <a href="/legal/privacy" className="text-gold-400 hover:text-gold-300 underline" target="_blank" rel="noopener noreferrer">
                        {t("auth:register.privacy")}
                      </a>
                    </label>
                  </div>
                  {errors.acceptTerms && <p className="text-xs text-status-error">{errors.acceptTerms.message}</p>}

                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={prevStep} className="flex items-center gap-2 px-4 py-3 rounded-xl border border-border text-text-secondary hover:border-border-emphasis hover:text-white transition-all text-sm font-medium">
                      <ChevronLeft className="w-4 h-4" /> {t("common:back")}
                    </button>
                    <button type="submit" disabled={isSubmitting} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-black font-semibold transition-all hover:from-gold-400 hover:to-gold-500 disabled:opacity-60">
                      {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                      {t("auth:register.submit")}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>

          <p className="text-center text-sm text-text-secondary mt-6">
            {t("auth:register.alreadyHaveAccount")}{" "}
            <Link to="/auth/login" className="text-gold-400 hover:text-gold-300 font-medium transition-colors">
              {t("auth:login.submit")}
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
