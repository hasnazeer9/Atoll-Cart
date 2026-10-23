"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { formatMVR } from "@/lib/utils";
import type { PreviewProduct } from "@/lib/preview-products";
import { placeOrderAction, type CheckoutState } from "@/app/checkout/actions";

const input =
  "min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm focus:border-brand-dark focus:outline-none focus:ring-2 focus:ring-brand/40";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="min-h-12 w-full rounded-full bg-brand-dark font-semibold text-white transition hover:bg-brand disabled:opacity-60">
      {pending ? "Placing order…" : "Place order"}
    </button>
  );
}

type Props = { products: PreviewProduct[]; deliveryFee: number; gstRate: number; bankEnabled: boolean };

export default function CheckoutForm({ products, deliveryFee, gstRate, bankEnabled }: Props) {
  const lines = useCart();
  const [state, formAction] = useActionState<CheckoutState, FormData>(placeOrderAction, {});
  const items = lines.flatMap((l) => {
    const product = products.find((p) => p.id === l.id);
    return product ? [{ ...l, product }] : [];
  });
  const subtotal = items.reduce((sum, i) => sum + (i.product.price ?? 0) * i.qty, 0);
  const total = subtotal + deliveryFee;
  const gst = Math.round(((total * gstRate) / (100 + gstRate)) * 100) / 100;
  const v = state.values ?? {};

  if (items.length === 0) {
    return (
      <div className="mt-8 rounded-2xl border border-dashed border-line p-10 text-center">
        <p className="font-semibold">Your cart is empty.</p>
        <Link href="/products" className="mt-5 inline-block rounded-full bg-brand-dark px-6 py-3 font-semibold text-white">Browse products</Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
      <input type="hidden" name="cart" value={JSON.stringify(items.map(({ id, qty }) => ({ id, qty })))} />
      {/* Trap for bots; hidden from people and screen readers. */}
      <div aria-hidden="true" className="absolute -left-[9999px]">
        <label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>

      <div className="space-y-6">
        {state.error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{state.error}</p>}

        <section className="space-y-4 rounded-2xl border border-line p-5">
          <h2 className="font-semibold">Your details</h2>
          <label className="block text-sm font-medium">Full name
            <input name="name" required autoComplete="name" defaultValue={v.name} className={`${input} mt-1`} />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium">Phone
              <input name="phone" type="tel" required autoComplete="tel" defaultValue={v.phone} className={`${input} mt-1`} />
            </label>
            <label className="block text-sm font-medium">Email <span className="font-normal text-ink-muted">(optional)</span>
              <input name="email" type="email" autoComplete="email" defaultValue={v.email} className={`${input} mt-1`} />
            </label>
          </div>
          <label className="block text-sm font-medium">Delivery address
            <textarea name="address" required rows={3} autoComplete="street-address" placeholder="Island, ward, house name / street" defaultValue={v.address} className={`${input} mt-1 py-2`} />
          </label>
          <label className="block text-sm font-medium">Order note <span className="font-normal text-ink-muted">(optional)</span>
            <textarea name="note" rows={2} defaultValue={v.note} className={`${input} mt-1 py-2`} />
          </label>
        </section>

        <fieldset className="space-y-3 rounded-2xl border border-line p-5">
          <legend className="px-1 font-semibold">Payment</legend>
          <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-line p-3 text-sm has-[:checked]:border-brand-dark has-[:checked]:bg-brand-soft">
            <input type="radio" name="payment" value="cod" defaultChecked={v.payment !== "bank"} className="mt-1 accent-brand-dark" />
            <span><span className="font-medium">Cash on delivery</span><span className="block text-ink-muted">Pay when your order arrives.</span></span>
          </label>
          {bankEnabled && (
            <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-line p-3 text-sm has-[:checked]:border-brand-dark has-[:checked]:bg-brand-soft">
              <input type="radio" name="payment" value="bank" defaultChecked={v.payment === "bank"} className="mt-1 accent-brand-dark" />
              <span><span className="font-medium">Bank transfer</span><span className="block text-ink-muted">Transfer details are shown after you place the order.</span></span>
            </label>
          )}
          <p className="text-xs text-ink-muted">Card payments aren&apos;t available yet.</p>
        </fieldset>
      </div>

      <aside className="h-fit space-y-3 rounded-2xl border border-line bg-surface p-5">
        <h2 className="font-semibold">Order summary</h2>
        <ul className="space-y-3">
          {items.map(({ id, qty, product }) => (
            <li key={id} className="flex gap-3 text-sm">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-white">
                {product.image && <Image src={product.image} alt="" fill unoptimized sizes="56px" className="object-cover" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2">{product.name}</p>
                <p className="text-ink-muted">{qty} × {formatMVR(product.price ?? 0)}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="space-y-1 border-t border-line pt-3 text-sm">
          <p className="flex justify-between"><span className="text-ink-muted">Subtotal</span><span>{formatMVR(subtotal)}</span></p>
          <p className="flex justify-between"><span className="text-ink-muted">Delivery</span><span>{deliveryFee > 0 ? formatMVR(deliveryFee) : "Free"}</span></p>
          <p className="flex justify-between text-xs text-ink-muted"><span>Includes GST ({gstRate}%)</span><span>{formatMVR(gst)}</span></p>
          <p className="flex justify-between pt-1 text-base font-bold"><span>Total</span><span className="text-brand-dark">{formatMVR(total)}</span></p>
        </div>
        <SubmitButton />
        <Link href="/cart" className="block text-center text-sm text-ink-muted underline">Back to cart</Link>
      </aside>
    </form>
  );
}
