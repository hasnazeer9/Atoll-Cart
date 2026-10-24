import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FormMessage, fieldClass, primaryBtn } from "@/components/AuthShell";
import { listOrdersForCustomer } from "@/lib/data";
import { requireAccount } from "@/lib/customer-auth";
import { formatMVR } from "@/lib/utils";
import { logoutAction, updateProfileAction } from "./actions";

export const metadata: Metadata = { title: "My account", robots: { index: false } };

export default async function AccountPage({ searchParams }: { searchParams: Promise<{ error?: string; saved?: string }> }) {
  const account = await requireAccount();
  const { error, saved } = await searchParams;
  const orders = listOrdersForCustomer(account.id);
  return (
    <>
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold">Hello, {account.name.split(" ")[0]}</h1>
            <p className="text-sm text-ink-muted">{account.email}</p>
          </div>
          <form action={logoutAction}>
            <button type="submit" className="rounded-full border border-gray-300 px-5 py-2 text-sm font-medium hover:border-brand-dark hover:text-brand-dark">Log out</button>
          </form>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
          <section>
            <h2 className="mb-3 text-lg font-semibold">My orders</h2>
            {orders.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-line p-8 text-center text-sm text-ink-muted">
                You haven&apos;t placed an order yet. <Link href="/products" className="font-medium text-brand-dark underline">Start shopping</Link>
              </div>
            ) : (
              <ul className="divide-y divide-line rounded-2xl border border-line">
                {orders.map((o) => (
                  <li key={o.id} className="flex items-center justify-between gap-4 p-4 text-sm">
                    <div>
                      <Link href={`/order/${o.public_code}`} className="font-semibold text-brand-dark">Order #{o.id}</Link>
                      <p className="text-xs text-ink-muted">{new Date(o.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatMVR(o.total)}</p>
                      <p className="text-xs capitalize text-ink-muted">{o.status}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold">My details</h2>
            <form action={updateProfileAction} className="space-y-4 rounded-2xl border border-line p-5">
              <FormMessage error={error} saved={saved} />
              <label className="block text-sm font-medium">Full name
                <input name="name" required defaultValue={account.name} className={fieldClass} />
              </label>
              <label className="block text-sm font-medium">Phone
                <input name="phone" type="tel" defaultValue={account.phone} className={fieldClass} />
              </label>
              <label className="block text-sm font-medium">Delivery address
                <textarea name="address" rows={3} defaultValue={account.address} className={`${fieldClass} py-2`} />
              </label>
              <button type="submit" className={primaryBtn}>Save details</button>
            </form>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
