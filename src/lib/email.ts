import "server-only";

import nodemailer, { type Transporter } from "nodemailer";
import { BRAND, SITE_URL } from "./config";
import { formatMoney } from "./money";
import { ORDER_STATUS_LABELS } from "./types";
import type { Order, OrderItem } from "./types";

export type OrderEmailLine = Pick<
  OrderItem,
  "product_name" | "quantity" | "unit_price" | "line_total"
>;

export type OrderEmailData = {
  order: Order;
  items: OrderEmailLine[];
  screenshotSignedUrl: string | null;
};

const INK = "#1e2c47";
const OCHRE = "#d8941f";
const PAPER = "#f1ede4";

// --- Transporter ------------------------------------------------------------
// One reusable Gmail SMTP transporter, created lazily and cached. Returns null
// when the credentials are not configured so callers can skip sending without
// crashing. Credentials live only in env (EMAIL_USER / EMAIL_PASS).
let cachedTransporter: Transporter | null = null;

export function getTransporter(): Transporter | null {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    console.warn("EMAIL_USER / EMAIL_PASS are not set; skipping order emails.");
    return null;
  }

  if (!cachedTransporter) {
    cachedTransporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });
  }

  return cachedTransporter;
}

function fromAddress(): string {
  return `${BRAND.name} <${process.env.EMAIL_USER}>`;
}

// --- Shared HTML building blocks --------------------------------------------
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function shell(title: string, body: string): string {
  return `
  <div style="background:${PAPER};padding:32px 16px;font-family:Arial,Helvetica,sans-serif;color:${INK};">
    <div style="max-width:560px;margin:0 auto;background:#fbf9f3;border:1px solid #d9d3c6;border-radius:14px;overflow:hidden;">
      <div style="background:${INK};color:${PAPER};padding:20px 28px;">
        <div style="font-size:20px;font-weight:700;letter-spacing:0.5px;">${BRAND.name}</div>
        <div style="font-size:12px;opacity:0.8;">${BRAND.tagline}</div>
      </div>
      <div style="padding:28px;">
        <h1 style="font-size:18px;margin:0 0 16px;">${title}</h1>
        ${body}
      </div>
    </div>
  </div>`;
}

// One line-items table used by both emails. The owner version also shows the
// unit price column, so there is a single source of truth for the markup.
function lineItemsTable(items: OrderEmailLine[], total: number, showUnitPrice: boolean): string {
  const head = `
    <tr style="text-align:left;color:#6b6453;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;">
      <th style="padding:0 0 8px;">Item</th>
      ${showUnitPrice ? `<th style="padding:0 0 8px;text-align:right;">Unit</th>` : ""}
      <th style="padding:0 0 8px;text-align:right;">Amount</th>
    </tr>`;

  const rows = items
    .map(
      (item) => `
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #d9d3c6;">
          ${escapeHtml(item.product_name)}
          <span style="color:#6b6453;font-family:monospace;"> x${item.quantity}</span>
        </td>
        ${
          showUnitPrice
            ? `<td style="padding:8px 0;border-bottom:1px solid #d9d3c6;text-align:right;font-family:monospace;color:#6b6453;">${formatMoney(item.unit_price)}</td>`
            : ""
        }
        <td style="padding:8px 0;border-bottom:1px solid #d9d3c6;text-align:right;font-family:monospace;">${formatMoney(item.line_total)}</td>
      </tr>`
    )
    .join("");

  const span = showUnitPrice ? 2 : 1;

  return `
    <table style="width:100%;border-collapse:collapse;font-size:14px;margin-top:8px;">
      ${head}
      ${rows}
      <tr>
        <td style="padding:12px 0 0;font-weight:700;">Total</td>
        <td colspan="${span}" style="padding:12px 0 0;text-align:right;font-weight:700;font-family:monospace;">${formatMoney(total)}</td>
      </tr>
    </table>`;
}

function addressBlock(order: Order): string {
  return `
    <div style="font-size:14px;line-height:1.6;">
      ${escapeHtml(order.customer_name)}<br />
      ${escapeHtml(order.address)}<br />
      ${escapeHtml(order.city)} ${escapeHtml(order.postal_code)}
    </div>`;
}

function orderNumberBadge(order: Order): string {
  return `
    <p style="font-family:monospace;font-size:15px;background:${PAPER};border:1px solid #d9d3c6;border-radius:8px;padding:10px 14px;display:inline-block;margin:4px 0 12px;">
      Order ${escapeHtml(order.order_number)}
    </p>`;
}

