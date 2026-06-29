import type { ProductKind } from "@/lib/types";

// Maps a product slug to the line-art kind. Falls back on keyword matching so
// new products still get sensible art before they have a real photo.
export function resolveKind(slug: string): ProductKind {
  const known: Record<string, ProductKind> = {
    "soy-candle": "candle",
    "stoneware-mug": "mug",
    "wooden-bowl": "bowl",
    "stoneware-planter": "planter",
    "wool-scarf": "scarf",
    "tote-bag": "tote",
  };
  if (known[slug]) return known[slug];
  if (slug.includes("candle")) return "candle";
  if (slug.includes("mug")) return "mug";
  if (slug.includes("bowl")) return "bowl";
  if (slug.includes("planter") || slug.includes("pot")) return "planter";
  if (slug.includes("scarf")) return "scarf";
  return "tote";
}

const TINTS: Record<ProductKind, string> = {
  candle: "#efe1c8",
  mug: "#dde4d7",
  bowl: "#dde2ea",
  planter: "#d9e3d1",
  scarf: "#f1e2c9",
  tote: "#dfe2ea",
};

const ink = "#1e2c47";
const ochre = "#d8941f";
const olive = "#5f7355";

function Art({ kind }: { kind: ProductKind }) {
  const common = {
    fill: "none",
    stroke: ink,
    strokeWidth: 2.4,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (kind) {
    case "candle":
      return (
        <g {...common}>
          <rect x="70" y="96" width="60" height="70" rx="9" />
          <line x1="70" y1="112" x2="130" y2="112" />
          <line x1="100" y1="96" x2="100" y2="82" />
          <path
            d="M100 60 C108 72 109 80 100 88 C91 80 92 72 100 60 Z"
            stroke={ochre}
            fill={ochre}
            fillOpacity={0.18}
          />
        </g>
      );
    case "mug":
      return (
        <g {...common}>
          <path d="M72 88 L72 140 Q72 152 84 152 L116 152 Q128 152 128 140 L128 88" />
          <ellipse cx="100" cy="88" rx="28" ry="8" />
          <path d="M128 98 Q152 102 152 118 Q152 134 128 134" />
          <path d="M92 70 Q88 62 94 56" stroke={ochre} />
          <path d="M108 70 Q104 62 110 56" stroke={ochre} />
        </g>
      );
    case "bowl":
      return (
        <g {...common}>
          <ellipse cx="100" cy="100" rx="40" ry="11" />
          <path d="M60 100 A 40 34 0 0 0 140 100" />
          <path d="M78 100 A 22 12 0 0 0 122 100" stroke={ochre} />
        </g>
      );
    case "planter":
      return (
        <g {...common}>
          <path d="M76 112 L124 112 L116 160 L84 160 Z" />
          <line x1="71" y1="112" x2="129" y2="112" />
          <path d="M100 112 L100 74" stroke={olive} />
          <path d="M100 112 C95 92 84 86 80 76" stroke={olive} />
          <path d="M100 112 C105 94 116 88 122 80" stroke={olive} />
        </g>
      );
    case "scarf":
      return (
        <g {...common}>
          <path d="M62 92 q12 -9 24 0 t24 0 t24 0 t8 0" />
          <path d="M62 108 q12 -9 24 0 t24 0 t24 0 t8 0" />
          <path d="M62 124 q12 -9 24 0 t24 0 t24 0 t8 0" />
          <g stroke={ochre}>
            <line x1="66" y1="132" x2="66" y2="144" />
            <line x1="82" y1="134" x2="82" y2="146" />
            <line x1="98" y1="132" x2="98" y2="144" />
            <line x1="114" y1="134" x2="114" y2="146" />
            <line x1="130" y1="132" x2="130" y2="144" />
          </g>
        </g>
      );
    case "tote":
    default:
      return (
        <g {...common}>
          <path d="M72 98 L78 162 L122 162 L128 98 Z" />
          <line x1="70" y1="98" x2="130" y2="98" />
          <path d="M84 98 Q100 64 116 98" />
          <path
            d="M100 120 l8 8 l-8 8 l-8 -8 Z"
            stroke={ochre}
            fill={ochre}
            fillOpacity={0.18}
          />
        </g>
      );
  }
}

type Props = {
  kind: ProductKind;
  imageUrl?: string | null;
  alt: string;
  className?: string;
  priority?: boolean;
};

// Renders a real photo when image_url is set, otherwise the inline line-art on
// a soft tinted panel. Swapping in real photography later is just a data change.
export function ProductArt({ kind, imageUrl, alt, className }: Props) {
  if (imageUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={imageUrl}
        alt={alt}
        className={`h-full w-full object-cover ${className ?? ""}`}
      />
    );
  }

  return (
    <div
      className={`flex h-full w-full items-center justify-center ${className ?? ""}`}
      style={{ backgroundColor: TINTS[kind] }}
      role="img"
      aria-label={alt}
    >
      <svg viewBox="0 0 200 200" className="h-3/4 w-3/4" aria-hidden="true">
        <Art kind={kind} />
      </svg>
    </div>
  );
}
