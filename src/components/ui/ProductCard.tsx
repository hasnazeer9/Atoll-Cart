import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import { StarIcon } from "@hugeicons/core-free-icons";
import { formatMVR } from "@/lib/utils";
import FavoriteButton from "./FavoriteButton";

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
};

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
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-lift">
      <div className="relative aspect-square overflow-hidden bg-surface">
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
        {showDiscount && (
          <span className="absolute left-2 top-2 rounded-md bg-brand-dark px-2 py-0.5 text-xs font-bold text-white">
            -{discountPercentage}%
          </span>
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
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3">
        {name && <h3 className="line-clamp-2 min-h-[2.5rem] text-sm leading-5">{name}</h3>}
        {typeof price === "number" && (
          <div className="flex flex-wrap items-baseline gap-x-2">
            <span className="text-lg font-extrabold text-brand-dark">{formatMVR(price)}</span>
            {showDiscount && <span className="text-xs text-ink-muted line-through">{formatMVR(originalPrice!)}</span>}
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
