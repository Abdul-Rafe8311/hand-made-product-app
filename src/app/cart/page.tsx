"use client";

import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { QuantityStepper } from "@/components/QuantityStepper";
import { ProductArt, resolveKind } from "@/components/ProductArt";
import { formatMoney } from "@/lib/money";

export default function CartPage() {
  const { items, hydrated, subtotal, setQuantity, remove } = useCart();

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-20">
        <p className="label text-ink/40">Loading your cart...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-20 text-center">
        <p className="label text-ink/45">Your cart</p>
        <h1 className="mt-3 font-display text-4xl font-bold">Nothing here yet</h1>
        <p className="mt-4 text-ink/70">
          Your cart is empty. Have a look through the latest lots and add something
          made by hand.
        </p>
        <Link href="/shop" className="btn btn-ink mt-8">
          Browse the catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <h1 className="font-display text-4xl font-bold">Your cart</h1>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        {/* Items */}
        <ul className="divide-y divide-line border-y border-line">
          {items.map((item) => (
            <li
              key={item.productId}
              className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center"
            >
              <Link
                href={`/product/${item.slug}`}
                className="card h-24 w-24 shrink-0 overflow-hidden"
              >
                <ProductArt
                  kind={resolveKind({ slug: item.slug, category: null })}
                  imageUrl={item.imageUrl}
                  alt={item.name}
                />
              </Link>

              <div className="min-w-0 flex-1">
                <div className="label text-ink/45">
                  Lot {item.lot} &middot; {item.sku}
                </div>
                <Link
                  href={`/product/${item.slug}`}
                  className="font-display text-lg leading-snug transition hover:text-ochre-deep"
                >
                  {item.name}
                </Link>
                <div className="mt-1 font-mono text-sm text-ink/70">
                  {formatMoney(item.price)} each
                </div>
              </div>

              <div className="flex items-center gap-5">
                <QuantityStepper
                  value={item.quantity}
                  onChange={(value) => setQuantity(item.productId, value)}
                  size="sm"
                  label={`Quantity for ${item.name}`}
                />
                <div className="w-20 text-right font-mono">
                  {formatMoney(item.price * item.quantity)}
                </div>
                <button
                  type="button"
                  onClick={() => remove(item.productId)}
                  className="label text-ink/45 transition hover:text-ochre-deep"
                  aria-label={`Remove ${item.name} from cart`}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>

        {/* Summary */}
        <aside className="card h-fit p-6">
          <h2 className="font-display text-xl font-semibold">Order summary</h2>
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink/65">Subtotal</dt>
              <dd className="font-mono">{formatMoney(subtotal)}</dd>
            </div>
            <div className="flex justify-between text-ink/55">
              <dt>Delivery</dt>
              <dd className="font-mono">Calculated after we confirm</dd>
            </div>
          </dl>
          <div className="mt-5 flex items-center justify-between border-t border-line pt-5">
            <span className="font-display text-lg font-semibold">Total</span>
            <span className="font-mono text-lg">{formatMoney(subtotal)}</span>
          </div>
          <Link href="/checkout" className="btn btn-ink mt-6 w-full">
            Proceed to checkout
          </Link>
          <Link
            href="/shop"
            className="mt-3 block text-center text-sm text-ink/55 transition hover:text-ochre-deep"
          >
            Keep shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}
