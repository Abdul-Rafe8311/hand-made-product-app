import { SectionHeading } from "@/components/SectionHeading";
import {
  HandmadeIcon,
  EcoIcon,
  BatchIcon,
  ShippingIcon,
} from "@/components/icons";

const FEATURES = [
  {
    Icon: HandmadeIcon,
    title: "Handmade with care",
    body: "Every piece is shaped by hand in our studio, never mass produced on a line.",
  },
  {
    Icon: EcoIcon,
    title: "Eco-friendly materials",
    body: "Natural waxes, seasoned wood and responsibly sourced clay and fibre.",
  },
  {
    Icon: BatchIcon,
    title: "Small batch production",
    body: "We make in short, numbered lots, so quantities stay limited and considered.",
  },
  {
    Icon: ShippingIcon,
    title: "Fast and secure shipping",
    body: "Carefully packed and dispatched quickly once your payment is verified.",
  },
];

export function Features() {
  return (
    <section id="why" className="mx-auto max-w-7xl px-6 py-20 sm:py-24">
      <SectionHeading
        eyebrow="Why choose us"
        title="Made the way it should be"
        description="The small things that add up to a piece worth keeping."
        centered
      />

      <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map(({ Icon, title, body }) => (
          <div key={title} className="text-center sm:text-left">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-ochre/10 text-ochre-deep sm:mx-0">
              <Icon className="h-7 w-7" />
            </span>
            <h3 className="mt-5 font-display text-xl">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink/60">{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
