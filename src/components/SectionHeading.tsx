export function SectionHeading({
  eyebrow,
  title,
  description,
  centered = false,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  centered?: boolean;
}) {
  return (
    <div className={centered ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className="label text-ochre-deep">{eyebrow}</p>
      <h2 className="mt-3 font-display text-4xl font-semibold leading-tight sm:text-[2.6rem]">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-lg leading-relaxed text-ink/60">{description}</p>
      ) : null}
    </div>
  );
}
