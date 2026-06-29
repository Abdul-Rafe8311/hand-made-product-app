import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "../actions";
import { BRAND } from "@/lib/config";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-5">
        <div>
          <p className="label text-ochre-deep">{BRAND.name} studio</p>
          <h1 className="mt-1 font-display text-3xl font-bold">Orders</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="label hidden text-ink/45 sm:inline">{user.email}</span>
          <form action={signOut}>
            <button type="submit" className="btn btn-outline !px-4 !py-2 text-sm">
              Sign out
            </button>
          </form>
        </div>
      </div>
      {children}
    </div>
  );
}
