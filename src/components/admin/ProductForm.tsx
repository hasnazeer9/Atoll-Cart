import Image from "next/image";
import { previewCategories } from "@/lib/preview-products";
import type { ProductRow } from "@/lib/data";
import { saveProductAction } from "@/app/admin/actions";
import { btnGhost, btnPrimary, inputClass, labelClass } from "./ui";
import Link from "next/link";

export default function ProductForm({ product }: { product?: ProductRow }) {
  return (
    <form action={saveProductAction} encType="multipart/form-data" className="max-w-2xl space-y-5 rounded-2xl border border-line bg-white p-6">
      {product && <input type="hidden" name="id" value={product.id} />}
      <input type="hidden" name="current_image" value={product?.image ?? ""} />

      <label className={labelClass}>Product name
        <input name="name" required maxLength={160} defaultValue={product?.name} className={`${inputClass} mt-1`} />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className={labelClass}>Category
          <select name="category" required defaultValue={product?.category ?? ""} className={`${inputClass} mt-1`}>
            <option value="" disabled>Choose…</option>
            {previewCategories.map((c) => <option key={c}>{c}</option>)}
          </select>
        </label>
        <label className={labelClass}>Status
          <select name="status" defaultValue={product?.status ?? "active"} className={`${inputClass} mt-1`}>
            <option value="active">Active (shown on the shop)</option>
            <option value="draft">Draft (hidden)</option>
          </select>
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className={labelClass}>Price (MVR)
          <input name="price" type="number" step="0.01" min="0" required defaultValue={product?.price} className={`${inputClass} mt-1`} />
        </label>
        <label className={labelClass}>Original price <span className="font-normal text-ink-muted">(optional)</span>
          <input name="original_price" type="number" step="0.01" min="0" defaultValue={product?.original_price ?? ""} className={`${inputClass} mt-1`} />
        </label>
        <label className={labelClass}>Stock
          <input name="stock" type="number" step="1" min="0" required defaultValue={product?.stock ?? 0} className={`${inputClass} mt-1`} />
        </label>
      </div>
      <p className="-mt-2 text-xs text-ink-muted">A discount badge appears automatically when the original price is higher than the price.</p>

      <div>
        <p className={labelClass}>Photo</p>
        {product?.image && (
          <div className="relative mt-2 h-28 w-28 overflow-hidden rounded-xl bg-surface">
            <Image src={product.image} alt="" fill unoptimized sizes="112px" className="object-cover" />
          </div>
        )}
        <input name="image" type="file" accept="image/jpeg,image/png,image/webp" className="mt-2 block text-sm" />
        <p className="mt-1 text-xs text-ink-muted">JPG, PNG or WebP, up to 5 MB. Leave empty to keep the current photo.</p>
      </div>

      <div className="flex gap-3">
        <button type="submit" className={btnPrimary}>{product ? "Save changes" : "Add product"}</button>
        <Link href="/admin/products" className={btnGhost}>Cancel</Link>
      </div>
    </form>
  );
}
