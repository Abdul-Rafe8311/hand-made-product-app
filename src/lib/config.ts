// Client-safe configuration. Nothing here may read a server-only secret,
// because this module is imported by client components too.

export const BRAND = {
  name: "Maati & Co.",
  tagline: "Handmade goods, made in small lots.",
} as const;

// Single currency config value. Defaults to "$". For a Pakistani client set
// NEXT_PUBLIC_CURRENCY_SYMBOL to "Rs" (and configure Easypaisa / JazzCash in
// the payment env vars, see the README).
export const CURRENCY_SYMBOL =
  process.env.NEXT_PUBLIC_CURRENCY_SYMBOL?.trim() || "$";

// Public base URL of the site, used to build links in emails. No trailing slash.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
).replace(/\/$/, "");
