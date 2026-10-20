"use client";

import { useMemo, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon, FilterHorizontalIcon } from "@hugeicons/core-free-icons";
import ProductCard from "./ui/ProductCard";
import { useFavorites } from "@/lib/favorites";
import { previewCategories, previewProducts } from "@/lib/preview-products";

type Sort = "featured" | "price-asc" | "price-desc" | "discount";

const inputClass =
  "min-h-11 w-full rounded-xl border border-gray-300 bg-white px-3 text-sm transition focus:border-brand-dark focus:outline-none focus:ring-2 focus:ring-brand/40";

export default function ProductBrowser() {
  const [query, setQuery] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [onSale, setOnSale] = useState(false);
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const favorites = useFavorites();
  const [sort, setSort] = useState<Sort>("featured");
  const [showFilters, setShowFilters] = useState(false);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const min = minPrice === "" ? 0 : Number(minPrice);
    const max = maxPrice === "" ? Infinity : Number(maxPrice);
    const list = previewProducts.filter((p) => {
      const price = p.price ?? 0;
      if (q && !`${p.name} ${p.category}`.toLowerCase().includes(q)) return false;
      if (categories.length && !categories.includes(p.category)) return false;
      if (price < min || price > max) return false;
      if (onSale && !p.discountPercentage) return false;
      if (onlyFavorites && !favorites.includes(p.id)) return false;
      return true;
    });
    if (sort === "price-asc") list.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    if (sort === "price-desc") list.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    if (sort === "discount") list.sort((a, b) => (b.discountPercentage ?? 0) - (a.discountPercentage ?? 0));
    return list;
  }, [query, categories, minPrice, maxPrice, onSale, onlyFavorites, favorites, sort]);

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
    <div className="mt-8">
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="relative flex-1">
          <span className="sr-only">Search products</span>
          <HugeiconsIcon icon={Search01Icon} size={18} strokeWidth={1.5} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input
            type="search" value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products…" className={`${inputClass} pl-10`}
          />
        </label>
        <label className="sm:w-56">
          <span className="sr-only">Sort by</span>
          <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className={inputClass}>
            <option value="featured">Sort: Featured</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="discount">Biggest discount</option>
          </select>
        </label>
        <button
          type="button" onClick={() => setShowFilters((v) => !v)} aria-expanded={showFilters}
          className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-line px-4 text-sm font-medium lg:hidden"
        >
          <HugeiconsIcon icon={FilterHorizontalIcon} size={18} strokeWidth={1.5} /> Filters
        </button>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className={`${showFilters ? "block" : "hidden"} space-y-6 rounded-2xl border border-line bg-surface p-4 lg:block lg:self-start`}>
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
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 xl:grid-cols-4">
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
