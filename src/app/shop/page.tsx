import type { Metadata } from "next";
import { getActiveProducts } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop",
  description: "The full catalogue of handmade goods, made in small numbered lots.",
};

export default async function ShopPage() {
  const products = await getActiveProducts();

  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <header className="max-w-2xl">
        <p className="label text-ochre-deep">The catalogue</p>
        <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">
          Everything we make
        </h1>
        <p className="mt-4 text-ink/70">
          Each piece is made by hand in a small lot, so quantities are limited and
          every one is a little different.
        </p>
      </header>

      {products.length > 0 ? (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="mt-10 text-ink/60">
          Nothing is in stock right now. Please check back soon.
        </p>
      )}
    </div>
  );
}
