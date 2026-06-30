"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { StarIcon } from "@/components/icons";

export type Testimonial = {
  name: string;
  role: string;
  photo: string;
  quote: string;
};

// Cards stacked on top of each other that cycle on an interval. The movement is
// pure CSS transition of transform and opacity; the only JS is the timer that
// promotes the next card. Auto-cycling pauses under reduced motion.
export function CardStack({
  items,
  interval = 5000,
}: {
  items: Testimonial[];
  interval?: number;
}) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(
      () => setActive((value) => (value + 1) % items.length),
      interval
    );
    return () => clearInterval(id);
  }, [items.length, interval]);

  return (
    <div className="relative mx-auto h-[19rem] w-full max-w-md">
      {items.map((item, index) => {
        const pos = (index - active + items.length) % items.length; // 0 = front
        const hidden = pos > 2;
        return (
          <article
            key={item.name}
            className="card absolute inset-0 flex flex-col p-7 shadow-[0_24px_50px_-34px_rgba(30,42,68,0.5)] transition-all duration-500 ease-out"
            style={{
              transform: `translateY(${pos * 16}px) scale(${1 - pos * 0.04})`,
              zIndex: items.length - pos,
              opacity: hidden ? 0 : 1,
              pointerEvents: pos === 0 ? "auto" : "none",
            }}
            aria-hidden={pos !== 0}
          >
            <div className="flex text-ochre" aria-label="Rated five out of five">
              {Array.from({ length: 5 }).map((_, star) => (
                <StarIcon key={star} className="h-4 w-4" />
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
          </article>
        );
      })}
    </div>
  );
}
