"use client";

import { useEffect, useRef, useState } from "react";
import { useCart } from "@/components/CartProvider";
import { QuantityStepper } from "@/components/QuantityStepper";
import type { CartItem } from "@/lib/types";

type Props = Omit<CartItem, "quantity">;

export function AddToCart(product: Props) {
  const { add } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  function handleAdd() {
    add(product, quantity);
    setAdded(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(false), 2200);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-4">
        <QuantityStepper value={quantity} onChange={setQuantity} />
        <button type="button" className="btn btn-ink" onClick={handleAdd}>
          Add to cart
        </button>
      </div>
      <p
        className="label h-4 text-olive transition-opacity"
        aria-live="polite"
        style={{ opacity: added ? 1 : 0 }}
      >
        {added ? "Added to your cart" : " "}
      </p>
    </div>
  );
}
