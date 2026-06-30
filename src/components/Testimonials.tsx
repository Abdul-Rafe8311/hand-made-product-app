import { SectionHeading } from "@/components/SectionHeading";
import { CardStack, type Testimonial } from "@/components/CardStack";

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Amara Okafor",
    role: "Verified buyer",
    photo: "https://randomuser.me/api/portraits/women/68.jpg",
    quote:
      "The mug feels like it was made for my hand. You can tell a person shaped it, not a machine.",
  },
  {
    name: "Daniel Brooks",
    role: "Verified buyer",
    photo: "https://randomuser.me/api/portraits/men/32.jpg",
    quote:
      "Beautiful work and beautifully packed. The candle scent is subtle and the burn is clean.",
  },
  {
    name: "Sofia Marsh",
    role: "Verified buyer",
    photo: "https://randomuser.me/api/portraits/women/44.jpg",
    quote:
      "I have bought three pieces now. Each one is a little different, and that is exactly why I love them.",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="border-y border-line bg-paper-deep/40">
      <div className="mx-auto max-w-7xl px-6 py-20 sm:py-24">
        <SectionHeading
          eyebrow="Kind words"
          title="Loved by our customers"
          description="A few notes from people who keep our pieces on their shelves and tables."
          centered
        />
        <div className="mt-16">
          <CardStack items={TESTIMONIALS} />
        </div>
      </div>
    </section>
  );
}
