"use client";

import Link from "next/link";
import { useEffect } from "react";

// Branded fallback for any unexpected server or render error in a page segment,
// shown in place of the raw platform error screen. The header and footer from
// the root layout still surround it.
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-2xl px-5 py-24 text-center">
      <p className="label text-ochre-deep">Something went wrong</p>
      <h1 className="mt-2 font-display text-4xl font-bold">We hit a snag</h1>
      <p className="mt-4 text-ink/70">
        An unexpected error occurred while loading this page. Please try again in
        a moment.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={reset} className="btn btn-ink">
          Try again
        </button>
        <Link href="/" className="btn btn-outline">
          Back home
        </Link>
      </div>
    </div>
  );
}
