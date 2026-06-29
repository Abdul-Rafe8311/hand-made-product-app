import Link from "next/link";
import { getActiveProducts } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { BRAND } from "@/lib/config";

export const dynamic = "force-dynamic";

const STEPS = [
  {
    n: "01",
    title: "Pick from the lot",
    body: "Browse the catalogue. Everything is made in small numbered batches, so stock is limited and a little different each time.",
  },
  {
    n: "02",
    title: "Add to your cart",
    body: "Choose quantities and review your cart. Nothing is charged here; the cart just holds what you want.",
  },
  {
    n: "03",
    title: "Pay by transfer",
    body: "At checkout you send a bank transfer and attach a screenshot of it, along with your delivery details.",
  },
  {
    n: "04",
    title: "We verify and ship",
    body: "We check the transfer against your screenshot, email you a confirmation, and pack your order by hand.",
  },
];

export default async function HomePage() {
  const products = await getActiveProducts();
  const featured = products.slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
          <p className="label rise text-ochre-deep">{BRAND.tagline}</p>
          <h1 className="rise mt-5 max-w-4xl font-display text-5xl font-bold leading-[1.05] sm:text-7xl">
            Objects made <span className="swipe">by hand</span>, a few at a time.
          </h1>
          <p className="rise mt-6 max-w-xl text-lg text-ink/70">
            {BRAND.name} is a small studio. We pour, throw, turn, weave and print
            in short runs, then number each batch and send it out into the world.
          </p>
          <div className="rise mt-9 flex flex-wrap gap-3">
            <Link href="/shop" className="btn btn-ink">
              Shop the catalogue
            </Link>
            <Link href="/#how" className="btn btn-outline">
              How ordering works
            </Link>
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="label text-ink/45">From the latest lots</p>
            <h2 className="mt-1 font-display text-3xl font-bold">Featured pieces</h2>
          </div>
          <Link
            href="/shop"
            className="label hidden text-ochre-deep transition hover:translate-x-0.5 sm:inline"
          >
            See all &rarr;
          </Link>
        </div>

        {featured.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="mt-8 text-ink/60">
            The catalogue is being restocked. Please check back shortly.
          </p>
        )}
      </section>

      {/* Our story */}
      <section id="story" className="border-y border-line bg-paper-deep/40">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-[1fr_1.2fr]">
          <div>
            <p className="label text-ochre-deep">Our story</p>
            <h2 className="mt-2 font-display text-3xl font-bold">
              A studio, not a factory.
            </h2>
          </div>
          <div className="space-y-4 text-ink/75">
            <p>
              {BRAND.name} began at a single workbench, making a handful of pieces
              for friends. We never set out to scale up. Working in small lots lets
              us keep our hands on every step, from the first cut to the last wipe
              of oil.
            </p>
            <p>
              Because each batch is made by hand, no two pieces are identical. A
              glaze breaks a little differently, a grain runs its own way, a weave
              sits slightly looser. We think that is the point.
            </p>
          </div>
        </div>
      </section>

      {/* How ordering works */}
      <section id="how" className="mx-auto max-w-6xl px-5 py-16">
        <p className="label text-ink/45">Step by step</p>
        <h2 className="mt-1 font-display text-3xl font-bold">How ordering works</h2>
        <ol className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step) => (
            <li key={step.n} className="card p-6">
              <div className="font-mono text-2xl text-ochre">{step.n}</div>
              <h3 className="mt-3 font-display text-lg font-semibold">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-ink/70">{step.body}</p>
            </li>
          ))}
        </ol>
        <div className="mt-10">
          <Link href="/shop" className="btn btn-ochre">
            Start your order
          </Link>
        </div>
      </section>
    </div>
  );
}
