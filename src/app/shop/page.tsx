import type { Metadata } from "next";
import { getActiveProducts } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { groupByCategory, categoryAnchor } from "@/lib/categories";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop",
  description: "The full catalogue of handmade goods, made in small numbered lots.",
};

export default async function ShopPage() {
  const products = await getActiveProducts();
  const groups = groupByCategory(products);

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

      {groups.length > 0 ? (
        <>
          {/* Jump links to each category */}
          <nav className="mt-8 flex flex-wrap gap-2" aria-label="Categories">
            {groups.map(({ category }) => (
              <a
                key={category}
                href={`#${categoryAnchor(category)}`}
                className="label rounded-full border border-line bg-card px-3.5 py-1.5 text-ink/60 transition hover:border-ochre/60 hover:text-ochre-deep"
              >
                {category}
              </a>
            ))}
          </nav>

          <div className="mt-12 space-y-16">
            {groups.map(({ category, products: items }) => (
              <section
                key={category}
                id={categoryAnchor(category)}
                aria-labelledby={`${categoryAnchor(category)}-heading`}
                className="scroll-mt-24"
              >
                <div className="flex items-end justify-between gap-4 border-b border-line pb-3">
                  <h2
                    id={`${categoryAnchor(category)}-heading`}
                    className="font-display text-2xl font-bold sm:text-3xl"
                  >
                    {category}
                  </h2>
                  <span className="label whitespace-nowrap text-ink/45">
                    {items.length} {items.length === 1 ? "piece" : "pieces"}
                  </span>
                </div>

                <div className="mt-7 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </>
      ) : (
        <p className="mt-10 text-ink/60">
          Nothing is in stock right now. Please check back soon.
        </p>
      )}
    </div>
  );
}
