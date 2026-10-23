import Link from "next/link";
import { ORDER_STATUSES, listOrders } from "@/lib/data";
import { formatMVR } from "@/lib/utils";
import { PageHeader, StatusBadge, Table, fmtDate, td, th } from "@/components/admin/ui";

export default async function OrdersPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const filter = (ORDER_STATUSES as readonly string[]).includes(status ?? "") ? status : undefined;
  const orders = listOrders().filter((o) => !filter || o.status === filter);
  return (
    <>
      <PageHeader title="Orders" action={{ href: "/admin/orders/new", label: "New order" }} />
      <p className="mb-4 rounded-lg bg-brand-soft p-3 text-sm text-brand-dark">
        Orders placed on the shop appear here automatically. You can also add phone or chat orders by hand with “New order”.
      </p>
      <nav aria-label="Filter by status" className="mb-4 flex flex-wrap gap-2 text-sm">
        {[undefined, ...ORDER_STATUSES].map((s) => (
          <Link key={s ?? "all"} href={s ? `/admin/orders?status=${s}` : "/admin/orders"}
            className={`rounded-full border px-3 py-1 capitalize ${filter === s ? "border-brand-dark bg-brand-dark text-white" : "border-gray-300 bg-white"}`}>
            {s ?? "All"}
          </Link>
        ))}
      </nav>
      <Table>
        <thead><tr><th className={th}>Order</th><th className={th}>Customer</th><th className={th}>Date</th><th className={th}>Total</th><th className={th}>Status</th></tr></thead>
        <tbody className="divide-y divide-line">
          {orders.map((o) => (
            <tr key={o.id}>
              <td className={td}><Link href={`/admin/orders/${o.id}`} className="font-medium text-brand-dark">#{o.id}</Link></td>
              <td className={td}>{o.customer_name}<span className="block text-xs text-ink-muted">{o.customer_phone}</span></td>
              <td className={td}>{fmtDate(o.created_at)}</td>
              <td className={td}>{formatMVR(o.total)}</td>
              <td className={td}><StatusBadge status={o.status} /></td>
            </tr>
          ))}
          {orders.length === 0 && <tr><td colSpan={5} className={`${td} text-center text-ink-muted`}>No orders.</td></tr>}
        </tbody>
      </Table>
    </>
  );
}
