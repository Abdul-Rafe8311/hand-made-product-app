import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { SectionHeading } from "@/components/SectionHeading";
import type { Product } from "@/lib/types";

export function FeaturedProducts({ products }: { products: Product[] }) {
  return (
    <section id="featured" className="mx-auto max-w-7xl px-6 py-20 sm:py-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          eyebrow="From the latest lots"
          title="Featured pieces"
          description="A small selection from the current batches, each made by hand and numbered."
        />
        <Link
          href="/shop"
          className="nav-underline hidden text-sm font-medium text-ochre-deep sm:inline"
        >
          View all products
        </Link>
      </div>

      {products.length > 0 ? (
        <div className="mt-12 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="mt-10 text-ink/60">
          The catalogue is being restocked. Please check back shortly.
        </p>
      )}
    </section>
  );
}
