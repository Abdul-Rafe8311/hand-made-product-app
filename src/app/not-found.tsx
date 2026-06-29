import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-24 text-center">
      <p className="label text-ochre-deep">404</p>
      <h1 className="mt-2 font-display text-4xl font-bold">We could not find that</h1>
      <p className="mt-4 text-ink/70">
        The page or piece you were after is not here. It may have sold out or moved.
      </p>
      <Link href="/shop" className="btn btn-ink mt-8">
        Back to the catalogue
      </Link>
    </div>
  );
}
