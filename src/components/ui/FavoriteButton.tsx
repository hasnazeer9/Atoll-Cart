"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { FavouriteIcon } from "@hugeicons/core-free-icons";
import { toggleFavorite, useFavorites } from "@/lib/favorites";

export default function FavoriteButton({ id, name }: { id: string; name?: string }) {
  const active = useFavorites().includes(id);
  const label = name ?? "this product";

  return (
    <button
      type="button"
      onClick={() => toggleFavorite(id)}
      aria-pressed={active}
      aria-label={active ? `Remove ${label} from favourites` : `Add ${label} to favourites`}
      className={`flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-card transition hover:scale-110 ${
        active ? "text-red-500" : "text-ink-muted hover:text-red-500"
      }`}
    >
      <HugeiconsIcon
        icon={FavouriteIcon}
        size={20}
        strokeWidth={1.5}
        className={active ? "[&_path]:fill-current" : ""}
      />
    </button>
  );
}
