import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// French translations
import frCommon from "./locales/fr/common.json";
import frAuth from "./locales/fr/auth.json";
import frMembers from "./locales/fr/members.json";
import frClasses from "./locales/fr/classes.json";
import frPayments from "./locales/fr/payments.json";
import frDashboard from "./locales/fr/dashboard.json";
import frErrors from "./locales/fr/errors.json";

// English translations
import enCommon from "./locales/en/common.json";
import enAuth from "./locales/en/auth.json";
import enMembers from "./locales/en/members.json";
import enClasses from "./locales/en/classes.json";
import enPayments from "./locales/en/payments.json";
import enDashboard from "./locales/en/dashboard.json";
import enErrors from "./locales/en/errors.json";

export const defaultNS = "common";
export const resources = {
  fr: {
    common: frCommon,
    auth: frAuth,
    members: frMembers,
    classes: frClasses,
    payments: frPayments,
    dashboard: frDashboard,
    errors: frErrors,
  },
  en: {
    common: enCommon,
    auth: enAuth,
    members: enMembers,
    classes: enClasses,
    payments: enPayments,
    dashboard: enDashboard,
    errors: enErrors,
  },
} as const;

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    defaultNS,
    fallbackLng: "fr",
    supportedLngs: ["fr", "en"],
    detection: {
      order: ["localStorage", "navigator"],
      lookupLocalStorage: "omg_language",
      caches: ["localStorage"],
    },
    interpolation: {
      escapeValue: false, // React handles XSS
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
