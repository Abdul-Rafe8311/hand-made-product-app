"use client";

type Props = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label?: string;
  size?: "sm" | "md";
};

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  label = "Quantity",
  size = "md",
}: Props) {
  const clamp = (next: number) => Math.min(max, Math.max(min, next));
  const dim = size === "sm" ? "h-8 w-8 text-base" : "h-10 w-10 text-lg";

  return (
    <div
      className="inline-flex items-center rounded-full border border-ink/20 bg-card"
      role="group"
      aria-label={label}
    >
      <button
        type="button"
        className={`${dim} flex items-center justify-center rounded-full text-ink transition hover:bg-ink/5 disabled:opacity-40`}
        onClick={() => onChange(clamp(value - 1))}
        disabled={value <= min}
        aria-label="Decrease quantity"
      >
        &minus;
      </button>
      <input
        type="number"
        className="w-10 bg-transparent text-center font-mono text-sm [appearance:textfield] focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        value={value}
        min={min}
        max={max}
        aria-label={label}
        onChange={(event) => {
          const parsed = parseInt(event.target.value, 10);
          onChange(Number.isNaN(parsed) ? min : clamp(parsed));
        }}
      />
      <button
        type="button"
        className={`${dim} flex items-center justify-center rounded-full text-ink transition hover:bg-ink/5 disabled:opacity-40`}
        onClick={() => onChange(clamp(value + 1))}
        disabled={value >= max}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}
