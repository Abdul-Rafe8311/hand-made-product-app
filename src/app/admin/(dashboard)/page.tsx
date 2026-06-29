import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatMoney } from "@/lib/money";
import {
  ORDER_STATUSES,
  ORDER_STATUS_LABELS,
  type OrderStatus,
  type OrderWithItems,
} from "@/lib/types";
import { updateOrderStatus } from "../actions";

export const dynamic = "force-dynamic";

const SCREENSHOT_BUCKET = "payment-screenshots";
const SIGNED_URL_TTL = 60 * 60; // 1 hour

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending_payment: "border-ochre/40 bg-ochre/10 text-ink",
  paid: "border-olive/40 bg-olive/15 text-olive",
  shipped: "border-ink/30 bg-ink/10 text-ink",
  cancelled: "border-ink/20 bg-ink/5 text-ink/50",
};

export default async function AdminOrdersPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <p className="mt-10 rounded-lg border border-ochre/40 bg-ochre/10 px-4 py-3 text-sm">
        Could not load orders: {error.message}
      </p>
    );
  }

  const orders = (data ?? []) as OrderWithItems[];

  // Sign each screenshot with the service role; the bucket is private and has
  // no authenticated read policy, so signing happens server side here.
  const admin = createAdminClient();
  const signedUrls = new Map<string, string>();
  await Promise.all(
    orders.map(async (order) => {
      if (!order.payment_screenshot_url) return;
      const { data: signed } = await admin.storage
        .from(SCREENSHOT_BUCKET)
        .createSignedUrl(order.payment_screenshot_url, SIGNED_URL_TTL);
      if (signed?.signedUrl) signedUrls.set(order.id, signed.signedUrl);
    })
  );

  if (orders.length === 0) {
    return <p className="mt-10 text-ink/60">No orders yet.</p>;
  }

  return (
    <div className="mt-8 space-y-6">
      {orders.map((order) => {
        const screenshotUrl = signedUrls.get(order.id);
        return (
          <article key={order.id} className="card p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="font-mono text-lg">{order.order_number}</div>
                <div className="label mt-1 text-ink/45">
                  {new Date(order.created_at).toLocaleString()}
                </div>
              </div>
              <div className="flex flex-col items-end gap-3">
                <span
                  className={`label rounded-full border px-3 py-1 ${STATUS_STYLES[order.status]}`}
                >
                  {ORDER_STATUS_LABELS[order.status]}
                </span>
                <form
                  action={updateOrderStatus}
                  className="flex items-center gap-2"
                >
                  <input type="hidden" name="orderId" value={order.id} />
                  <label htmlFor={`status-${order.id}`} className="sr-only">
                    Update status for {order.order_number}
                  </label>
                  <select
                    id={`status-${order.id}`}
                    name="status"
                    defaultValue={order.status}
                    className="rounded-lg border border-ink/20 bg-paper px-3 py-1.5 text-sm focus:border-ochre focus:outline-none"
                  >
                    {ORDER_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {ORDER_STATUS_LABELS[status]}
                      </option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    className="btn btn-ink !px-3 !py-1.5 text-sm"
                  >
                    Update
                  </button>
                </form>
              </div>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-[1.3fr_1fr_0.9fr]">
              {/* Items */}
              <div>
                <div className="label text-ink/45">Items</div>
                <ul className="mt-2 space-y-1.5 text-sm">
                  {order.order_items.map((item) => (
                    <li key={item.id} className="flex justify-between gap-3">
                      <span className="min-w-0">
                        {item.product_name}
                        <span className="font-mono text-ink/55"> x{item.quantity}</span>
                      </span>
                      <span className="font-mono">{formatMoney(item.line_total)}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 flex justify-between border-t border-line pt-2 text-sm font-semibold">
                  <span>Total</span>
                  <span className="font-mono">{formatMoney(order.total)}</span>
                </div>
              </div>

              {/* Delivery */}
              <div className="text-sm">
                <div className="label text-ink/45">Delivery</div>
                <div className="mt-2 space-y-0.5">
                  <div>{order.customer_name}</div>
                  <div className="text-ink/65">{order.email}</div>
                  <div className="text-ink/65">{order.phone}</div>
                  <div className="mt-1 text-ink/65">
                    {order.address}
                    <br />
                    {order.city} {order.postal_code}
                  </div>
                </div>
              </div>

              {/* Screenshot */}
              <div>
                <div className="label text-ink/45">Payment screenshot</div>
                {screenshotUrl ? (
                  <a
                    href={screenshotUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 block overflow-hidden rounded-lg border border-line"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={screenshotUrl}
                      alt={`Payment for ${order.order_number}`}
                      className="h-36 w-full object-cover transition hover:opacity-90"
                    />
                  </a>
                ) : (
                  <p className="mt-2 text-sm text-ink/50">None attached</p>
                )}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
