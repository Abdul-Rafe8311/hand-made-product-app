import Link from "next/link";
import Image from "next/image";
import { BRAND } from "@/lib/config";
import { StarIcon } from "@/components/icons";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=1100&q=80";

export function Hero() {
  return (
    <section className="border-b border-line">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-20 lg:grid-cols-2 lg:py-28">
        {/* Copy */}
        <div className="rise">
          <p className="label text-ochre-deep">{BRAND.tagline}</p>
          <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.06] sm:text-6xl">
            Objects made <span className="swipe">by hand</span>, a few at a time.
          </h1>
          <p className="mt-7 max-w-lg text-lg leading-relaxed text-ink/65">
            {BRAND.name} is a small studio. We pour, throw, turn, weave and print
            in short runs, then number each batch and send it out into the world.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/shop" className="btn btn-ink">
              Shop the catalogue
            </Link>
            <Link href="/#why" className="btn btn-outline">
              Why people choose us
            </Link>
          </div>

          <div className="mt-12 flex items-center gap-5">
            <div className="flex text-ochre" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, index) => (
                <StarIcon key={index} className="h-4 w-4" />
              ))}
            </div>
            <p className="text-sm text-ink/60">
              Loved by makers and gift-givers in small batches since day one.
            </p>
          </div>
        </div>

        {/* Image */}
        <div className="relative">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[28px] border border-line shadow-[0_40px_80px_-40px_rgba(30,42,68,0.5)] lg:max-w-none">
            <Image
              src={HERO_IMAGE}
              alt="Handmade ceramic cups and a glazed planter on a soft neutral surface"
              fill
              priority
              sizes="(max-width: 1024px) 90vw, 45vw"
              className="object-cover"
            />
          </div>
          {/* Floating accent card */}
          <div className="absolute -bottom-5 left-4 hidden rounded-2xl border border-line bg-card/95 px-5 py-3 shadow-[0_20px_40px_-24px_rgba(30,42,68,0.5)] backdrop-blur sm:block lg:-left-6">
            <div className="label text-ink/45">Small batch</div>
            <div className="mt-0.5 font-display text-lg">Numbered lots</div>
          </div>
        </div>
      </div>
    </section>
  );
}
