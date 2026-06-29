export type Product = {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  description: string;
  price: number; // smallest currency unit
  lot: string;
  sku: string;
  materials: string[];
  dimensions: string | null;
  image_url: string | null;
  active: boolean;
  created_at: string;
};

export type OrderStatus = "pending_payment" | "paid" | "shipped" | "cancelled";

export const ORDER_STATUSES: OrderStatus[] = [
  "pending_payment",
  "paid",
  "shipped",
  "cancelled",
];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending_payment: "Payment pending",
  paid: "Paid",
  shipped: "Shipped",
  cancelled: "Cancelled",
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  unit_price: number;
  quantity: number;
  line_total: number;
};

export type Order = {
  id: string;
  order_number: string;
  customer_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postal_code: string;
  subtotal: number;
  total: number;
  status: OrderStatus;
  payment_screenshot_url: string | null;
  created_at: string;
};

export type OrderWithItems = Order & { order_items: OrderItem[] };

// What the cart stores client side. Prices are kept only for display; the
// server re-fetches the real price before charging.
export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  lot: string;
  sku: string;
  imageUrl: string | null;
  quantity: number;
};

export type PaymentField = { label: string; value: string };

export type PaymentMethod = {
  kind: "bank" | "easypaisa" | "jazzcash";
  label: string;
  accountName: string;
  fields: PaymentField[];
};

// Drives the inline line-art used when a product has no real photo yet.
export type ProductKind =
  | "candle"
  | "mug"
  | "bowl"
  | "planter"
  | "scarf"
  | "tote";
