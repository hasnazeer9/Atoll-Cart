import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ClearCartOnMount from "@/components/ClearCartOnMount";
import { PAYMENT_LABELS, getOrderByCode } from "@/lib/data";
import { getSettings } from "@/lib/settings";
import { formatMVR } from "@/lib/utils";

export const metadata: Metadata = { title: "Your order", robots: { index: false, follow: false } };

export default async function OrderPage({ params, searchParams }: { params: Promise<{ code: string }>; searchParams: Promise<{ placed?: string }> }) {
  const { code } = await params;
  const { placed } = await searchParams;
  const found = getOrderByCode(code);
  if (!found) notFound();
  const { order, items } = found;
  const settings = getSettings();
  const gst = Math.round(((order.total * settings.gstRate) / (100 + settings.gstRate)) * 100) / 100;
  const subtotal = order.total - order.delivery_fee;

  return (
    <>
      <Header />
      {placed && <ClearCartOnMount />}
      <main className="mx-auto max-w-2xl px-4 py-10">
        <div className="rounded-2xl bg-brand-soft p-6 text-center">
          <h1 className="text-2xl font-bold">{placed ? "Thank you! Your order is placed." : "Your order"}</h1>
          <p className="mt-1 text-ink-muted">Order number <strong className="text-ink">#{order.id}</strong> · status <strong className="capitalize text-ink">{order.status}</strong></p>
          <p className="mt-2 text-sm text-ink-muted">Keep this page&apos;s link to check your order later. We&apos;ll contact you on {order.customer_phone} about delivery.</p>
        </div>

        {order.payment_method === "bank" && (
          <section className="mt-6 rounded-2xl border border-brand p-5">
            <h2 className="font-semibold">Pay by bank transfer</h2>
            <p className="mt-1 text-sm text-ink-muted">Please transfer <strong className="text-ink">{formatMVR(order.total)}</strong> and use <strong className="text-ink">order #{order.id}</strong> as the reference.</p>
            <p className="mt-3 whitespace-pre-line rounded-lg bg-surface p-3 text-sm">{settings.bankDetails}</p>
          </section>
        )}

        <section className="mt-6 rounded-2xl border border-line">
          <ul className="divide-y divide-line">
            {items.map((i) => (
              <li key={i.id} className="flex justify-between gap-4 p-4 text-sm">
                <span>{i.name} <span className="text-ink-muted">× {i.qty}</span></span>
                <span className="font-medium">{formatMVR(i.price * i.qty)}</span>
              </li>
            ))}
          </ul>
          <div className="space-y-1 border-t border-line p-4 text-sm">
            <p className="flex justify-between"><span className="text-ink-muted">Subtotal</span><span>{formatMVR(subtotal)}</span></p>
            <p className="flex justify-between"><span className="text-ink-muted">Delivery</span><span>{order.delivery_fee > 0 ? formatMVR(order.delivery_fee) : "Free"}</span></p>
            <p className="flex justify-between text-xs text-ink-muted"><span>Includes GST ({settings.gstRate}%)</span><span>{formatMVR(gst)}</span></p>
            <p className="flex justify-between pt-1 text-base font-bold"><span>Total</span><span>{formatMVR(order.total)}</span></p>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-line p-5 text-sm">
          <h2 className="font-semibold">Delivery details</h2>
          <p className="mt-2">{order.customer_name}</p>
          <p className="text-ink-muted">{order.customer_phone}{order.email && ` · ${order.email}`}</p>
          <p className="mt-1 whitespace-pre-line">{order.address}</p>
          <p className="mt-3 text-ink-muted">Payment: {PAYMENT_LABELS[order.payment_method]}</p>
          {order.note && <p className="mt-2 rounded-lg bg-surface p-2">{order.note}</p>}
        </section>

        <div className="mt-8 text-center">
          <Link href="/products" className="inline-block rounded-full border border-brand-dark px-6 py-3 font-semibold text-brand-dark hover:bg-brand-soft">Continue shopping</Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
