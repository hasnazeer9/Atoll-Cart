import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Fire02Icon } from "@hugeicons/core-free-icons";
import ProductCard from "./ui/ProductCard";
import ProductRow from "./ProductRow";
import { previewCategories, type PreviewProduct } from "@/lib/preview-products";
import { categoryIcons } from "./categoryIcons";

export default function ProductPreview({ products }: { products: PreviewProduct[] }) {
  const deals = [...products]
    .filter((p) => p.discountPercentage)
    .sort((a, b) => (b.discountPercentage ?? 0) - (a.discountPercentage ?? 0))
    .slice(0, 8);
  const gadgets = products.filter((p) => p.category === "Phones" || p.category === "Electronics").slice(0, 8);

  return (
    <section id="preview" className="py-12">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-7 sm:gap-3">
          {previewCategories.map((c) => (
            <Link
              key={c}
              href={`/products?category=${encodeURIComponent(c)}`}
              className="flex flex-col items-center gap-2 rounded-xl bg-surface px-1 py-3 text-xs font-medium transition hover:bg-brand-soft hover:text-brand-dark sm:text-sm"
            >
              <HugeiconsIcon icon={categoryIcons[c]} size={28} strokeWidth={1.25} className="text-brand-dark" />
              {c}
            </Link>
          ))}
        </div>

        {deals.length > 0 && (
        <ProductRow
          title="Hot Deals"
          href="/products?sale=1"
          products={deals}
          accent={<HugeiconsIcon icon={Fire02Icon} size={22} strokeWidth={1.5} className="text-brand-dark" />}
        />
        )}
        {gadgets.length > 0 && <ProductRow title="Phones & Gadgets" href="/products?category=Phones" products={gadgets} />}

        <h3 className="mb-4 mt-10 text-xl font-bold">More to Love</h3>
        <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
          {products.map((p) => (
            <ProductCard key={p.id} {...p} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/products" className="inline-flex min-h-12 items-center rounded-full border border-brand-dark px-7 font-semibold text-brand-dark transition hover:bg-brand-soft">
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}
