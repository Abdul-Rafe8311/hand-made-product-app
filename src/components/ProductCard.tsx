import Link from "next/link";
import { ProductArt, resolveKind } from "@/components/ProductArt";
import { WishlistButton } from "@/components/WishlistButton";
import { QuickAddButton } from "@/components/QuickAddButton";
import { formatPriceLabel } from "@/lib/money";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  const description = product.tagline ?? product.description;

  return (
    <div className="group card flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_55px_-30px_rgba(30,42,68,0.5)]">
      <div className="relative">
        <Link
          href={`/product/${product.slug}`}
          className="block aspect-square overflow-hidden"
          aria-label={product.name}
        >
          <div className="h-full w-full transition-transform duration-500 ease-out group-hover:scale-105">
            <ProductArt
              kind={resolveKind(product)}
              imageUrl={product.image_url}
              alt={product.name}
            />
          </div>
        </Link>
        <WishlistButton productId={product.id} name={product.name} />
        <span className="label absolute left-3 top-3 rounded-full bg-paper/85 px-2.5 py-1 text-ink/55 backdrop-blur">
          Lot {product.lot}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="label text-ink/40">{product.sku}</div>
        <h3 className="mt-1.5 font-display text-xl leading-snug">
          <Link
            href={`/product/${product.slug}`}
            className="transition-colors hover:text-ochre-deep"
          >
            {product.name}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink/60">
          {description}
        </p>

        <div className="mt-auto pt-5">
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-lg text-ink">
              {formatPriceLabel(product.price)}
            </span>
            <Link
              href={`/product/${product.slug}`}
              className="label text-ochre-deep transition hover:translate-x-0.5"
            >
              Details
            </Link>
          </div>
          <QuickAddButton
            className="mt-3 w-full"
            productId={product.id}
            slug={product.slug}
            name={product.name}
            price={product.price}
            lot={product.lot}
            sku={product.sku}
            imageUrl={product.image_url}
          />
        </div>
      </div>
    </div>
  );
}
