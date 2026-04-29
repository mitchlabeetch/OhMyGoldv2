// ---- String Utilities ----

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function fullName(firstName: string, lastName: string): string {
  return `${capitalize(firstName)} ${lastName.toUpperCase()}`;
}

export function initials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// ---- Date / Time Utilities ----

export function formatDate(
  date: string | Date,
  locale: "fr" | "en" = "fr",
  options?: Intl.DateTimeFormatOptions,
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString(locale === "fr" ? "fr-FR" : "en-GB", options);
}

export function formatDateTime(
  date: string | Date,
  locale: "fr" | "en" = "fr",
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleString(locale === "fr" ? "fr-FR" : "en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function formatTime(date: string | Date, locale: "fr" | "en" = "fr"): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleTimeString(locale === "fr" ? "fr-FR" : "en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function isExpired(date: string | Date): boolean {
  const d = typeof date === "string" ? new Date(date) : date;
  return d < new Date();
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function daysDiff(a: Date | string, b: Date | string): number {
  const da = typeof a === "string" ? new Date(a) : a;
  const db = typeof b === "string" ? new Date(b) : b;
  return Math.floor((db.getTime() - da.getTime()) / (1000 * 60 * 60 * 24));
}

// ---- Currency Utilities ----

export function formatCurrency(
  cents: number,
  currency = "EUR",
  locale: "fr" | "en" = "fr",
): string {
  return new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-GB", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(cents / 100);
}

// ---- Array / Object Utilities ----

export function groupBy<T>(
  items: T[],
  key: keyof T,
): Record<string, T[]> {
  return items.reduce(
    (acc, item) => {
      const groupKey = String(item[key]);
      if (!acc[groupKey]) acc[groupKey] = [];
      acc[groupKey].push(item);
      return acc;
    },
    {} as Record<string, T[]>,
  );
}

export function uniqueBy<T>(items: T[], key: keyof T): T[] {
  const seen = new Set<unknown>();
  return items.filter((item) => {
    const val = item[key];
    if (seen.has(val)) return false;
    seen.add(val);
    return true;
  });
}

export function sortBy<T>(
  items: T[],
  key: keyof T,
  direction: "asc" | "desc" = "asc",
): T[] {
  return [...items].sort((a, b) => {
    const va = a[key];
    const vb = b[key];
    if (va < vb) return direction === "asc" ? -1 : 1;
    if (va > vb) return direction === "asc" ? 1 : -1;
    return 0;
  });
}

// ---- Validation Utilities ----

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidFrenchPhone(phone: string): boolean {
  return /^(\+33|0)[1-9](\d{2}){4}$/.test(phone.replace(/\s/g, ""));
}

export function passwordStrength(password: string): "weak" | "medium" | "strong" {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 2) return "weak";
  if (score <= 4) return "medium";
  return "strong";
}

// ---- Membership / Gym Utilities ----

export function generateMembershipNumber(gymPrefix: string, sequence: number): string {
  return `${gymPrefix.toUpperCase()}-${String(sequence).padStart(6, "0")}`;
}

export function isClassFull(current: number, max: number): boolean {
  return current >= max;
}

export function availableSpots(current: number, max: number): number {
  return Math.max(0, max - current);
}
