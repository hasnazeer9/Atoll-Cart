"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "./ui/ProductCard";
import { useFavorites } from "@/lib/favorites";
import { previewCategories, type PreviewProduct } from "@/lib/preview-products";

const inputClass =
  "min-h-11 w-full rounded-xl border border-gray-300 bg-white px-3 text-sm transition focus:border-brand-dark focus:outline-none focus:ring-2 focus:ring-brand/40";

export default function ProductBrowser({ products }: { products: PreviewProduct[] }) {
  const [query, setQuery] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [onSale, setOnSale] = useState(false);
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const favorites = useFavorites();

  // Header search, category links and the favourites link arrive as URL params.
  const params = useSearchParams();
  useEffect(() => {
    setQuery(params.get("q") ?? "");
    const cat = params.get("category");
    setCategories(cat ? [cat] : []);
    setOnSale(params.get("sale") === "1");
    setOnlyFavorites(params.get("favorites") === "1");
  }, [params]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const min = minPrice === "" ? 0 : Number(minPrice);
    const max = maxPrice === "" ? Infinity : Number(maxPrice);
    const list = products.filter((p) => {
      const price = p.price ?? 0;
      if (q && !`${p.name} ${p.category}`.toLowerCase().includes(q)) return false;
      if (categories.length && !categories.includes(p.category)) return false;
      if (price < min || price > max) return false;
      if (onSale && !p.discountPercentage) return false;
      if (onlyFavorites && !favorites.includes(p.id)) return false;
      return true;
    });
    return list;
  }, [products, query, categories, minPrice, maxPrice, onSale, onlyFavorites, favorites]);

  const hasFilters = query || categories.length || minPrice || maxPrice || onSale || onlyFavorites;

  function clearAll() {
    setQuery("");
    setCategories([]);
    setMinPrice("");
    setMaxPrice("");
    setOnSale(false);
    setOnlyFavorites(false);
  }

  function toggleCategory(c: string) {
    setCategories((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));
  }

  return (
    <div>
      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="hidden space-y-6 rounded-2xl border border-line bg-surface p-4 lg:block lg:self-start">
          <fieldset>
            <legend className="mb-2 text-sm font-semibold">Category</legend>
            <div className="space-y-2">
              {previewCategories.map((c) => (
                <label key={c} className="flex min-h-8 items-center gap-2 text-sm">
                  <input type="checkbox" checked={categories.includes(c)} onChange={() => toggleCategory(c)} className="h-4 w-4 accent-brand-dark" />
                  {c}
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="mb-2 text-sm font-semibold">Price (MVR)</legend>
            <div className="flex items-center gap-2">
              <input type="number" min={0} inputMode="numeric" aria-label="Minimum price" placeholder="Min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className={inputClass} />
              <span className="text-ink-muted">–</span>
              <input type="number" min={0} inputMode="numeric" aria-label="Maximum price" placeholder="Max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className={inputClass} />
            </div>
          </fieldset>
          <label className="flex min-h-8 items-center gap-2 text-sm font-medium">
            <input type="checkbox" checked={onSale} onChange={(e) => setOnSale(e.target.checked)} className="h-4 w-4 accent-brand-dark" />
            On sale only
          </label>
          <label className="flex min-h-8 items-center gap-2 text-sm font-medium">
            <input type="checkbox" checked={onlyFavorites} onChange={(e) => setOnlyFavorites(e.target.checked)} className="h-4 w-4 accent-brand-dark" />
            Favourites only ({favorites.length})
          </label>
          {hasFilters && (
            <button type="button" onClick={clearAll} className="text-sm font-medium text-brand-dark underline">
              Clear all filters
            </button>
          )}
        </aside>

        <section aria-live="polite">
          <p className="mb-4 text-sm text-ink-muted">
            {results.length} {results.length === 1 ? "product" : "products"}
          </p>
          {results.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {results.map((p) => (
                <ProductCard key={p.id} {...p} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-line p-10 text-center">
              <p className="font-semibold">{onlyFavorites && favorites.length === 0 ? "You haven't added any favourites yet. Tap the heart on a product to save it." : "No products match your search."}</p>
              <button type="button" onClick={clearAll} className="mt-3 text-sm font-medium text-brand-dark underline">
                Clear all filters
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
