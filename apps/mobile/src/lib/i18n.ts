import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { getLocales } from "expo-localization";

// ---- FR translations ----
import commonFR from "../i18n/locales/fr/common.json";
import authFR from "../i18n/locales/fr/auth.json";
import dashboardFR from "../i18n/locales/fr/dashboard.json";
import membersFR from "../i18n/locales/fr/members.json";
import classesFR from "../i18n/locales/fr/classes.json";
import billingFR from "../i18n/locales/fr/billing.json";
import errorsFR from "../i18n/locales/fr/errors.json";
import navigationFR from "../i18n/locales/fr/navigation.json";

// ---- EN translations ----
import commonEN from "../i18n/locales/en/common.json";
import authEN from "../i18n/locales/en/auth.json";
import dashboardEN from "../i18n/locales/en/dashboard.json";
import membersEN from "../i18n/locales/en/members.json";
import classesEN from "../i18n/locales/en/classes.json";
import billingEN from "../i18n/locales/en/billing.json";
import errorsEN from "../i18n/locales/en/errors.json";
import navigationEN from "../i18n/locales/en/navigation.json";

const deviceLocale = getLocales()[0]?.languageCode ?? "fr";
const supportedLng = ["fr", "en"];
const lng = supportedLng.includes(deviceLocale) ? deviceLocale : "fr";

i18n.use(initReactI18next).init({
  resources: {
    fr: {
      common: commonFR,
      auth: authFR,
      dashboard: dashboardFR,
      members: membersFR,
      classes: classesFR,
      billing: billingFR,
      errors: errorsFR,
      navigation: navigationFR,
    },
    en: {
      common: commonEN,
      auth: authEN,
      dashboard: dashboardEN,
      members: membersEN,
      classes: classesEN,
      billing: billingEN,
      errors: errorsEN,
      navigation: navigationEN,
    },
  },
  lng,
  fallbackLng: "fr",
  ns: ["common", "auth", "dashboard", "members", "classes", "billing", "errors", "navigation"],
  defaultNS: "common",
  interpolation: { escapeValue: false },
});

export default i18n;
