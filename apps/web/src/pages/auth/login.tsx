import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, type LoginInput } from "@ohmygold/shared";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function LoginPage() {
  const { t } = useTranslation(["auth", "common"]);
  const { login, loginWithGoogle, loginWithApple, isAuthenticated, isLoading, error, clearError } =
    useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);

  const from = (location.state as { from?: string })?.from ?? "/dashboard";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: localStorage.getItem("omg_remember_email") ?? "",
      rememberMe: !!localStorage.getItem("omg_remember_email"),
    },
  });

  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true });
  }, [isAuthenticated, navigate, from]);

  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  const onSubmit = async (data: LoginInput) => {
    await login(data.email, data.password, data.rememberMe);
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-700 mb-4 shadow-glow">
            <span className="text-2xl font-black text-black">G</span>
          </div>
          <h1 className="text-2xl font-bold text-white">{t("auth:login.title")}</h1>
          <p className="text-text-secondary mt-1">{t("auth:login.subtitle")}</p>
        </div>

        {/* Error Banner */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-4 p-3 rounded-xl bg-status-error/10 border border-status-error/30 text-status-error text-sm"
            role="alert"
          >
            {error}
          </motion.div>
        )}

        <div className="glass-card p-8">
          {/* OAuth Buttons */}
          <div className="space-y-3 mb-6">
            <button
              type="button"
              onClick={loginWithGoogle}
              disabled={isLoading || isSubmitting}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-border hover:border-border-emphasis bg-surface-secondary hover:bg-surface-elevated transition-all duration-200 text-sm font-medium text-white disabled:opacity-50"
              aria-label="Se connecter avec Google"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {t("auth:login.continueWithGoogle")}
            </button>

            <button
              type="button"
              onClick={loginWithApple}
              disabled={isLoading || isSubmitting}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-border hover:border-border-emphasis bg-surface-secondary hover:bg-surface-elevated transition-all duration-200 text-sm font-medium text-white disabled:opacity-50"
              aria-label="Se connecter avec Apple"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701z" />
              </svg>
              {t("auth:login.continueWithApple")}
            </button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-surface-elevated px-3 text-text-muted">
                {t("auth:login.orContinueWithEmail")}
              </span>
            </div>
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            {/* Email */}
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
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && (
                <p id="email-error" className="mt-1 text-xs text-status-error" role="alert">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-sm font-medium text-text-secondary">
                  {t("common:password")}
                </label>
                <Link
                  to="/auth/forgot-password"
                  className="text-xs text-gold-400 hover:text-gold-300 transition-colors"
                >
                  {t("auth:login.forgotPassword")}
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  {...register("password")}
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-surface-secondary border border-border focus:border-gold-500 focus:ring-1 focus:ring-gold-500 text-white placeholder-text-muted outline-none transition-all text-sm"
                  placeholder="••••••••"
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? "password-error" : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors p-1"
                  aria-label={showPassword ? t("auth:login.hidePassword") : t("auth:login.showPassword")}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p id="password-error" className="mt-1 text-xs text-status-error" role="alert">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2">
              <input
                id="rememberMe"
                type="checkbox"
                {...register("rememberMe")}
                className="w-4 h-4 rounded border-border bg-surface-secondary accent-gold-500 cursor-pointer"
              />
              <label htmlFor="rememberMe" className="text-sm text-text-secondary cursor-pointer">
                {t("auth:login.rememberMe")}
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-black font-semibold transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-glow hover:shadow-gold"
            >
              {(isSubmitting || isLoading) && <Loader2 className="w-4 h-4 animate-spin" />}
              {t("auth:login.submit")}
            </button>
          </form>

          {/* Register link */}
          <p className="text-center text-sm text-text-secondary mt-6">
            {t("auth:login.noAccount")}{" "}
            <Link to="/auth/register" className="text-gold-400 hover:text-gold-300 font-medium transition-colors">
              {t("auth:login.register")}
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
