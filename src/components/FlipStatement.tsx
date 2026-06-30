import { FlipBoard } from "@/components/FlipBoard";

const PHRASES = ["MADE BY HAND", "SMALL BATCHES", "NUMBERED LOTS", "MAATI AND CO"];

export function FlipStatement() {
  return (
    <section className="bg-ink-deep">
      <div className="mx-auto max-w-7xl px-6 py-20 text-center sm:py-24">
        <p className="label text-ochre">Now showing</p>
        <div className="mt-8 flex justify-center">
          <FlipBoard phrases={PHRASES} />
        </div>
        <p className="mx-auto mt-8 max-w-md text-sm leading-relaxed text-paper/55">
          A small studio making a few things at a time, then sending them out
          into the world.
        </p>
      </div>
    </section>
  );
}
