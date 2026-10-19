import ProductCard from "./ui/ProductCard";
import { previewProducts } from "@/lib/preview-products";

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
          {previewProducts.map((p, i) => (
            <ProductCard key={i} {...p} />
          ))}
        </div>
      </div>
    </section>
  );
}
