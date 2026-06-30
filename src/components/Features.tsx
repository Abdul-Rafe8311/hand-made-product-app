import { SectionHeading } from "@/components/SectionHeading";
import {
  HandmadeIcon,
  EcoIcon,
  BatchIcon,
  ShippingIcon,
} from "@/components/icons";

function IconChip({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ochre/10 text-ochre-deep">
      {children}
    </span>
  );
}

// A small mock "lot card", echoing the catalogue language.
function LotCardMock() {
  return (
    <div className="w-full max-w-[210px] rounded-2xl border border-line bg-paper-deep/50 p-4">
      <div className="flex items-center justify-between">
        <span className="label text-ink/45">Lot 03</span>
        <span className="label text-ochre-deep">MTC-033</span>
      </div>
      <div className="mt-3 flex h-24 items-center justify-center rounded-xl border border-line bg-card">
        <svg
          viewBox="0 0 64 64"
          className="h-14 w-14"
          fill="none"
          stroke="#1e2a44"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <ellipse cx="32" cy="30" rx="16" ry="4.5" />
          <path d="M16 30a16 13 0 0 0 32 0" />
          <path d="M23 30a9 5 0 0 0 18 0" stroke="#c89b5c" />
        </svg>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-line">
        <div className="h-full w-3/4 rounded-full bg-ochre" />
      </div>
      <div className="label mt-2 text-ink/40">Hand finished</div>
    </div>
  );
}

// A small three step delivery tracker.
function DeliveryTrack() {
  const steps = ["Packed", "Shipped", "Arrives"];
  return (
    <div className="w-full max-w-[260px]">
      <div className="flex items-center">
        {steps.map((step, index) => (
          <div key={step} className="flex flex-1 items-center last:flex-none">
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-full border text-[11px] ${
                index < 2
                  ? "border-ochre bg-ochre text-white"
                  : "border-line bg-card text-ink/40"
              }`}
            >
              {index + 1}
            </span>
            {index < steps.length - 1 ? (
              <span
                className={`mx-1 h-0.5 flex-1 rounded-full ${
                  index < 1 ? "bg-ochre" : "bg-line"
                }`}
              />
            ) : null}
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-between">
        {steps.map((step) => (
          <span key={step} className="label text-ink/45">
            {step}
          </span>
        ))}
      </div>
      <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-line bg-card px-3 py-1.5">
        <span className="h-2 w-2 rounded-full bg-olive" />
        <span className="label text-ink/55">Dispatched in 1 to 2 days</span>
      </div>
    </div>
  );
}

export function Features() {
  return (
    <section id="why" className="mx-auto max-w-7xl px-6 py-20 sm:py-24">
      <SectionHeading
        eyebrow="Why choose us"
        title="Made the way it should be"
        description="The small things that add up to a piece worth keeping."
        centered
      />

      <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* Handmade (wide) */}
        <article className="card flex flex-col justify-between gap-6 p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-32px_rgba(30,42,68,0.5)] sm:col-span-2 sm:flex-row sm:items-center">
          <div className="max-w-xs">
            <IconChip>
              <HandmadeIcon className="h-6 w-6" />
            </IconChip>
            <h3 className="mt-5 font-display text-2xl">Handmade with care</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink/60">
              Every piece is shaped by hand in our studio, numbered by lot, and
              checked before it ever leaves the bench.
            </p>
          </div>
          <LotCardMock />
        </article>

        {/* Eco (narrow) */}
        <article className="card relative overflow-hidden p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-32px_rgba(30,42,68,0.5)]">
          <IconChip>
            <EcoIcon className="h-6 w-6" />
          </IconChip>
          <h3 className="mt-5 font-display text-xl">Eco-friendly materials</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink/60">
            Natural waxes, seasoned wood, and responsibly sourced clay and fibre.
          </p>
          <EcoIcon className="pointer-events-none absolute -bottom-6 -right-4 h-28 w-28 text-olive/10" />
        </article>

        {/* Small batch (narrow) */}
        <article className="card p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-32px_rgba(30,42,68,0.5)]">
          <IconChip>
            <BatchIcon className="h-6 w-6" />
          </IconChip>
          <h3 className="mt-5 font-display text-xl">Small batch production</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink/60">
            Short, numbered runs, so quantities stay limited and considered.
          </p>
          <div className="mt-4 flex gap-2">
            {["01", "02", "03", "04"].map((n) => (
              <span
                key={n}
                className="label rounded-md border border-line bg-paper-deep/50 px-2 py-1 text-ink/55"
              >
                {n}
              </span>
            ))}
          </div>
        </article>

        {/* Shipping (wide) */}
        <article className="card flex flex-col justify-between gap-6 p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-32px_rgba(30,42,68,0.5)] sm:col-span-2 sm:flex-row sm:items-center">
          <div className="max-w-xs">
            <IconChip>
              <ShippingIcon className="h-6 w-6" />
            </IconChip>
            <h3 className="mt-5 font-display text-2xl">Fast and secure shipping</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink/60">
              Carefully packed and dispatched quickly once your payment is
              verified, with tracking from bench to door.
            </p>
          </div>
          <DeliveryTrack />
        </article>
      </div>
    </section>
  );
}
