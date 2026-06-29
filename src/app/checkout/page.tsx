import type { Metadata } from "next";
import { getPaymentMethods } from "@/lib/payment";
import { CheckoutForm } from "./CheckoutForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Enter your delivery details and pay by transfer.",
};

export default function CheckoutPage() {
  // Bank / Easypaisa / JazzCash details come from server-only env and are
  // passed down to the form so secrets stay on the server.
  const paymentMethods = getPaymentMethods();
  return <CheckoutForm paymentMethods={paymentMethods} />;
}
