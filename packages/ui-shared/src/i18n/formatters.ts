const DEFAULT_LOCALE = "fr-FR";
const DEFAULT_CURRENCY = "EUR";

function toDate(value: Date | string): Date {
  return value instanceof Date ? value : new Date(value);
}

/**
 * Format a date in the given locale (default: 'fr-FR').
 * French default produces DD/MM/YYYY.
 */
export function formatDate(
  date: Date | string,
  locale: string = DEFAULT_LOCALE,
  options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }
): string {
  return new Intl.DateTimeFormat(locale, options).format(toDate(date));
}

/**
 * Format a time in the given locale (default: 'fr-FR', 24h for FR).
 */
export function formatTime(
  date: Date | string,
  locale: string = DEFAULT_LOCALE
): string {
  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: locale.startsWith("en"),
  }).format(toDate(date));
}

/**
 * Format an amount in cents as currency (default: EUR, French format: 1 234,56 €).
 */
export function formatCurrency(
  amountCents: number,
  locale: string = DEFAULT_LOCALE,
  currency: string = DEFAULT_CURRENCY
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amountCents / 100);
}

/**
 * Format a phone number in French format: +33 X XX XX XX XX.
 * Handles both +33 and 0X formats.
 */
export function formatPhone(phone: string, locale: string = DEFAULT_LOCALE): string {
  const digits = phone.replace(/\D/g, "");

  // French formatting
  if (locale.startsWith("fr") || !locale) {
    let national = digits;

    if (national.startsWith("33") && national.length === 11) {
      national = "0" + national.slice(2);
    } else if (national.startsWith("0") && national.length === 10) {
      // already national format
    } else {
      return phone; // unknown format, return as-is
    }

    const groups = national.match(/^(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/);
    if (!groups) return phone;

    const [, g1, g2, g3, g4, g5] = groups;
    const intl = "+33 " + [g1.slice(1), g2, g3, g4, g5].join(" ");
    return intl;
  }

  return phone;
}

/**
 * Format a relative date ("il y a 2 jours", "in 3 days").
 */
export function formatRelativeDate(
  date: Date | string,
  locale: string = DEFAULT_LOCALE
): string {
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  const now = Date.now();
  const target = toDate(date).getTime();
  const diffMs = target - now;
  const diffSeconds = Math.round(diffMs / 1000);

  const abs = Math.abs(diffSeconds);

  if (abs < 60) return rtf.format(diffSeconds, "second");
  if (abs < 3600) return rtf.format(Math.round(diffSeconds / 60), "minute");
  if (abs < 86400) return rtf.format(Math.round(diffSeconds / 3600), "hour");
  if (abs < 2592000) return rtf.format(Math.round(diffSeconds / 86400), "day");
  if (abs < 31536000) return rtf.format(Math.round(diffSeconds / 2592000), "month");
  return rtf.format(Math.round(diffSeconds / 31536000), "year");
}

/**
 * Format a number with locale-aware separators.
 */
export function formatNumber(
  value: number,
  locale: string = DEFAULT_LOCALE,
  options?: Intl.NumberFormatOptions
): string {
  return new Intl.NumberFormat(locale, options).format(value);
}
