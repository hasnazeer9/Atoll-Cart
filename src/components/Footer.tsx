import Link from "next/link";
import { siteConfig } from "@/config/site";
import Logo from "./Logo";
import SocialLinks from "./SocialLinks";

export default function Footer() {
  const { email, phone } = siteConfig.contact;
  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3">
        <div className="space-y-3">
          <Logo />
          <p className="max-w-xs text-sm text-ink-muted">{siteConfig.description}</p>
          <SocialLinks />
        </div>
        <nav aria-label="Footer" className="space-y-2 text-sm">
          <p className="font-semibold">Links</p>
          {siteConfig.nav.map((i) => (
            <Link key={i.href} href={i.href} className="block text-ink-muted hover:text-brand-dark">{i.label}</Link>
          ))}
          <Link href="/terms" className="block text-ink-muted hover:text-brand-dark">Terms and Conditions</Link>
          <Link href="/privacy" className="block text-ink-muted hover:text-brand-dark">Privacy Policy</Link>
        </nav>
        {(email || phone) && (
          <div className="space-y-2 text-sm">
            <p className="font-semibold">Contact</p>
            {email && <a href={`mailto:${email}`} className="block text-ink-muted hover:text-brand-dark">{email}</a>}
            {phone && <a href={`tel:${phone}`} className="block text-ink-muted hover:text-brand-dark">{phone}</a>}
          </div>
        )}
      </div>
      <div className="border-t border-line py-4 text-center text-xs text-ink-muted">
        © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
      </div>
    </footer>
  );
}
