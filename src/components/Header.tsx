"use client";

import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { BRAND } from "@/lib/config";

export function Header() {
  const { count, hydrated } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/" className="flex flex-col leading-none">
          <span className="font-display text-xl font-bold tracking-tight">
            {BRAND.name}
          </span>
          <span className="label mt-0.5 text-ink/45">Small-lot goods</span>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-5">
          <Link
            href="/shop"
            className="hidden font-display text-sm transition hover:text-ochre-deep sm:inline"
          >
            Shop
          </Link>
          <Link
            href="/#story"
            className="hidden font-display text-sm transition hover:text-ochre-deep sm:inline"
          >
            Our story
          </Link>
          <Link
            href="/cart"
            className="btn btn-outline relative !px-4 !py-2 text-sm"
            aria-label={`Cart, ${hydrated ? count : 0} items`}
          >
            Cart
            <span className="font-mono text-xs">
              ({hydrated ? count : 0})
            </span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
