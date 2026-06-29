"use client";

import { useEffect, useState } from "react";

const KEY = "maati-wishlist-v1";

function read(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = JSON.parse(window.localStorage.getItem(KEY) || "[]");
    return Array.isArray(raw) ? raw.map(String) : [];
  } catch {
    return [];
  }
}

export function WishlistButton({
  productId,
  name,
}: {
  productId: string;
  name: string;
}) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(read().includes(productId));
  }, [productId]);

  function toggle() {
    const current = read();
    const next = current.includes(productId)
      ? current.filter((id) => id !== productId)
      : [...current, productId];
    try {
      window.localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      // storage unavailable; keep the in-session toggle working anyway.
    }
    setActive(next.includes(productId));
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={active}
      aria-label={active ? `Remove ${name} from wishlist` : `Add ${name} to wishlist`}
      className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-line bg-paper/85 text-ink/70 backdrop-blur transition hover:border-ochre hover:text-ochre-deep"
    >
      <svg
        viewBox="0 0 24 24"
        className="h-[18px] w-[18px] transition-transform duration-200"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ color: active ? "var(--color-ochre)" : undefined }}
      >
        <path d="M12 20s-6-3.7-6-8.3A3.2 3.2 0 0 1 12 9a3.2 3.2 0 0 1 6 2.7C18 16.3 12 20 12 20Z" />
      </svg>
    </button>
  );
}
