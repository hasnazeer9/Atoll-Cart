import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { getSettings } from "@/lib/settings";
import { logoutAction } from "../actions";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/customers", label: "Customers" },
  { href: "/admin/settings", label: "Settings" },
];

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin(); // every portal page is behind this check
  const { name } = getSettings();
  return (
    <div className="lg:flex">
      <aside className="border-b border-line bg-white lg:fixed lg:inset-y-0 lg:w-60 lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between px-4 py-4 lg:block">
          <p className="font-bold">{name}</p>
          <p className="text-xs text-ink-muted">Admin portal</p>
        </div>
        <nav aria-label="Admin" className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:pb-0">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-ink-muted transition hover:bg-brand-soft hover:text-brand-dark">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="hidden px-4 py-4 text-sm lg:absolute lg:bottom-0 lg:block lg:w-full lg:border-t lg:border-line">
          <p className="truncate font-medium">{admin.name}</p>
          <p className="truncate text-xs text-ink-muted">{admin.email}</p>
          <div className="mt-3 flex gap-3">
            <Link href="/" target="_blank" className="text-brand-dark underline">View shop</Link>
            <form action={logoutAction}><button type="submit" className="text-ink-muted underline">Log out</button></form>
          </div>
        </div>
      </aside>
      <main className="min-w-0 flex-1 p-4 sm:p-8 lg:ml-60">
        <div className="mb-4 flex justify-end gap-4 text-sm lg:hidden">
          <Link href="/" target="_blank" className="text-brand-dark underline">View shop</Link>
          <form action={logoutAction}><button type="submit" className="text-ink-muted underline">Log out</button></form>
        </div>
        {children}
      </main>
    </div>
  );
}
