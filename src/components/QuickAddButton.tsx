"use client";

import { useEffect, useRef, useState } from "react";
import { useCart } from "@/components/CartProvider";
import type { CartItem } from "@/lib/types";

type Props = Omit<CartItem, "quantity"> & { className?: string };

export function QuickAddButton({ className = "", ...product }: Props) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  function onClick() {
    add(product, 1);
    setAdded(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(false), 1800);
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`btn ${added ? "btn-ochre" : "btn-ink"} !py-2.5 text-sm ${className}`}
      aria-live="polite"
    >
      {added ? "Added to cart" : "Add to cart"}
    </button>
  );
}
