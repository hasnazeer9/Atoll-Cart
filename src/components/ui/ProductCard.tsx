import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import { StarIcon } from "@hugeicons/core-free-icons";
import { formatAmount } from "@/lib/utils";
import FavoriteButton from "./FavoriteButton";
import AddToCartButton from "./AddToCartButton";

export type ProductCardProps = {
  id?: string; // when set, the card shows a favourites heart
  image?: string;
  name?: string;
  price?: number;
  originalPrice?: number;
  discountPercentage?: number;
  rating?: number; // only pass genuine data
  reviewCount?: number; // only pass genuine data
  badge?: string;
  soldOut?: boolean; // out of stock: shows a label and hides the cart button
};

// Marketplace-style card: borderless, rounded image on top, compact text below.
export default function ProductCard({
  id,
  image,
  name,
  price,
  originalPrice,
  discountPercentage,
  rating,
  reviewCount,
  badge,
  soldOut,
}: ProductCardProps) {
  const showDiscount =
    typeof discountPercentage === "number" &&
    discountPercentage > 0 &&
    discountPercentage < 100 &&
    typeof originalPrice === "number" &&
    typeof price === "number" &&
    originalPrice > price;
  const showRating = typeof rating === "number" && rating > 0 && typeof reviewCount === "number" && reviewCount > 0;

  return (
    <article className="group flex h-full flex-col">
      <div className="relative aspect-square overflow-hidden rounded-xl bg-surface">
        {image && (
          <Image
            src={image}
            alt={name ?? "Product preview"}
            fill
            unoptimized
            sizes="(min-width: 1280px) 16vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        )}
        {soldOut && (
          <span className="absolute bottom-2 left-2 rounded-md bg-ink/80 px-2 py-0.5 text-xs font-semibold text-white">Sold out</span>
        )}
        {id ? (
          <div className="absolute right-2 top-2">
            <FavoriteButton id={id} name={name} />
          </div>
        ) : (
          badge && (
            <span className="absolute right-2 top-2 rounded-md bg-white/90 px-2 py-0.5 text-xs font-medium text-ink-muted">
              {badge}
            </span>
          )
        )}
        {id && typeof price === "number" && !soldOut && (
          <div className="absolute bottom-2 right-2">
            <AddToCartButton id={id} name={name} />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 pt-2">
        {name && (
          <h3 className="line-clamp-2 min-h-[2.4rem] text-[13px] leading-[1.2rem] transition-colors group-hover:text-brand-dark">
            {name}
          </h3>
        )}
        {typeof price === "number" && (
          <div className="flex flex-wrap items-baseline gap-x-1.5">
            <span className="text-lg font-extrabold leading-none text-brand-dark">
              <span className="mr-0.5 text-xs font-semibold">MVR</span>
              {formatAmount(price)}
            </span>
            {showDiscount && (
              <>
                <span className="text-xs text-ink-muted line-through">{formatAmount(originalPrice!)}</span>
                <span className="rounded bg-brand-soft px-1 py-0.5 text-[11px] font-bold leading-none text-brand-dark">
                  -{discountPercentage}%
                </span>
              </>
            )}
          </div>
        )}
        {showRating && (
          <div className="mt-auto flex items-center gap-1 text-xs text-ink-muted">
            <HugeiconsIcon icon={StarIcon} size={14} className="text-brand" />
            <span>{rating!.toFixed(1)}</span>
            <span>({reviewCount})</span>
          </div>
        )}
      </div>
    </article>
  );
}
