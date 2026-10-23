import Link from "next/link";
import { notFound } from "next/navigation";
import { ORDER_STATUSES, PAYMENT_LABELS, getOrder } from "@/lib/data";
import { getSettings } from "@/lib/settings";
import { formatMVR } from "@/lib/utils";
import { setOrderStatusAction } from "../../../actions";
import { Notice, PageHeader, StatusBadge, btnPrimary, fmtDate, inputClass } from "@/components/admin/ui";

export default async function OrderDetailPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ error?: string; saved?: string }> }) {
  const { id } = await params;
  const { error, saved } = await searchParams;
  const found = getOrder(Number(id));
  if (!found) notFound();
  const { order, items } = found;
  const { gstRate } = getSettings();
  // Shop prices are GST-inclusive, so GST is the part of the total that is tax.
  const gst = Math.round(((order.total * gstRate) / (100 + gstRate)) * 100) / 100;
  return (
    <>
      <PageHeader title={`Order #${order.id}`} />
      <Notice error={error} saved={saved} />
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <section className="rounded-2xl border border-line bg-white">
          <ul className="divide-y divide-line">
            {items.map((i) => (
              <li key={i.id} className="flex items-center justify-between gap-4 p-4 text-sm">
                <span>{i.name} <span className="text-ink-muted">× {i.qty}</span></span>
                <span className="font-medium">{formatMVR(i.price * i.qty)}</span>
              </li>
            ))}
          </ul>
          <div className="space-y-1 border-t border-line p-4 text-sm">
            {order.delivery_fee > 0 && <p className="flex justify-between text-ink-muted"><span>Delivery fee</span><span>{formatMVR(order.delivery_fee)}</span></p>}
            <p className="flex justify-between text-ink-muted"><span>Includes GST ({gstRate}%)</span><span>{formatMVR(gst)}</span></p>
            <p className="flex justify-between text-base font-bold"><span>Total</span><span>{formatMVR(order.total)}</span></p>
          </div>
        </section>
        <aside className="space-y-4">
          <div className="rounded-2xl border border-line bg-white p-4 text-sm">
            <p className="mb-2 flex items-center justify-between font-semibold">Status <StatusBadge status={order.status} /></p>
            <form action={setOrderStatusAction} className="flex gap-2">
              <input type="hidden" name="id" value={order.id} />
              <select name="status" defaultValue={order.status} aria-label="Order status" className={`${inputClass} capitalize`}>
                {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <button type="submit" className={btnPrimary}>Update</button>
            </form>
            <p className="mt-2 text-xs text-ink-muted">Cancelling an order puts its items back in stock.</p>
          </div>
          <div className="rounded-2xl border border-line bg-white p-4 text-sm">
            <p className="font-semibold">Customer</p>
            <p className="mt-1">{order.customer_id ? <Link href={`/admin/customers/${order.customer_id}`} className="text-brand-dark underline">{order.customer_name}</Link> : order.customer_name}</p>
            {order.customer_phone && <p className="text-ink-muted">{order.customer_phone}</p>}
            {order.email && <p className="text-ink-muted">{order.email}</p>}
            {order.address && <p className="mt-2 whitespace-pre-line">{order.address}</p>}
            <p className="mt-3 text-xs text-ink-muted">Payment: {PAYMENT_LABELS[order.payment_method]}</p>
            <p className="mt-3 text-xs text-ink-muted">Placed {fmtDate(order.created_at)}</p>
            {order.note && <p className="mt-3 rounded-lg bg-surface p-2">{order.note}</p>}
          </div>
        </aside>
      </div>
    </>
  );
}
