import Link from "next/link";
import { ProductArt, resolveKind } from "@/components/ProductArt";
import { formatMoney } from "@/lib/money";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/product/${product.slug}`}
      className="group card flex flex-col overflow-hidden transition hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-18px_rgba(30,44,71,0.5)]"
    >
      <div className="relative aspect-square overflow-hidden border-b border-line">
        <ProductArt
          kind={resolveKind(product.slug)}
          imageUrl={product.image_url}
          alt={product.name}
        />
        <span className="label absolute left-3 top-3 rounded-full bg-paper/85 px-2 py-1 text-ink/70 backdrop-blur">
          Lot {product.lot}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-1 p-5">
        <div className="label text-ink/45">{product.sku}</div>
        <h3 className="font-display text-lg leading-snug">{product.name}</h3>
        {product.tagline ? (
          <p className="text-sm text-ink/65">{product.tagline}</p>
        ) : null}
        <div className="mt-3 flex items-center justify-between">
          <span className="font-mono text-base">{formatMoney(product.price)}</span>
          <span className="label text-ochre-deep transition group-hover:translate-x-0.5">
            View &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
}
