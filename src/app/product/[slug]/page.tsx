import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/products";
import { ProductArt, resolveKind } from "@/components/ProductArt";
import { AddToCart } from "@/components/AddToCart";
import { formatPriceLabel } from "@/lib/money";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Not found" };
  return {
    title: product.name,
    description: product.tagline ?? product.description,
  };
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <Link href="/shop" className="label text-ink/50 transition hover:text-ochre-deep">
        &larr; Back to the catalogue
      </Link>

      <div className="mt-6 grid gap-10 md:grid-cols-2">
        {/* Image */}
        <div className="card overflow-hidden">
          <div className="relative aspect-square">
            <ProductArt
              kind={resolveKind(product)}
              imageUrl={product.image_url}
              alt={product.name}
            />
            <span className="label absolute left-4 top-4 rounded-full bg-paper/85 px-2.5 py-1 text-ink/70 backdrop-blur">
              Lot {product.lot}
            </span>
          </div>
        </div>

        {/* Details */}
        <div>
          <div className="label text-ink/45">{product.sku}</div>
          <h1 className="mt-2 font-display text-4xl font-bold leading-tight">
            {product.name}
          </h1>
          {product.tagline ? (
            <p className="mt-2 text-lg text-olive">{product.tagline}</p>
          ) : null}

          <div className="mt-5 font-mono text-2xl">
            {formatPriceLabel(product.price)}
          </div>

          <p className="mt-6 text-ink/75">{product.description}</p>

          <dl className="mt-8 grid grid-cols-1 gap-5 border-t border-line pt-6 sm:grid-cols-2">
            <div>
              <dt className="label text-ink/45">Materials</dt>
              <dd className="mt-2">
                <ul className="space-y-1 text-sm text-ink/80">
                  {product.materials.map((material) => (
                    <li key={material}>{material}</li>
                  ))}
                </ul>
              </dd>
            </div>
            <div>
              <dt className="label text-ink/45">Dimensions</dt>
              <dd className="mt-2 text-sm text-ink/80">
                {product.dimensions ?? "Varies by piece"}
              </dd>
            </div>
          </dl>

          <div className="mt-8 border-t border-line pt-6">
            <AddToCart
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
    </div>
  );
}
