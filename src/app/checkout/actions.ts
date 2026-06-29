"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { sendOrderEmails } from "@/lib/email";
import type { Order } from "@/lib/types";

const SCREENSHOT_BUCKET = "payment-screenshots";
const MAX_SCREENSHOT_BYTES = 8 * 1024 * 1024; // 8 MB
const SIGNED_URL_TTL = 60 * 60 * 24 * 7; // 7 days

export type PlaceOrderResult =
  | { ok: true; orderNumber: string }
  | { ok: false; error: string };

type IncomingItem = { productId: string; quantity: number };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function requireText(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

// Places an order. Never trusts client-supplied prices or totals: it re-fetches
// every product from the database, recomputes line and order totals on the
// server, uploads the screenshot to a private bucket, inserts atomically via
// the place_order RPC, then emails the customer and the company.
export async function placeOrder(
  formData: FormData
): Promise<PlaceOrderResult> {
  try {
    // 1. Delivery details.
    const customer_name = requireText(formData, "customer_name");
    const email = requireText(formData, "email");
    const phone = requireText(formData, "phone");
    const address = requireText(formData, "address");
    const city = requireText(formData, "city");
    const postal_code = requireText(formData, "postal_code");

    if (!customer_name || !email || !phone || !address || !city || !postal_code) {
      return { ok: false, error: "Please fill in every delivery field." };
    }
    if (!EMAIL_RE.test(email)) {
      return { ok: false, error: "Please enter a valid email address." };
    }

    // 2. Cart (ids and quantities only; prices come from the database).
    let incoming: IncomingItem[];
    try {
      const raw = JSON.parse(requireText(formData, "cart") || "[]");
      incoming = (Array.isArray(raw) ? raw : [])
        .map((entry) => ({
          productId: String(entry?.productId ?? ""),
          quantity: Math.floor(Number(entry?.quantity ?? 0)),
        }))
        .filter((entry) => entry.productId && entry.quantity > 0);
    } catch {
      return { ok: false, error: "Your cart could not be read. Please try again." };
    }

    if (incoming.length === 0) {
      return { ok: false, error: "Your cart is empty." };
    }
    if (incoming.some((entry) => entry.quantity > 99)) {
      return { ok: false, error: "Quantities are limited to 99 per item." };
    }

    // 3. Screenshot.
    const screenshot = formData.get("screenshot");
    if (!(screenshot instanceof File) || screenshot.size === 0) {
      return { ok: false, error: "Please attach your payment screenshot." };
    }
    if (!screenshot.type.startsWith("image/")) {
      return { ok: false, error: "The payment screenshot must be an image." };
    }
    if (screenshot.size > MAX_SCREENSHOT_BYTES) {
      return { ok: false, error: "That image is too large (8 MB maximum)." };
    }

    const admin = createAdminClient();

    // 4. Re-fetch products and recompute totals on the server.
    const ids = [...new Set(incoming.map((entry) => entry.productId))];
    const { data: products, error: productsError } = await admin
      .from("products")
      .select("id, name, price, active")
      .in("id", ids);

    if (productsError) {
      return { ok: false, error: "We could not verify your cart. Please try again." };
    }

    const byId = new Map((products ?? []).map((product) => [product.id, product]));
    const items = [];
    let subtotal = 0;

    for (const entry of incoming) {
      const product = byId.get(entry.productId);
      if (!product || !product.active) {
        return {
          ok: false,
          error: "One of your items is no longer available. Please review your cart.",
        };
      }
      const lineTotal = product.price * entry.quantity;
      subtotal += lineTotal;
      items.push({
        product_id: product.id,
        product_name: product.name,
        unit_price: product.price,
        quantity: entry.quantity,
      });
    }

    // 5. Upload the screenshot to the private bucket.
    const extension = screenshot.name.includes(".")
      ? screenshot.name.split(".").pop()
      : screenshot.type.split("/")[1] || "png";
    const screenshotPath = `screenshots/${Date.now()}-${crypto.randomUUID()}.${extension}`;
    const buffer = Buffer.from(await screenshot.arrayBuffer());

    const { error: uploadError } = await admin.storage
      .from(SCREENSHOT_BUCKET)
      .upload(screenshotPath, buffer, {
        contentType: screenshot.type,
        upsert: false,
      });

    if (uploadError) {
      return {
        ok: false,
        error: "We could not save your payment screenshot. Please try again.",
      };
    }

    // 6. Insert the order and its items atomically; get the order number back.
    const { data: orderNumber, error: rpcError } = await admin.rpc("place_order", {
      p_customer_name: customer_name,
      p_email: email,
      p_phone: phone,
      p_address: address,
      p_city: city,
      p_postal_code: postal_code,
      p_screenshot_path: screenshotPath,
      p_items: items,
    });

    if (rpcError || !orderNumber) {
      // Best effort: don't leave an orphaned screenshot behind.
      await admin.storage.from(SCREENSHOT_BUCKET).remove([screenshotPath]);
      return {
        ok: false,
        error: "We could not place your order. Please try again in a moment.",
      };
    }

    // 7. Sign the screenshot so the company can verify the transfer by email.
    const { data: signed } = await admin.storage
      .from(SCREENSHOT_BUCKET)
      .createSignedUrl(screenshotPath, SIGNED_URL_TTL);

    const order: Order = {
      id: "",
      order_number: orderNumber as string,
      customer_name,
      email,
      phone,
      address,
      city,
      postal_code,
      subtotal,
      total: subtotal,
      status: "pending_payment",
      payment_screenshot_url: screenshotPath,
      created_at: new Date().toISOString(),
    };

    await sendOrderEmails({
      order,
      items: items.map((item) => ({
        product_name: item.product_name,
        quantity: item.quantity,
        unit_price: item.unit_price,
        line_total: item.unit_price * item.quantity,
      })),
      screenshotSignedUrl: signed?.signedUrl ?? null,
    });

    return { ok: true, orderNumber: orderNumber as string };
  } catch (error) {
    console.error("placeOrder failed:", error);
    return {
      ok: false,
      error: "Something went wrong placing your order. Please try again.",
    };
  }
}
