"use client";

import { useState } from "react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function NewsletterForm({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const valid = EMAIL_RE.test(email);

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!valid) return;
    // No backend wired here; this confirms the interaction locally.
    setDone(true);
  }

  if (done) {
    return (
      <p className="text-sm text-olive" role="status">
        Thank you. We will be in touch with new lots and studio notes.
      </p>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className={compact ? "flex gap-2" : "mx-auto flex max-w-md flex-col gap-3 sm:flex-row"}
    >
      <label htmlFor={compact ? "nl-compact" : "nl-main"} className="sr-only">
        Email address
      </label>
      <input
        id={compact ? "nl-compact" : "nl-main"}
        type="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="you@example.com"
        className="w-full rounded-full border border-line bg-card px-4 py-2.5 text-sm text-ink placeholder:text-ink/40 focus:border-ochre focus:outline-none"
      />
      <button
        type="submit"
        className="btn btn-ink shrink-0 !px-6 !py-2.5 text-sm"
        disabled={!valid}
      >
        Subscribe
      </button>
    </form>
  );
}
