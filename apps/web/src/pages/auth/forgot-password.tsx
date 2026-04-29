import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ForgotPasswordSchema, type ForgotPasswordInput } from "@ohmygold/shared";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Loader2, Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const { t } = useTranslation(["auth", "common"]);
  const { forgotPassword } = useAuth();
  const [sent, setSent] = useState(false);
  const [sentEmail, setSentEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(ForgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    try {
      await forgotPassword(data.email);
      setSentEmail(data.email);
      setSent(true);
    } catch (err: unknown) {
      setError("email", {
        message: err instanceof Error ? err.message : t("common:errors.generic"),
      });
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md text-center glass-card p-10"
        >
          <div className="w-16 h-16 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-gold-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">{t("auth:forgotPassword.emailSent")}</h2>
          <p className="text-text-secondary text-sm">
            {t("auth:forgotPassword.emailSentDesc", { email: sentEmail })}
          </p>
          <Link
            to="/auth/login"
            className="mt-6 inline-flex items-center gap-2 text-gold-400 hover:text-gold-300 text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("auth:forgotPassword.backToLogin")}
          </Link>
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
        <div className="glass-card p-8">
          <Link
            to="/auth/login"
            className="inline-flex items-center gap-2 text-text-secondary hover:text-white text-sm transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("auth:forgotPassword.backToLogin")}
          </Link>

          <h1 className="text-xl font-bold text-white mb-2">{t("auth:forgotPassword.title")}</h1>
          <p className="text-text-secondary text-sm mb-6">{t("auth:forgotPassword.description")}</p>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-1.5">
                {t("common:email")}
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...register("email")}
                className="w-full px-4 py-3 rounded-xl bg-surface-secondary border border-border focus:border-gold-500 focus:ring-1 focus:ring-gold-500 text-white placeholder-text-muted outline-none transition-all text-sm"
                placeholder="vous@example.com"
                aria-invalid={!!errors.email}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-status-error">{errors.email.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-black font-semibold transition-all disabled:opacity-60"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              {t("auth:forgotPassword.submit")}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
