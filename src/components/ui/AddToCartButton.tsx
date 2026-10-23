"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { ShoppingCartAdd01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { addToCart, useCart } from "@/lib/cart";

export default function AddToCartButton({ id, name }: { id: string; name?: string }) {
  const qty = useCart().find((l) => l.id === id)?.qty ?? 0;
  const label = name ?? "this product";

  return (
    <button
      type="button"
      onClick={() => addToCart(id)}
      aria-label={qty ? `Add another ${label} to cart (${qty} in cart)` : `Add ${label} to cart`}
      className={`relative flex h-10 w-10 items-center justify-center rounded-full shadow-card transition hover:scale-110 ${
        qty ? "bg-brand-dark text-white" : "bg-white/90 text-ink hover:bg-brand hover:text-white"
      }`}
    >
      <HugeiconsIcon icon={qty ? Tick02Icon : ShoppingCartAdd01Icon} size={20} strokeWidth={1.5} />
      {qty > 1 && (
        <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-ink px-1 text-[10px] font-bold text-white">
          {qty}
        </span>
      )}
    </button>
  );
}
