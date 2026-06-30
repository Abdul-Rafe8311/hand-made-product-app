import type { Product, ProductKind } from "./types";

// The five categories the studio sells, in the order they appear on the shop
// page. Anything with an unknown or missing category falls into "Other" at the
// end so it is never silently dropped.
export const CATEGORIES = [
  "Crochet Bouquets",
  "Crochet",
  "Candles",
  "Wooden Decor",
  "Gift Baskets",
] as const;

export type Category = (typeof CATEGORIES)[number];

const CATEGORY_KIND: Record<string, ProductKind> = {
  "Crochet Bouquets": "bouquet",
  Crochet: "crochet",
  Candles: "candle",
  "Wooden Decor": "decor",
  "Gift Baskets": "giftbasket",
};

// Maps a category name to its placeholder art kind.
export function kindForCategory(
  category: string | null | undefined
): ProductKind | null {
  if (category && CATEGORY_KIND[category]) return CATEGORY_KIND[category];
  return null;
}

// A stable id/anchor for a category, used for section ids and "jump to" links.
export function categoryAnchor(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Splits products into category buckets in display order. Returns only the
// non-empty groups, with any uncategorised products gathered under "Other".
export function groupByCategory(
  products: Product[]
): { category: string; products: Product[] }[] {
  const buckets = new Map<string, Product[]>();
  for (const name of CATEGORIES) buckets.set(name, []);

  for (const product of products) {
    const key =
      product.category && product.category.trim().length > 0
        ? product.category
        : "Other";
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key)!.push(product);
  }

  return Array.from(buckets.entries())
    .filter(([, items]) => items.length > 0)
    .map(([category, items]) => ({ category, products: items }));
}
