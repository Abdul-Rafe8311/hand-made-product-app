"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { BRAND } from "@/lib/config";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-5 py-16">
      <p className="label text-ochre-deep">{BRAND.name} studio</p>
      <h1 className="mt-2 font-display text-4xl font-bold">Sign in</h1>
      <p className="mt-2 text-ink/65">
        The studio dashboard is for staff. Sign in with your admin account.
      </p>

      <form onSubmit={onSubmit} className="card mt-8 space-y-4 p-6">
        <div>
          <label htmlFor="email" className="label block text-ink/55">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1.5 w-full rounded-lg border border-ink/20 bg-paper px-3.5 py-2.5 text-sm focus:border-ochre focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="password" className="label block text-ink/55">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-1.5 w-full rounded-lg border border-ink/20 bg-paper px-3.5 py-2.5 text-sm focus:border-ochre focus:outline-none"
          />
        </div>

        {error ? (
          <p
            className="rounded-lg border border-ochre/40 bg-ochre/10 px-3 py-2 text-sm text-ink"
            role="alert"
          >
            {error}
          </p>
        ) : null}

        <button type="submit" className="btn btn-ink w-full" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
