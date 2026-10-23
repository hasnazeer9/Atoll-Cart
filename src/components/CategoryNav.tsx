"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { siteConfig } from "@/config/site";
import { previewCategories } from "@/lib/preview-products";

const ALL = "All Products";
const base = "py-2.5 transition-colors";
const activeClass = "font-semibold text-brand-dark";
const idleClass = "text-ink-muted hover:text-brand-dark";

function CategoryLinks({ active }: { active: string | null }) {
  return (
    <nav aria-label="Categories" className="border-t border-line">
      <div className="mx-auto flex max-w-7xl items-center gap-6 overflow-x-auto whitespace-nowrap px-4 text-sm font-medium [scrollbar-width:none]">
        <Link href="/products" aria-current={active === ALL ? "page" : undefined} className={`${base} ${active === ALL ? activeClass : idleClass}`}>
          {ALL}
        </Link>
        {previewCategories.map((c) => (
          <Link
            key={c}
            href={`/products?category=${encodeURIComponent(c)}`}
            aria-current={active === c ? "page" : undefined}
            className={`${base} ${active === c ? activeClass : idleClass}`}
          >
            {c}
          </Link>
        ))}
        <span className="hidden flex-1 md:block" />
        {siteConfig.nav
          .filter((i) => i.label !== ALL)
          .map((item) => (
            <Link key={item.href} href={item.href} className={`${base} ${idleClass} hidden md:block`}>
              {item.label}
            </Link>
          ))}
      </div>
    </nav>
  );
}

// Orange link = the page/category you are on, worked out from the URL.
function ActiveCategoryNav() {
  const pathname = usePathname();
  const params = useSearchParams();
  const category = params.get("category");
  const active = pathname === "/products" ? (category && previewCategories.some((c) => c === category) ? category : ALL) : null;
  return <CategoryLinks active={active} />;
}

export default function CategoryNav() {
  return (
    <Suspense fallback={<CategoryLinks active={null} />}>
      <ActiveCategoryNav />
    </Suspense>
  );
}
