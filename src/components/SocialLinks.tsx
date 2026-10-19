import { HugeiconsIcon } from "@hugeicons/react";
import { InstagramIcon, Facebook01Icon, TiktokIcon, WhatsappIcon } from "@hugeicons/core-free-icons";
import { siteConfig } from "@/config/site";

const platforms = [
  { key: "instagram", label: "Instagram", icon: InstagramIcon },
  { key: "facebook", label: "Facebook", icon: Facebook01Icon },
  { key: "tiktok", label: "TikTok", icon: TiktokIcon },
  { key: "whatsapp", label: "WhatsApp", icon: WhatsappIcon },
] as const;

export function hasSocialLinks() {
  return platforms.some((p) => siteConfig.social[p.key]);
}

export default function SocialLinks() {
  const active = platforms.filter((p) => siteConfig.social[p.key]);
  if (active.length === 0) return null;
  return (
    <ul className="flex gap-3">
      {active.map((p) => (
        <li key={p.key}>
          <a
            href={siteConfig.social[p.key]} target="_blank" rel="noopener noreferrer" aria-label={p.label}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white transition hover:border-brand hover:text-brand-dark"
          >
            <HugeiconsIcon icon={p.icon} size={22} strokeWidth={1.5} />
          </a>
        </li>
      ))}
    </ul>
  );
}
