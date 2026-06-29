"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { CopyButton } from "@/components/CopyButton";
import { formatMoney } from "@/lib/money";
import { placeOrder } from "./actions";
import type { PaymentMethod } from "@/lib/types";

const FIELDS = [
  { name: "customer_name", label: "Full name", type: "text", autoComplete: "name", full: true },
  { name: "email", label: "Email", type: "email", autoComplete: "email", full: false },
  { name: "phone", label: "Phone", type: "tel", autoComplete: "tel", full: false },
  { name: "address", label: "Address", type: "text", autoComplete: "street-address", full: true },
  { name: "city", label: "City", type: "text", autoComplete: "address-level2", full: false },
  { name: "postal_code", label: "Postal code", type: "text", autoComplete: "postal-code", full: false },
] as const;

type FieldName = (typeof FIELDS)[number]["name"];
type FormState = Record<FieldName, string>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EMPTY: FormState = {
  customer_name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  postal_code: "",
};

export function CheckoutForm({
  paymentMethods,
}: {
  paymentMethods: PaymentMethod[];
}) {
  const router = useRouter();
  const { items, hydrated, subtotal, clear } = useCart();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fieldsValid = useMemo(() => {
    return FIELDS.every((field) => {
      const value = form[field.name].trim();
      if (!value) return false;
      if (field.name === "email") return EMAIL_RE.test(value);
      return true;
    });
  }, [form]);

  const canSubmit =
    hydrated && items.length > 0 && fieldsValid && !!file && !submitting;

  function update(name: FieldName, value: string) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const next = event.target.files?.[0] ?? null;
    setFile(next);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(next ? URL.createObjectURL(next) : null);
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!canSubmit || !file) return;
    setSubmitting(true);
    setError(null);

    const data = new FormData();
    for (const field of FIELDS) data.set(field.name, form[field.name].trim());
    data.set(
      "cart",
      JSON.stringify(
        items.map((item) => ({ productId: item.productId, quantity: item.quantity }))
      )
    );
    data.set("screenshot", file);

    try {
      const result = await placeOrder(data);
      if (result.ok) {
        clear();
        router.push(`/order/${result.orderNumber}`);
      } else {
        setError(result.error);
        setSubmitting(false);
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  if (hydrated && items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-20 text-center">
        <h1 className="font-display text-4xl font-bold">Your cart is empty</h1>
        <p className="mt-4 text-ink/70">
          Add something from the catalogue before checking out.
        </p>
        <Link href="/shop" className="btn btn-ink mt-8">
          Browse the catalogue
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-6xl px-5 py-12">
      <h1 className="font-display text-4xl font-bold">Checkout</h1>
      <p className="mt-2 text-ink/65">
        Enter your delivery details, send the transfer, and attach a screenshot of
        it. We verify every payment by hand before shipping.
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-10">
          {/* Delivery */}
          <section>
            <h2 className="font-display text-xl font-semibold">Delivery details</h2>
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {FIELDS.map((field) => (
                <div
                  key={field.name}
                  className={field.full ? "sm:col-span-2" : undefined}
                >
                  <label
                    htmlFor={field.name}
                    className="label block text-ink/55"
                  >
                    {field.label}
                  </label>
                  <input
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    autoComplete={field.autoComplete}
                    required
                    value={form[field.name]}
                    onChange={(event) => update(field.name, event.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-ink/20 bg-card px-3.5 py-2.5 text-sm focus:border-ochre focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Payment */}
          <section>
            <h2 className="font-display text-xl font-semibold">Payment by transfer</h2>
            <p className="mt-2 text-sm text-ink/65">
              Send exactly{" "}
              <span className="font-mono font-semibold">{formatMoney(subtotal)}</span>{" "}
              to one of the accounts below, then attach your screenshot.
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {paymentMethods.map((method) => (
                <div key={method.kind} className="card p-5">
                  <div className="flex items-center justify-between">
                    <span className="label text-ochre-deep">{method.label}</span>
                  </div>
                  <div className="mt-3 text-sm">
                    <div className="text-ink/55">Account name</div>
                    <div className="font-mono">{method.accountName}</div>
                  </div>
                  {method.fields.map((detail) => (
                    <div
                      key={detail.label}
                      className="mt-3 flex items-end justify-between gap-3 text-sm"
                    >
                      <div className="min-w-0">
                        <div className="text-ink/55">{detail.label}</div>
                        <div className="truncate font-mono">{detail.value}</div>
                      </div>
                      <CopyButton value={detail.value} label={detail.label} />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </section>

          {/* Screenshot */}
          <section>
            <h2 className="font-display text-xl font-semibold">Payment screenshot</h2>
            <p className="mt-2 text-sm text-ink/65">
              Attach a screenshot of your completed transfer. This is required.
            </p>

            <label
              htmlFor="screenshot"
              className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-ink/25 bg-card px-5 py-8 text-center transition hover:border-ochre"
            >
              {previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewUrl}
                  alt="Payment screenshot preview"
                  className="max-h-44 rounded-lg object-contain"
                />
              ) : (
                <span className="label text-ink/55">
                  Tap to choose an image
                </span>
              )}
              {file ? (
                <span className="mt-3 font-mono text-xs text-ink/60">
                  {file.name}
                </span>
              ) : null}
              <input
                id="screenshot"
                name="screenshot"
                type="file"
                accept="image/*"
                required
                onChange={onFileChange}
                className="sr-only"
              />
            </label>
          </section>
        </div>

        {/* Summary */}
        <aside className="card h-fit p-6 lg:sticky lg:top-24">
          <h2 className="font-display text-xl font-semibold">Your order</h2>
          {hydrated ? (
            <ul className="mt-5 space-y-3 text-sm">
              {items.map((item) => (
                <li key={item.productId} className="flex justify-between gap-3">
                  <span className="min-w-0">
                    <span className="block truncate">{item.name}</span>
                    <span className="label text-ink/45">x{item.quantity}</span>
                  </span>
                  <span className="font-mono">
                    {formatMoney(item.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-5 label text-ink/40">Loading...</p>
          )}

          <div className="mt-5 flex items-center justify-between border-t border-line pt-5">
            <span className="font-display text-lg font-semibold">Total</span>
            <span className="font-mono text-lg">{formatMoney(subtotal)}</span>
          </div>

          {error ? (
            <p
              className="mt-5 rounded-lg border border-ochre/40 bg-ochre/10 px-3 py-2 text-sm text-ink"
              role="alert"
            >
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            className="btn btn-ink mt-6 w-full"
            disabled={!canSubmit}
          >
            {submitting ? "Placing order..." : "Place order"}
          </button>
          <p className="mt-3 text-center text-xs text-ink/50">
            The button stays disabled until every field is filled and a screenshot
            is attached.
          </p>
        </aside>
      </div>
    </form>
  );
}
