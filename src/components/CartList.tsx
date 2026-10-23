"use client";

import Image from "next/image";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon, MinusSignIcon, Delete02Icon } from "@hugeicons/core-free-icons";
import { clearCart, removeFromCart, setQuantity, useCart } from "@/lib/cart";
import type { PreviewProduct } from "@/lib/preview-products";
import { formatMVR } from "@/lib/utils";

export default function CartList({ products }: { products: PreviewProduct[] }) {
  const lines = useCart();
  const items = lines.flatMap((l) => {
    const product = products.find((p) => p.id === l.id);
    return product ? [{ ...l, product }] : [];
  });
  const total = items.reduce((sum, i) => sum + (i.product.price ?? 0) * i.qty, 0);

  if (items.length === 0) {
    return (
      <div className="mt-8 rounded-2xl border border-dashed border-line p-10 text-center">
        <p className="font-semibold">Your cart is empty.</p>
        <p className="mt-1 text-sm text-ink-muted">Tap the cart icon on a product to add it.</p>
        <Link href="/products" className="mt-5 inline-block rounded-full bg-brand-dark px-6 py-3 font-semibold text-white">
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
      <ul className="divide-y divide-line rounded-2xl border border-line">
        {items.map(({ id, qty, product }, index) => (
          <li key={id} className="flex gap-4 p-4">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-surface sm:h-24 sm:w-24">
              {product.image && <Image src={product.image} alt={product.name ?? ""} fill unoptimized priority={index === 0} sizes="96px" className="object-cover" />}
            </div>
            <div className="flex min-w-0 flex-1 flex-col">
              <p className="line-clamp-2 text-sm">{product.name}</p>
              <p className="mt-1 font-bold text-brand-dark">{formatMVR(product.price ?? 0)}</p>
              <div className="mt-auto flex items-center justify-between pt-2">
                <div className="flex items-center rounded-full border border-line">
                  <button type="button" aria-label="Decrease quantity" onClick={() => setQuantity(id, qty - 1)} className="flex h-9 w-9 items-center justify-center">
                    <HugeiconsIcon icon={MinusSignIcon} size={16} strokeWidth={1.5} />
                  </button>
                  <span className="w-8 text-center text-sm font-medium" aria-live="polite">{qty}</span>
                  <button type="button" aria-label="Increase quantity" onClick={() => setQuantity(id, qty + 1)} className="flex h-9 w-9 items-center justify-center">
                    <HugeiconsIcon icon={Add01Icon} size={16} strokeWidth={1.5} />
                  </button>
                </div>
                <button type="button" aria-label={`Remove ${product.name} from cart`} onClick={() => removeFromCart(id)} className="flex h-9 w-9 items-center justify-center rounded-full text-ink-muted hover:text-red-500">
                  <HugeiconsIcon icon={Delete02Icon} size={18} strokeWidth={1.5} />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <aside className="h-fit rounded-2xl border border-line bg-surface p-5">
        <h2 className="font-semibold">Summary</h2>
        <div className="mt-3 flex justify-between text-sm">
          <span className="text-ink-muted">Subtotal</span>
          <span className="text-lg font-extrabold text-brand-dark">{formatMVR(total)}</span>
        </div>
        <Link href="/checkout" className="mt-5 flex min-h-12 w-full items-center justify-center rounded-full bg-brand-dark font-semibold text-white transition hover:bg-brand">
          Checkout
        </Link>
        <p className="mt-3 text-xs text-ink-muted">
          Pay on delivery or by bank transfer. Delivery fee, if any, is added at checkout.
        </p>
        <button type="button" onClick={clearCart} className="mt-4 text-sm font-medium text-brand-dark underline">
          Clear cart
        </button>
      </aside>
    </div>
  );
}
