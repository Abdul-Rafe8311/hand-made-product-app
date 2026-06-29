import Image from "next/image";
import { SectionHeading } from "@/components/SectionHeading";
import { StarIcon } from "@/components/icons";

const TESTIMONIALS = [
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

        <div className="mt-14 grid grid-cols-1 gap-7 md:grid-cols-3">
          {TESTIMONIALS.map((item) => (
            <figure
              key={item.name}
              className="card flex flex-col p-7 transition-shadow duration-300 hover:shadow-[0_24px_50px_-32px_rgba(30,42,68,0.5)]"
            >
              <div className="flex text-ochre" aria-label="Rated five out of five">
                {Array.from({ length: 5 }).map((_, index) => (
                  <StarIcon key={index} className="h-4 w-4" />
                ))}
              </div>
              <blockquote className="mt-5 flex-1 text-ink/75">
                <p className="leading-relaxed">{item.quote}</p>
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-5">
                <Image
                  src={item.photo}
                  alt={item.name}
                  width={44}
                  height={44}
                  loading="lazy"
                  className="h-11 w-11 rounded-full object-cover"
                />
                <span>
                  <span className="block font-display text-base">{item.name}</span>
                  <span className="label text-ink/45">{item.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
