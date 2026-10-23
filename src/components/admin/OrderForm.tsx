"use client";

import { useState } from "react";
import Link from "next/link";
import { createOrderAction } from "@/app/admin/actions";
import { btnGhost, btnPrimary, inputClass, labelClass } from "./ui";

type Option = { id: string; name: string; price: number; stock: number };
type Customer = { id: number; name: string };

export default function OrderForm({ products, customers }: { products: Option[]; customers: Customer[] }) {
  const [rows, setRows] = useState([{ key: 0 }]);
  const [next, setNext] = useState(1);

  return (
    <form action={createOrderAction} className="max-w-2xl space-y-6 rounded-2xl border border-line bg-white p-6">
      <fieldset className="space-y-4">
        <legend className="font-semibold">Customer</legend>
        <label className={labelClass}>Saved customer
          <select name="customer_id" defaultValue="" className={`${inputClass} mt-1`}>
            <option value="">— None / walk-in —</option>
            {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className={labelClass}>Name <span className="font-normal text-ink-muted">(if not saved)</span><input name="customer_name" maxLength={120} className={`${inputClass} mt-1`} /></label>
          <label className={labelClass}>Phone<input name="customer_phone" maxLength={40} className={`${inputClass} mt-1`} /></label>
        </div>
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="font-semibold">Items</legend>
        {rows.map((r) => (
          <div key={r.key} className="flex gap-2">
            <select name="productId" aria-label="Product" defaultValue="" className={inputClass}>
              <option value="" disabled>Choose a product…</option>
              {products.map((p) => (
                <option key={p.id} value={p.id} disabled={p.stock <= 0}>
                  {p.name} — MVR {p.price} ({p.stock <= 0 ? "out of stock" : `${p.stock} in stock`})
                </option>
              ))}
            </select>
            <input name="qty" type="number" min={1} step={1} defaultValue={1} aria-label="Quantity" className={`${inputClass} w-20 shrink-0`} />
            {rows.length > 1 && (
              <button type="button" aria-label="Remove item" onClick={() => setRows(rows.filter((x) => x.key !== r.key))} className="shrink-0 rounded-lg border border-gray-300 px-3 text-ink-muted hover:text-red-600">✕</button>
            )}
          </div>
        ))}
        <button type="button" onClick={() => { setRows([...rows, { key: next }]); setNext(next + 1); }} className="text-sm font-medium text-brand-dark underline">
          + Add another item
        </button>
      </fieldset>

      <label className={labelClass}>Note <span className="font-normal text-ink-muted">(optional)</span>
        <textarea name="note" rows={2} maxLength={500} className={`${inputClass} mt-1 py-2`} />
      </label>

      <div className="flex gap-3">
        <button type="submit" className={btnPrimary}>Create order</button>
        <Link href="/admin/orders" className={btnGhost}>Cancel</Link>
      </div>
    </form>
  );
}
