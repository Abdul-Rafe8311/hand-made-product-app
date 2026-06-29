"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/components/CartProvider";
import { BRAND } from "@/lib/config";

const LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "/#categories", label: "Categories" },
  { href: "/#why", label: "Why us" },
  { href: "/#testimonials", label: "Reviews" },
];

function CartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 4h2l2.4 12.2a1 1 0 0 0 1 .8h8.7a1 1 0 0 0 1-.8L21 8H6" />
      <circle cx="9" cy="20" r="1" />
      <circle cx="18" cy="20" r="1" />
    </svg>
  );
}

export function Navbar() {
  const { count, hydrated } = useCart();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const badge = hydrated ? count : 0;

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/80 backdrop-blur-md">
      <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex flex-col leading-none" onClick={() => setOpen(false)}>
          <span className="font-display text-2xl font-semibold tracking-tight">
            {BRAND.name}
          </span>
          <span className="label mt-1 text-ink/40">Small-lot goods</span>
        </Link>

        {/* Desktop links */}
        <nav className="hidden items-center gap-9 md:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="nav-underline text-sm font-medium text-ink/75 transition-colors hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/cart"
            className="relative inline-flex items-center gap-2 rounded-full border border-line bg-card px-4 py-2 text-sm font-medium text-ink transition hover:border-ochre hover:text-ochre-deep"
            aria-label={`Cart, ${badge} items`}
          >
            <CartIcon />
            <span className="hidden sm:inline">Cart</span>
            {badge > 0 ? (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-ochre px-1 font-mono text-[11px] font-semibold text-white">
                {badge}
              </span>
            ) : null}
          </Link>

          {/* Mobile toggle */}
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink transition hover:border-ochre md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <>
                  <path d="M4 7h16" />
                  <path d="M4 12h16" />
                  <path d="M4 17h16" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open ? (
        <nav className="border-t border-line bg-paper md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col px-6 py-3">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`border-b border-line/70 py-3 text-base transition-colors last:border-b-0 hover:text-ochre-deep ${
                  pathname === link.href ? "text-ochre-deep" : "text-ink/80"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
