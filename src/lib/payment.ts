import "server-only";

import { BRAND } from "./config";
import type { PaymentMethod } from "./types";

// Reads the configured transfer accounts from server-only env. The bank panel
// is always shown. Easypaisa and JazzCash appear next to it only when their
// account numbers are set, which is the switch a Pakistani client turns on.
export function getPaymentMethods(): PaymentMethod[] {
  const methods: PaymentMethod[] = [];

  methods.push({
    kind: "bank",
    label: "Bank transfer",
    accountName: process.env.BANK_ACCOUNT_NAME || BRAND.name,
    fields: [
      {
        label: "Account number",
        value: process.env.BANK_ACCOUNT_NUMBER || "Not configured",
      },
      { label: "IBAN", value: process.env.BANK_IBAN || "Not configured" },
    ],
  });

  const easypaisa = process.env.EASYPAISA_ACCOUNT?.trim();
  if (easypaisa) {
    methods.push({
      kind: "easypaisa",
      label: "Easypaisa",
      accountName: BRAND.name,
      fields: [{ label: "Account", value: easypaisa }],
    });
  }

  const jazzcash = process.env.JAZZCASH_ACCOUNT?.trim();
  if (jazzcash) {
    methods.push({
      kind: "jazzcash",
      label: "JazzCash",
      accountName: BRAND.name,
      fields: [{ label: "Account", value: jazzcash }],
    });
  }

  return methods;
}
