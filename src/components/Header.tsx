"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Menu01Icon, Cancel01Icon, ShoppingBag01Icon } from "@hugeicons/core-free-icons";
import { siteConfig } from "@/config/site";
import Logo from "./Logo";

const cartLinkClass =
  "flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-brand-soft hover:text-brand-dark";

export default function Header() {
  const [open, setOpen] = useState(false);

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

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Logo />
          <nav aria-label="Main" className="ml-auto mr-4 hidden items-center gap-8 md:flex">
            {siteConfig.nav.map((item) => (
              <Link key={item.href} href={item.href} className="rounded text-sm font-medium text-ink-muted transition-colors hover:text-brand-dark">
                {item.label}
              </Link>
            ))}
          </nav>
          <Link href="/cart" aria-label="Cart (coming soon)" className={`${cartLinkClass} hidden md:flex`}>
            <HugeiconsIcon icon={ShoppingBag01Icon} size={20} strokeWidth={1.25} />
          </Link>
          <div className="ml-auto flex items-center md:hidden">
            <Link href="/cart" aria-label="Cart (coming soon)" className={cartLinkClass}>
              <HugeiconsIcon icon={ShoppingBag01Icon} size={20} strokeWidth={1.25} />
            </Link>
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-lg"
              aria-label="Open menu"
              aria-expanded={open}
              aria-controls="mobile-nav"
              onClick={() => setOpen(true)}
            >
              <HugeiconsIcon icon={Menu01Icon} size={24} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer: sits outside <header> so backdrop-blur doesn't clip it. */}
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
            {siteConfig.nav.map((item) => (
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
