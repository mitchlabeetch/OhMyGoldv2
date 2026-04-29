import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResetPasswordSchema, type ResetPasswordInput } from "@ohmygold/shared";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Eye, EyeOff, Check, Loader2 } from "lucide-react";

export default function ResetPasswordPage() {
  const { t } = useTranslation(["auth", "common"]);
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(ResetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordInput) => {
    try {
      await resetPassword(data.password);
      navigate("/auth/login?message=password_reset_success");
    } catch (err: unknown) {
      setError("password", {
        message: err instanceof Error ? err.message : t("common:errors.generic"),
      });
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass-card p-8"
      >
        <h1 className="text-xl font-bold text-white mb-2">{t("auth:resetPassword.title")}</h1>
        <p className="text-text-secondary text-sm mb-6">{t("auth:resetPassword.description")}</p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-1.5">
              {t("auth:resetPassword.newPassword")}
            </label>
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
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary p-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-status-error">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-secondary mb-1.5">
              {t("auth:register.confirmPassword")}
            </label>
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
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary p-1"
              >
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-status-error">{errors.confirmPassword.message}</p>
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
            {t("auth:resetPassword.submit")}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
