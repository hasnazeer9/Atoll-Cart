import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import ProductCard from "./ui/ProductCard";
import type { PreviewProduct } from "@/lib/preview-products";

type Props = {
  title: string;
  href: string;
  products: PreviewProduct[];
  accent?: React.ReactNode; // optional icon next to the title
};

// A titled, horizontally scrollable row of cards (swipe on phones).
export default function ProductRow({ title, href, products, accent }: Props) {
  return (
    <div className="mt-10">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-xl font-bold">
          {accent}
          {title}
        </h3>
        <Link href={href} className="flex items-center gap-1 text-sm font-medium text-ink-muted hover:text-brand-dark">
          View all <HugeiconsIcon icon={ArrowRight01Icon} size={16} strokeWidth={1.5} />
        </Link>
      </div>
      <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-3 sm:mx-0 sm:px-0">
        {products.map((p) => (
          <div key={p.id} className="w-[42%] shrink-0 snap-start sm:w-44 lg:w-48">
            <ProductCard {...p} />
          </div>
        ))}
      </div>
    </div>
  );
}
