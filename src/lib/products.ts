import { createClient } from "./supabase/server";
import type { Product } from "./types";

// Public product reads. The anon RLS policy only exposes active products, so
// these run safely with the request-scoped server client.

export async function getActiveProducts(): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("active", true)
    .order("lot", { ascending: true });

  if (error) throw new Error(`Failed to load products: ${error.message}`);
  return (data ?? []) as Product[];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("active", true)
    .maybeSingle();

  if (error) throw new Error(`Failed to load product: ${error.message}`);
  return (data as Product) ?? null;
}
