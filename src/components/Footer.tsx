import Link from "next/link";
import { BRAND } from "@/lib/config";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-paper-deep/40">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-12 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="font-display text-lg font-bold">{BRAND.name}</div>
          <p className="mt-1 max-w-xs text-sm text-ink/60">{BRAND.tagline}</p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <Link href="/shop" className="transition hover:text-ochre-deep">
            Shop
          </Link>
          <Link href="/cart" className="transition hover:text-ochre-deep">
            Cart
          </Link>
          <Link href="/#how" className="transition hover:text-ochre-deep">
            How ordering works
          </Link>
          <Link href="/admin" className="transition hover:text-ochre-deep">
            Studio login
          </Link>
        </nav>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto max-w-6xl px-5 py-4">
          <p className="label text-ink/40">
            &copy; {new Date().getFullYear()} {BRAND.name}. Made in small lots.
          </p>
        </div>
      </div>
    </footer>
  );
}
