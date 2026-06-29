// Minimal line icons. Stroke uses currentColor so callers control the colour.

type IconProps = { className?: string };

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function Svg({ className, children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base} aria-hidden="true">
      {children}
    </svg>
  );
}

/* Category icons */
export function CeramicsIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M6 9h12l-1.2 9.2a1 1 0 0 1-1 .8H8.2a1 1 0 0 1-1-.8L6 9Z" />
      <path d="M5 9c0-1.6 3.1-2.5 7-2.5S19 7.4 19 9" />
    </Svg>
  );
}

export function CandleIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="8" y="9" width="8" height="11" rx="1.5" />
      <path d="M12 9V6" />
      <path d="M12 3c1.4 1.4 1.4 3 0 4-1.4-1-1.4-2.6 0-4Z" />
    </Svg>
  );
}

export function WoodworkIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 8h16v8H4z" />
      <path d="M7 8c1.5 2.4 1.5 5.6 0 8" />
      <path d="M12 8c1.5 2.4 1.5 5.6 0 8" />
      <path d="M17 8c1.5 2.4 1.5 5.6 0 8" />
    </Svg>
  );
}

export function TextilesIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M5 4h14v16l-3.5-2-3.5 2-3.5-2L5 20V4Z" />
      <path d="M5 9h14M5 14h14" />
    </Svg>
  );
}

export function JewelryIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M8 4h8l3 4-7 12L5 8l3-4Z" />
      <path d="M5 8h14M9.5 4 8 8l4 12 4-12-1.5-4" />
    </Svg>
  );
}

/* Feature icons */
export function HandmadeIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 20s-6-3.7-6-8.3A3.2 3.2 0 0 1 12 9a3.2 3.2 0 0 1 6 2.7C18 16.3 12 20 12 20Z" />
    </Svg>
  );
}

export function EcoIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M19 5c0 8-4.5 12-11 12 0-7 4-11 11-12Z" />
      <path d="M5 19c2-4 5-6.5 9-8" />
    </Svg>
  );
}

export function BatchIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 4 4 8l8 4 8-4-8-4Z" />
      <path d="M4 12l8 4 8-4" />
      <path d="M4 16l8 4 8-4" />
    </Svg>
  );
}

export function ShippingIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M3 7h11v8H3z" />
      <path d="M14 10h4l3 3v2h-7z" />
      <circle cx="7" cy="18" r="1.4" />
      <circle cx="17.5" cy="18" r="1.4" />
    </Svg>
  );
}

/* Social icons */
export function InstagramIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="4" y="4" width="16" height="16" rx="4.5" />
      <circle cx="12" cy="12" r="3.4" />
      <circle cx="17" cy="7" r="0.6" fill="currentColor" />
    </Svg>
  );
}

export function PinterestIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7c-2.2 0-3.6 1.4-3.6 3.2 0 .9.4 1.7 1.1 2M12 7c2 0 3.4 1.2 3.4 3 0 2.3-1.3 4-3.1 4-.8 0-1.5-.5-1.3-1.3M11 13.7 9.6 19" />
    </Svg>
  );
}

export function FacebookIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M14 8.5h2V5.7h-2.2C12 5.7 11 7 11 8.6V10H9v2.8h2V21h2.8v-8.2H16l.4-2.8H13.8V9c0-.4.2-.5.6-.5Z" />
    </Svg>
  );
}

export function StarIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="m12 2 2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.8 6.2 20l1.1-6.5L2.6 8.8l6.5-.9L12 2Z" />
    </svg>
  );
}
