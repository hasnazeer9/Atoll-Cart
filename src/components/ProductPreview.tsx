import Link from "next/link";
import ProductCard from "./ui/ProductCard";
import { previewProducts } from "@/lib/preview-products";

// The home page shows a hand-picked 12; the full list lives on /products.
const featuredIds = ["p13", "p14", "p15", "p7", "p18", "p16", "p1", "p5", "p8", "p4", "p10", "p17"];
const featured = featuredIds.map((id) => previewProducts.find((p) => p.id === id)!);

export default function ProductPreview() {
  return (
    <section id="preview" className="bg-surface py-16">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="text-3xl font-bold">A Sneak Peek at What&apos;s Coming</h2>
        <p className="mt-2 text-ink-muted">
          Preview only — these sample cards show the look of our future shop. Products, prices and discounts are
          illustrative and not available for purchase.
        </p>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 md:grid-cols-4 xl:grid-cols-6">
          {featured.map((p) => (
            <ProductCard key={p.id} {...p} />
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/products" className="inline-flex min-h-12 items-center rounded-full border border-brand-dark px-7 font-semibold text-brand-dark transition hover:bg-brand-soft">
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}
