import Link from "next/link";
import { BRAND } from "@/lib/config";
import { NewsletterForm } from "@/components/NewsletterForm";
import {
  InstagramIcon,
  PinterestIcon,
  FacebookIcon,
} from "@/components/icons";

const SHOP_LINKS = [
  { href: "/shop", label: "All products" },
  { href: "/#categories", label: "Categories" },
  { href: "/#why", label: "Why us" },
  { href: "/#testimonials", label: "Reviews" },
];

const SOCIALS = [
  { label: "Instagram", href: "#", Icon: InstagramIcon },
  { label: "Pinterest", href: "#", Icon: PinterestIcon },
  { label: "Facebook", href: "#", Icon: FacebookIcon },
];

export function Footer() {
  return (
    <footer className="mt-28 border-t border-line bg-paper-deep/50">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1.6fr]">
          {/* Brand */}
          <div>
            <div className="font-display text-2xl font-semibold">{BRAND.name}</div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink/60">
              {BRAND.tagline} Each piece is made by hand in a small numbered lot.
            </p>
            <div className="mt-5 flex gap-3">
              {SOCIALS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink/70 transition hover:border-ochre hover:text-ochre-deep"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <nav aria-label="Shop">
            <h2 className="label text-ink/45">Shop</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {SHOP_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-ink/70 transition-colors hover:text-ochre-deep"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h2 className="label text-ink/45">Contact</h2>
            <ul className="mt-4 space-y-2.5 text-sm text-ink/70">
              <li>
                <a href="mailto:hello@maati.co" className="transition-colors hover:text-ochre-deep">
                  hello@maati.co
                </a>
              </li>
              <li>
                <a href="tel:+10000000000" className="transition-colors hover:text-ochre-deep">
                  +1 (000) 000 0000
                </a>
              </li>
              <li className="text-ink/55">The Studio, Maker&apos;s Lane</li>
              <li>
                <Link href="/admin" className="transition-colors hover:text-ochre-deep">
                  Studio login
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h2 className="label text-ink/45">Newsletter</h2>
            <p className="mt-4 text-sm text-ink/60">
              Notes from the studio and first look at new lots.
            </p>
            <div className="mt-4">
              <NewsletterForm compact />
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="label text-ink/40">
            &copy; {new Date().getFullYear()} {BRAND.name}. Made in small lots.
          </p>
          <p className="label text-ink/40">Crafted with care.</p>
        </div>
      </div>
    </footer>
  );
}
