import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Order confirmed",
};

type Params = { params: Promise<{ number: string }> };

// Orders are not client-readable (RLS), so this confirmation page is built from
// the order number in the URL alone. The customer gets the full details by
// email; the company verifies the payment in the admin area.
export default async function OrderConfirmationPage({ params }: Params) {
  const { number } = await params;
  const orderNumber = decodeURIComponent(number);

  return (
    <div className="mx-auto max-w-2xl px-5 py-20 text-center">
      <div
        className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-olive/15 text-olive"
        aria-hidden="true"
      >
        <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </div>

      <p className="label mt-6 text-ochre-deep">Thank you</p>
      <h1 className="mt-2 font-display text-4xl font-bold">Order received</h1>

      <div className="card mx-auto mt-7 inline-block px-6 py-4">
        <div className="label text-ink/45">Order number</div>
        <div className="mt-1 font-mono text-2xl">{orderNumber}</div>
      </div>

      <div className="mx-auto mt-7 inline-flex items-center gap-2 rounded-full border border-ochre/40 bg-ochre/10 px-4 py-2">
        <span className="h-2 w-2 rounded-full bg-ochre" aria-hidden="true" />
        <span className="label text-ink">Payment pending</span>
      </div>

      <p className="mx-auto mt-7 max-w-md text-ink/70">
        We have sent a confirmation email with your order details. Once we verify
        your bank transfer against the screenshot you attached, we will start
        packing your order by hand and email you again when it ships.
      </p>

      <div className="mt-9 flex flex-wrap justify-center gap-3">
        <Link href="/shop" className="btn btn-ink">
          Continue shopping
        </Link>
        <Link href="/" className="btn btn-outline">
          Back home
        </Link>
      </div>
    </div>
  );
}
