// Client-safe configuration. Nothing here may read a server-only secret,
// because this module is imported by client components too.

export const BRAND = {
  name: "Maati & Co.",
  tagline: "Handmade goods, made in small lots.",
} as const;

// Company contact details, shown in the footer and anywhere customers need to
// reach the studio. Single source of truth so they only change in one place.
export const CONTACT = {
  email: "tehsheemmumtaz2@gmail.com",
  phone: "+92 344 8607777",
  phoneHref: "tel:+923448607777",
  location: "Sargodha, Punjab, Pakistan",
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