function sectionLabel(text: string): string {
  return `<div style="margin-top:20px;font-size:12px;color:#6b6453;text-transform:uppercase;letter-spacing:0.08em;">${text}</div>`;
}

// --- Public helpers ---------------------------------------------------------
// Sends the customer their order confirmation. Throws on transport failure so
// the caller can log it; it never affects the saved order.
export async function sendCustomerOrderConfirmation(
  data: OrderEmailData
): Promise<void> {
  const transporter = getTransporter();
  if (!transporter) return;

  const { order, items } = data;

  const body = `
    <p style="font-size:14px;line-height:1.6;">
      Thank you, ${escapeHtml(order.customer_name)}. We have received your order
      and it is now <strong>${ORDER_STATUS_LABELS[order.status].toLowerCase()}</strong>.
    </p>
    ${orderNumberBadge(order)}
    ${sectionLabel("Your order")}
    ${lineItemsTable(items, order.total, false)}
    ${sectionLabel("Shipping to")}
    ${addressBlock(order)}
    <p style="font-size:13px;color:#6b6453;margin-top:20px;line-height:1.6;">
      We verify every bank transfer by hand. Once yours is confirmed we begin
      packing, usually within one to two business days, and email you again when
      your order ships. If anything looks wrong, just reply to this message.
    </p>`;

  await transporter.sendMail({
    from: fromAddress(),
    to: order.email,
    subject: `Your ${BRAND.name} order ${order.order_number}`,
    html: shell("Order received", body),
  });
}

// Sends the business owner the new-order notification, including a signed link
// to the payment screenshot so they can verify the transfer.
export async function sendOwnerOrderNotification(
  data: OrderEmailData
): Promise<void> {
  const transporter = getTransporter();
  if (!transporter) return;

  const owner = process.env.COMPANY_NOTIFICATION_EMAIL || process.env.EMAIL_USER;
  if (!owner) {
    console.warn(
      "COMPANY_NOTIFICATION_EMAIL and EMAIL_USER are unset; skipping the owner notification."
    );
    return;
  }

  const { order, items, screenshotSignedUrl } = data;

  const body = `
    <p style="font-size:14px;line-height:1.6;">
      New order <strong>${escapeHtml(order.order_number)}</strong> is awaiting
      payment verification.
    </p>
    <table style="width:100%;font-size:13px;line-height:1.7;margin-bottom:4px;">
      <tr><td style="color:#6b6453;width:120px;">Customer</td><td>${escapeHtml(order.customer_name)}</td></tr>
      <tr><td style="color:#6b6453;">Email</td><td>${escapeHtml(order.email)}</td></tr>
      <tr><td style="color:#6b6453;">Phone</td><td>${escapeHtml(order.phone)}</td></tr>
      <tr><td style="color:#6b6453;">Order ID</td><td style="font-family:monospace;">${escapeHtml(order.order_number)}</td></tr>
      <tr><td style="color:#6b6453;">Placed</td><td>${escapeHtml(new Date(order.created_at).toLocaleString())}</td></tr>
    </table>
    ${sectionLabel("Shipping to")}
    ${addressBlock(order)}
    ${sectionLabel("Items")}
    ${lineItemsTable(items, order.total, true)}
    <p style="margin-top:20px;">
      ${
        screenshotSignedUrl
          ? `<a href="${screenshotSignedUrl}" style="display:inline-block;background:${OCHRE};color:${INK};text-decoration:none;font-weight:700;padding:10px 18px;border-radius:8px;">View payment screenshot</a>
             <br /><span style="font-size:12px;color:#6b6453;">This link is signed and expires.</span>`
          : `<span style="font-size:13px;color:#6b6453;">No payment screenshot was attached.</span>`
      }
    </p>
    <p style="font-size:13px;color:#6b6453;margin-top:16px;">
      <a href="${SITE_URL}/admin" style="color:${INK};">Open the admin dashboard</a>
    </p>`;

  await transporter.sendMail({
    from: fromAddress(),
    to: owner,
    subject: `New order ${order.order_number} to verify`,
    html: shell("New order to verify", body),
  });
}

// Orchestrates both order emails. Failures are logged but never thrown: a saved
// order must not be lost or rolled back because an email bounced.
export async function sendOrderEmails(data: OrderEmailData): Promise<void> {
  const results = await Promise.allSettled([
    sendCustomerOrderConfirmation(data),
    sendOwnerOrderNotification(data),
  ]);

  for (const result of results) {
    if (result.status === "rejected") {
      console.error("Order email failed to send:", result.reason);
    }
  }
}
