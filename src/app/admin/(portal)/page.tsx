import Link from "next/link";
import { dashboardStats, listOrders, lowStockProducts } from "@/lib/data";
import { formatMVR } from "@/lib/utils";
import { PageHeader, StatusBadge, Table, th, td, fmtDate } from "@/components/admin/ui";

export default function DashboardPage() {
  const s = dashboardStats();
  const cards = [
    { label: "Products", value: s.products, note: `${s.active} live on the shop` },
    { label: "Orders", value: s.orders, note: `${s.pending} pending` },
    { label: "Revenue", value: formatMVR(s.revenue), note: "excluding cancelled" },
    { label: "Customers", value: s.customers, note: "saved customers" },
    { label: "Low stock", value: s.lowStock, note: "5 or fewer left" },
    { label: "Out of stock", value: s.outOfStock, note: "shown as Sold out" },
  ];
  const recent = listOrders(5);
  const low = lowStockProducts();
  return (
    <>
      <PageHeader title="Dashboard" />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl border border-line bg-white p-4">
            <p className="text-xs font-medium text-ink-muted">{c.label}</p>
            <p className="mt-1 text-2xl font-extrabold">{c.value}</p>
            <p className="mt-1 text-xs text-ink-muted">{c.note}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-8 xl:grid-cols-2">
        <section>
          <h2 className="mb-3 font-semibold">Recent orders</h2>
          {recent.length === 0 ? (
            <p className="rounded-xl border border-dashed border-line p-6 text-sm text-ink-muted">No orders yet. <Link href="/admin/orders/new" className="text-brand-dark underline">Create one</Link>.</p>
          ) : (
            <Table>
              <thead><tr><th className={th}>Order</th><th className={th}>Customer</th><th className={th}>Total</th><th className={th}>Status</th></tr></thead>
              <tbody className="divide-y divide-line">
                {recent.map((o) => (
                  <tr key={o.id}>
                    <td className={td}><Link href={`/admin/orders/${o.id}`} className="font-medium text-brand-dark">#{o.id}</Link><span className="block text-xs text-ink-muted">{fmtDate(o.created_at)}</span></td>
                    <td className={td}>{o.customer_name}</td>
                    <td className={td}>{formatMVR(o.total)}</td>
                    <td className={td}><StatusBadge status={o.status} /></td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </section>
        <section>
          <h2 className="mb-3 font-semibold">Needs restocking</h2>
          {low.length === 0 ? (
            <p className="rounded-xl border border-dashed border-line p-6 text-sm text-ink-muted">Everything is well stocked.</p>
          ) : (
            <Table>
              <thead><tr><th className={th}>Product</th><th className={th}>Stock</th></tr></thead>
              <tbody className="divide-y divide-line">
                {low.map((p) => (
                  <tr key={p.id}>
                    <td className={td}><Link href={`/admin/products/${p.id}`} className="text-brand-dark">{p.name}</Link></td>
                    <td className={`${td} font-semibold ${p.stock === 0 ? "text-red-600" : ""}`}>{p.stock}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </section>
      </div>
    </>
  );
}
