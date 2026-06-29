import { NewsletterForm } from "@/components/NewsletterForm";

export function Newsletter() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 sm:py-24">
      <div className="rounded-[28px] border border-line bg-paper-deep/60 px-6 py-16 text-center sm:px-12">
        <p className="label text-ochre-deep">Stay in touch</p>
        <h2 className="mt-3 font-display text-4xl font-semibold leading-tight sm:text-[2.6rem]">
          Join the studio list
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-ink/60">
          Be the first to hear when a new lot is ready, plus the occasional note
          from the bench. No noise, just the good stuff.
        </p>
        <div className="mt-8">
          <NewsletterForm />
        </div>
        <p className="mt-4 text-xs text-ink/45">
          No spam. Unsubscribe at any time.
        </p>
      </div>
    </section>
  );
}
