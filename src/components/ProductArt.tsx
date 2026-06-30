import type { Product, ProductKind } from "@/lib/types";
import { kindForCategory } from "@/lib/categories";

// Maps a product to its line-art kind. The category drives it; a keyword
// fallback on the slug keeps things sensible if a category is ever missing,
// so a product always gets on-theme art before it has a real photo.
export function resolveKind(
  product: Pick<Product, "category" | "slug">
): ProductKind {
  const byCategory = kindForCategory(product.category);
  if (byCategory) return byCategory;

  const slug = product.slug ?? "";
  if (slug.includes("candle")) return "candle";
  if (
    slug.includes("bouquet") ||
    slug.includes("rose") ||
    slug.includes("tulip") ||
    slug.includes("sunflower") ||
    slug.includes("posy")
  ) {
    return "bouquet";
  }
  if (
    slug.includes("hamper") ||
    slug.includes("basket") ||
    slug.includes("box") ||
    slug.includes("crate")
  ) {
    return "giftbasket";
  }
  if (
    slug.includes("pot") ||
    slug.includes("jar") ||
    slug.includes("bird") ||
    slug.includes("elephant") ||
    slug.includes("dish")
  ) {
    return "decor";
  }
  return "crochet";
}

const TINTS: Record<ProductKind, string> = {
  bouquet: "#f0e6d6",
  crochet: "#ece2d2",
  candle: "#efe3cc",
  decor: "#e7ddcd",
  giftbasket: "#eadfce",
};

const ink = "#1e2a44";
const ochre = "#c89b5c";
const olive = "#6f7d63";

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
    case "bouquet":
      return (
        <g {...common}>
          {/* wrap cone */}
          <path d="M74 122 L100 168 L126 122" />
          <path d="M74 122 L90 98 M126 122 L110 98" />
          {/* stems */}
          <g stroke={olive}>
            <path d="M100 122 L100 96" />
            <path d="M100 124 L86 102" />
            <path d="M100 124 L114 102" />
          </g>
          {/* blooms */}
          <circle cx="86" cy="92" r="10" stroke={ochre} />
          <circle cx="114" cy="92" r="10" stroke={ochre} />
          <circle cx="100" cy="78" r="11" stroke={ochre} />
          <circle cx="86" cy="92" r="3" stroke={ochre} />
          <circle cx="114" cy="92" r="3" stroke={ochre} />
          <circle cx="100" cy="78" r="3" stroke={ochre} />
        </g>
      );
    case "crochet":
      return (
        <g {...common}>
          {/* yarn ball */}
          <circle cx="94" cy="108" r="32" />
          <g stroke={ochre}>
            <path d="M70 98 q24 10 48 0" />
            <path d="M64 112 q30 12 60 0" />
            <path d="M72 126 q22 8 44 0" />
            <path d="M86 79 q-6 30 4 58" />
            <path d="M104 80 q8 28 -2 56" />
          </g>
          {/* hook */}
          <path d="M120 92 L140 74" />
          <path d="M140 74 q8 -3 5 6" stroke={ochre} />
        </g>
      );
    case "decor":
      return (
        <g {...common}>
          <path d="M86 76 h28 l-3 12 q14 9 14 30 q0 30 -25 30 q-25 0 -25 -30 q0 -21 14 -30 Z" />
          <line x1="84" y1="76" x2="116" y2="76" />
          <path d="M80 120 q20 9 40 0" stroke={ochre} />
          <path d="M88 104 q12 6 24 0" stroke={ochre} />
        </g>
      );
    case "giftbasket":
    default:
      return (
        <g {...common}>
          <path d="M72 110 L78 160 L122 160 L128 110 Z" />
          <line x1="68" y1="110" x2="132" y2="110" />
          <path d="M82 110 Q100 80 118 110" />
          <g stroke={ochre}>
            <path d="M100 92 q-12 -10 -4 -18 q8 6 4 18 Z" />
            <path d="M100 92 q12 -10 4 -18 q-8 6 -4 18 Z" />
          </g>
          <line x1="86" y1="126" x2="86" y2="148" stroke={ochre} />
          <line x1="114" y1="126" x2="114" y2="148" stroke={ochre} />
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
