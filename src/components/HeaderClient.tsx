"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Form from "next/form";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Menu01Icon,
  Cancel01Icon,
  ShoppingBag01Icon,
  FavouriteIcon,
  UserIcon,
  Search01Icon,
  Location01Icon,
} from "@hugeicons/core-free-icons";
import { siteConfig } from "@/config/site";
import { useFavorites } from "@/lib/favorites";
import { useCart } from "@/lib/cart";
import Logo from "./Logo";
import CategoryNav from "./CategoryNav";

const iconLink =
  "relative flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-brand-soft hover:text-brand-dark";

function SearchBar({ className = "" }: { className?: string }) {
  return (
    <Form action="/products" role="search" className={`flex overflow-hidden rounded-full border-2 border-brand focus-within:ring-2 focus-within:ring-brand/30 ${className}`}>
      <label className="flex-1">
        <span className="sr-only">Search products</span>
        <input
          type="search" name="q" placeholder="Search for products…" autoComplete="off"
          className="h-10 w-full bg-white px-4 text-sm placeholder:text-gray-400 focus:outline-none"
        />
      </label>
      <button type="submit" aria-label="Search" className="flex w-14 items-center justify-center bg-brand text-white transition hover:bg-brand-dark">
        <HugeiconsIcon icon={Search01Icon} size={20} strokeWidth={2} />
      </button>
    </Form>
  );
}

export default function HeaderClient({ shopName, accountName }: { shopName: string; accountName: string | null }) {
  const [open, setOpen] = useState(false);
  const favoriteCount = useFavorites().length;
  const cartCount = useCart().reduce((n, l) => n + l.qty, 0);

  // Close on Escape and lock page scroll while the drawer is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const favoritesLink = (
    <Link href="/products?favorites=1" aria-label={`Favourites (${favoriteCount})`} className={iconLink}>
      <HugeiconsIcon icon={FavouriteIcon} size={21} strokeWidth={1.25} />
      {favoriteCount > 0 && (
        <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-dark px-1 text-[10px] font-bold text-white">
          {favoriteCount}
        </span>
      )}
    </Link>
  );
  const cartLink = (
    <Link href="/cart" aria-label={`Cart (${cartCount} items)`} className={iconLink}>
      <HugeiconsIcon icon={ShoppingBag01Icon} size={21} strokeWidth={1.25} />
      {cartCount > 0 && (
        <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-dark px-1 text-[10px] font-bold text-white">
          {cartCount}
        </span>
      )}
    </Link>
  );

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line bg-white">
        {/* Thin utility strip */}
        <div className="hidden bg-surface text-xs text-ink-muted md:block">
          <div className="mx-auto flex h-8 max-w-7xl items-center justify-between px-4">
            <span className="flex items-center gap-1">
              <HugeiconsIcon icon={Location01Icon} size={14} strokeWidth={1.5} /> Serving the Maldives
            </span>
            <span>All prices in MVR</span>
          </div>
        </div>

        {/* Logo, search, account */}
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2 md:gap-6">
          <Logo name={shopName} />
          <SearchBar className="hidden max-w-2xl flex-1 md:flex" />
          <div className="ml-auto flex items-center md:ml-0">
            <Link href={accountName ? "/account" : "/login"} className="mr-1 hidden max-w-[10rem] items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium transition-colors hover:bg-brand-soft hover:text-brand-dark md:flex">
              <HugeiconsIcon icon={UserIcon} size={20} strokeWidth={1.25} /> <span className="truncate">{accountName ?? "Login"}</span>
            </Link>
            {favoritesLink}
            {cartLink}
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-lg md:hidden"
              aria-label="Open menu"
              aria-expanded={open}
              aria-controls="mobile-nav"
              onClick={() => setOpen(true)}
            >
              <HugeiconsIcon icon={Menu01Icon} size={24} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Mobile search */}
        <div className="px-4 pb-2 md:hidden">
          <SearchBar />
        </div>

        <CategoryNav />
      </header>

      {/* Mobile drawer: sits outside <header> so it is never clipped. */}
      <div className={`fixed inset-0 z-50 md:hidden ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
        />
        <nav
          id="mobile-nav"
          aria-label="Mobile"
          className={`absolute right-0 top-0 flex h-full w-72 max-w-[85%] flex-col bg-white p-4 shadow-2xl transition-transform duration-300 ease-out ${open ? "translate-x-0" : "translate-x-full"}`}
        >
          <button
            type="button"
            className="ml-auto flex h-11 w-11 items-center justify-center rounded-lg"
            aria-label="Close menu"
            tabIndex={open ? 0 : -1}
            onClick={() => setOpen(false)}
          >
            <HugeiconsIcon icon={Cancel01Icon} size={24} strokeWidth={1.5} />
          </button>
          <ul className="mt-2 space-y-1">
            {[...siteConfig.nav, accountName ? { label: "My account", href: "/account" } : { label: "Login", href: "/login" }].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  tabIndex={open ? 0 : -1}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-4 py-3 text-base font-medium transition-colors hover:bg-brand-soft hover:text-brand-dark"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}
