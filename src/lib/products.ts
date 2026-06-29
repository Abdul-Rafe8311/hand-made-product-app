import { createClient } from "./supabase/server";
import type { Product } from "./types";

// Public product reads. The anon RLS policy only exposes active products, so
// these run safely with the request-scoped server client.

export async function getActiveProducts(): Promise<Product[]> {
  // Degrade gracefully: if Supabase is unconfigured or unreachable, render an
  // empty catalogue rather than crashing the whole page with a server error.
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("active", true)
      .order("lot", { ascending: true });

    if (error) throw error;
    return (data ?? []) as Product[];
  } catch (err) {
    console.error("getActiveProducts failed; returning empty catalogue:", err);
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .eq("active", true)
      .maybeSingle();

    if (error) throw error;
    return (data as Product) ?? null;
  } catch (err) {
    console.error(`getProductBySlug(${slug}) failed:`, err);
    return null;
  }
}
