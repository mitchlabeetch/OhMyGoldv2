import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { getLocales } from "expo-localization";

// ---- FR translations ----
import commonFR from "../i18n/locales/fr/common.json";
import authFR from "../i18n/locales/fr/auth.json";
import dashboardFR from "../i18n/locales/fr/dashboard.json";

// ---- EN translations ----
import commonEN from "../i18n/locales/en/common.json";
import authEN from "../i18n/locales/en/auth.json";
import dashboardEN from "../i18n/locales/en/dashboard.json";

const deviceLocale = getLocales()[0]?.languageCode ?? "fr";
const supportedLng = ["fr", "en"];
const lng = supportedLng.includes(deviceLocale) ? deviceLocale : "fr";

i18n.use(initReactI18next).init({
  resources: {
    fr: { common: commonFR, auth: authFR, dashboard: dashboardFR },
    en: { common: commonEN, auth: authEN, dashboard: dashboardEN },
  },
  lng,
  fallbackLng: "fr",
  ns: ["common", "auth", "dashboard"],
  defaultNS: "common",
  interpolation: { escapeValue: false },
});

export default i18n;
