import { CURRENCY_SYMBOL } from "./config";

// Prices are stored as integers in the smallest currency unit (cents).
// Whole amounts render without decimals; fractional ones keep two places.
export function formatMoney(amountInSmallestUnit: number): string {
  const value = amountInSmallestUnit / 100;
  const hasFraction = Math.round(amountInSmallestUnit) % 100 !== 0;
  const formatted = value.toLocaleString("en-US", {
    minimumFractionDigits: hasFraction ? 2 : 0,
    maximumFractionDigits: 2,
  });
  // A multi-character symbol like "Rs" reads better with a space; "$" sits tight.
  const separator = CURRENCY_SYMBOL.length > 1 ? " " : "";
  return `${CURRENCY_SYMBOL}${separator}${formatted}`;
}

// Customer-facing price label. Prices are still being set on the new catalogue,
// so a price of 0 shows "Price on request" rather than a misleading free total.
export function formatPriceLabel(amountInSmallestUnit: number): string {
  if (!amountInSmallestUnit || amountInSmallestUnit <= 0) {
    return "Price on request";
  }
  return formatMoney(amountInSmallestUnit);
}
