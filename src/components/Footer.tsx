import Link from "next/link";
import { siteConfig } from "@/config/site";
import { previewCategories } from "@/lib/preview-products";
import { getSettings } from "@/lib/settings";
import Logo from "./Logo";
import SocialLinks from "./SocialLinks";

const linkClass = "block py-1 text-ink-muted transition-colors hover:text-brand-dark";

export default function Footer() {
  const settings = getSettings();
  const { email, phone } = settings;
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-5">
        <div className="space-y-3 lg:col-span-2">
          <Logo name={settings.name} />
          <p className="max-w-xs text-sm text-ink-muted">{settings.description}</p>
          <SocialLinks />
        </div>

        <nav aria-label="Shop by category" className="text-sm">
          <p className="mb-2 font-semibold">Shop</p>
          <Link href="/products" className={linkClass}>All Products</Link>
          {previewCategories.map((c) => (
            <Link key={c} href={`/products?category=${encodeURIComponent(c)}`} className={linkClass}>{c}</Link>
          ))}
        </nav>

        <nav aria-label="Company" className="text-sm">
          <p className="mb-2 font-semibold">Company</p>
          {siteConfig.nav.map((i) => (
            <Link key={i.href} href={i.href} className={linkClass}>{i.label}</Link>
          ))}
          <Link href="/login" className={linkClass}>Login</Link>
          <Link href="/terms" className={linkClass}>Terms and Conditions</Link>
          <Link href="/privacy" className={linkClass}>Privacy Policy</Link>
        </nav>

        {(email || phone) && (
          <div className="text-sm">
            <p className="mb-2 font-semibold">Contact</p>
            {email && <a href={`mailto:${email}`} className={linkClass}>{email}</a>}
            {phone && <a href={`tel:${phone}`} className={linkClass}>{phone}</a>}
          </div>
        )}
      </div>
      <div className="border-t border-line bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-1 px-4 py-4 text-xs text-ink-muted sm:flex-row">
          <span>© {new Date().getFullYear()} {settings.name}. All rights reserved.</span>
          <span>All prices shown in MVR</span>
          <span>Developed by: Hassan Nazeer</span>
        </div>
      </div>
    </footer>
  );
}
