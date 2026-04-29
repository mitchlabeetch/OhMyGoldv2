import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Copy, Check, Loader2, Trash2, Plus, QrCode } from "lucide-react";
import type { Factor } from "@supabase/supabase-js";

interface TOTPSetupData {
  id: string;
  totp: {
    qr_code: string;
    secret: string;
    uri: string;
  };
}

type SetupStep = "list" | "setup" | "verify";

export default function MFAPage() {
  const { t } = useTranslation(["auth", "common"]);
  const { enrollMFA, verifyMFA, unenrollMFA, listMFAFactors } = useAuth();

  const [step, setStep] = useState<SetupStep>("list");
  const [factors, setFactors] = useState<Factor[]>([]);
  const [setupData, setSetupData] = useState<TOTPSetupData | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<{ code: string }>();

  const loadFactors = async () => {
    try {
      const data = await listMFAFactors();
      setFactors(data.totp ?? []);
    } catch (err: unknown) {
      console.error("[MFA] Error loading factors:", err);
    }
  };

  useEffect(() => {
    loadFactors();
  }, []);

  const startSetup = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await enrollMFA();
      setSetupData(data as unknown as TOTPSetupData);
      setStep("setup");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t("common:errors.generic"));
    } finally {
      setLoading(false);
    }
  };

  const copySecret = async () => {
    if (!setupData?.totp.secret) return;
    await navigator.clipboard.writeText(setupData.totp.secret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const onVerify = async (data: { code: string }) => {
    if (!setupData) return;
    setError(null);
    try {
      await verifyMFA(setupData.id, data.code);
      setSuccess(t("auth:mfa.verifySuccess"));
      setStep("list");
      reset();
      await loadFactors();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t("auth:mfa.verifyError"));
    }
  };

  const handleUnenroll = async (factorId: string) => {
    setError(null);
    try {
      await unenrollMFA(factorId);
      setSuccess(t("auth:mfa.unenrollSuccess"));
      await loadFactors();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t("common:errors.generic"));
    }
  };

  return (
    <div className="max-w-xl mx-auto py-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gold-500/10 flex items-center justify-center">
          <Shield className="w-5 h-5 text-gold-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">{t("auth:mfa.title")}</h1>
          <p className="text-text-secondary text-sm">{t("auth:mfa.subtitle")}</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-status-error/10 border border-status-error/30 text-status-error text-sm" role="alert">
          {error}
        </div>
      )}
      {success && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-4 p-3 rounded-xl bg-status-success/10 border border-status-success/30 text-status-success text-sm"
        >
          {success}
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {step === "list" && (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="glass-card p-6">
              {factors.length === 0 ? (
                <div className="text-center py-8">
                  <QrCode className="w-12 h-12 text-text-muted mx-auto mb-3" />
                  <p className="text-text-secondary text-sm mb-4">{t("auth:mfa.noFactors")}</p>
                  <button
                    onClick={startSetup}
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-500 text-black font-semibold text-sm hover:bg-gold-400 transition-colors disabled:opacity-60"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    {t("auth:mfa.addFactor")}
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {factors.map((factor) => (
                    <div
                      key={factor.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-surface-secondary border border-border"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-status-success/10 flex items-center justify-center">
                          <Shield className="w-4 h-4 text-status-success" />
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">{factor.friendly_name ?? "Authenticator TOTP"}</p>
                          <p className="text-text-muted text-xs capitalize">{factor.status}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleUnenroll(factor.id)}
                        className="p-2 text-text-muted hover:text-status-error transition-colors rounded-lg hover:bg-status-error/10"
                        aria-label={t("auth:mfa.removeFactor")}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={startSetup}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-border text-text-secondary hover:border-gold-500 hover:text-gold-400 transition-all text-sm"
                  >
                    <Plus className="w-4 h-4" /> {t("auth:mfa.addAnotherFactor")}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {step === "setup" && setupData && (
          <motion.div key="setup" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="glass-card p-6 space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-white mb-1">{t("auth:mfa.scanQR")}</h2>
                <p className="text-text-secondary text-sm">{t("auth:mfa.scanQRDesc")}</p>
              </div>

              {/* QR Code */}
              <div className="flex justify-center">
                <div className="p-4 bg-white rounded-2xl">
                  <img
                    src={setupData.totp.qr_code}
                    alt="QR Code for TOTP setup"
                    className="w-40 h-40"
                  />
                </div>
              </div>

              {/* Manual secret */}
              <div>
                <p className="text-text-secondary text-xs mb-2">{t("auth:mfa.orEnterManually")}</p>
                <div className="flex items-center gap-2 p-3 rounded-xl bg-surface-secondary border border-border">
                  <code className="flex-1 text-gold-400 text-sm font-mono tracking-widest break-all">
                    {setupData.totp.secret}
                  </code>
                  <button
                    type="button"
                    onClick={copySecret}
                    className="p-1.5 text-text-muted hover:text-gold-400 transition-colors"
                    aria-label="Copier le secret"
                  >
                    {copied ? <Check className="w-4 h-4 text-status-success" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep("verify")}
                className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-black font-semibold text-sm hover:from-gold-400 hover:to-gold-500 transition-all"
              >
                {t("auth:mfa.continueToVerify")}
              </button>
            </div>
          </motion.div>
        )}

        {step === "verify" && (
          <motion.div key="verify" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold text-white mb-1">{t("auth:mfa.enterCode")}</h2>
              <p className="text-text-secondary text-sm mb-6">{t("auth:mfa.enterCodeDesc")}</p>

              <form onSubmit={handleSubmit(onVerify)} className="space-y-4">
                <div>
                  <label htmlFor="mfa-code" className="block text-sm font-medium text-text-secondary mb-1.5">
                    {t("auth:mfa.code")}
                  </label>
                  <input
                    id="mfa-code"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    {...register("code", {
                      required: t("auth:mfa.codeRequired"),
                      pattern: { value: /^\d{6}$/, message: t("auth:mfa.codeInvalid") },
                    })}
                    className="w-full px-4 py-3 rounded-xl bg-surface-secondary border border-border focus:border-gold-500 focus:ring-1 focus:ring-gold-500 text-white text-center text-2xl font-mono tracking-widest outline-none transition-all"
                    placeholder="000000"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-black font-semibold text-sm hover:from-gold-400 hover:to-gold-500 transition-all disabled:opacity-60"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {t("auth:mfa.verify")}
                </button>

                <button
                  type="button"
                  onClick={() => setStep("setup")}
                  className="w-full text-center text-sm text-text-secondary hover:text-white transition-colors"
                >
                  {t("common:back")}
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
