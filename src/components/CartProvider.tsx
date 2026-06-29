"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { CartItem } from "@/lib/types";

const STORAGE_KEY = "maati-cart-v1";
const MAX_QTY = 99;

type AddInput = Omit<CartItem, "quantity">;

type CartContextValue = {
  items: CartItem[];
  hydrated: boolean;
  count: number;
  subtotal: number;
  add: (item: AddInput, quantity?: number) => void;
  setQuantity: (productId: string, quantity: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function clampQty(value: number): number {
  if (!Number.isFinite(value)) return 1;
  return Math.min(MAX_QTY, Math.max(1, Math.floor(value)));
}

function readStorage(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((entry) => entry && typeof entry.productId === "string")
      .map((entry) => ({
        productId: String(entry.productId),
        slug: String(entry.slug ?? ""),
        name: String(entry.name ?? ""),
        price: Number(entry.price ?? 0),
        lot: String(entry.lot ?? ""),
        sku: String(entry.sku ?? ""),
        imageUrl: entry.imageUrl ?? null,
        quantity: clampQty(Number(entry.quantity ?? 1)),
      }));
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Load once on mount so server and first client render agree (both empty).
  useEffect(() => {
    setItems(readStorage());
    setHydrated(true);
  }, []);

  // Persist after hydration, and keep other tabs in sync.
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // storage unavailable (private mode); cart still works for this session.
    }
  }, [items, hydrated]);

  useEffect(() => {
    function onStorage(event: StorageEvent) {
      if (event.key === STORAGE_KEY) setItems(readStorage());
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const add = useCallback((item: AddInput, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((entry) => entry.productId === item.productId);
      if (existing) {
        return prev.map((entry) =>
          entry.productId === item.productId
            ? { ...entry, quantity: clampQty(entry.quantity + quantity) }
            : entry
        );
      }
      return [...prev, { ...item, quantity: clampQty(quantity) }];
    });
  }, []);

  const setQuantity = useCallback((productId: string, quantity: number) => {
    setItems((prev) =>
      prev.map((entry) =>
        entry.productId === productId
          ? { ...entry, quantity: clampQty(quantity) }
          : entry
      )
    );
  }, []);

  const remove = useCallback((productId: string) => {
    setItems((prev) => prev.filter((entry) => entry.productId !== productId));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((sum, entry) => sum + entry.quantity, 0);
    const subtotal = items.reduce(
      (sum, entry) => sum + entry.price * entry.quantity,
      0
    );
    return { items, hydrated, count, subtotal, add, setQuantity, remove, clear };
  }, [items, hydrated, add, setQuantity, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
