import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";
import { categoryAnchor } from "@/lib/categories";
import {
  FlowerIcon,
  YarnIcon,
  CandleIcon,
  WoodworkIcon,
  GiftIcon,
} from "@/components/icons";

const CATEGORIES = [
  { name: "Crochet Bouquets", Icon: FlowerIcon },
  { name: "Crochet", Icon: YarnIcon },
  { name: "Candles", Icon: CandleIcon },
  { name: "Wooden Decor", Icon: WoodworkIcon },
  { name: "Gift Baskets", Icon: GiftIcon },
];

export function Categories() {
  return (
    <section id="categories" className="border-y border-line bg-paper-deep/40">
      <div className="mx-auto max-w-7xl px-6 py-20 sm:py-24">
        <SectionHeading
          eyebrow="Browse by craft"
          title="Shop our categories"
          description="Five hands-on disciplines, each made in small numbered runs."
          centered
        />

        <div className="mt-12 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
          {CATEGORIES.map(({ name, Icon }) => (
            <Link
              key={name}
              href={`/shop#${categoryAnchor(name)}`}
              className="group flex flex-col items-center rounded-2xl border border-line bg-card px-5 py-8 text-center transition-all duration-300 hover:-translate-y-1 hover:border-ochre/60 hover:bg-paper-deep/40 hover:shadow-[0_22px_45px_-30px_rgba(30,42,68,0.5)]"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full border border-line bg-paper text-ink/80 transition-colors duration-300 group-hover:border-ochre/60 group-hover:text-ochre-deep">
                <Icon className="h-7 w-7" />
              </span>
              <span className="mt-4 font-display text-lg">{name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
