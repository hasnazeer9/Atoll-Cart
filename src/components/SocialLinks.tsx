import { HugeiconsIcon } from "@hugeicons/react";
import { InstagramIcon, Facebook01Icon, TiktokIcon, WhatsappIcon } from "@hugeicons/core-free-icons";
import { getSettings } from "@/lib/settings";

const platforms = [
  { key: "instagram", label: "Instagram", icon: InstagramIcon },
  { key: "facebook", label: "Facebook", icon: Facebook01Icon },
  { key: "tiktok", label: "TikTok", icon: TiktokIcon },
  { key: "whatsapp", label: "WhatsApp", icon: WhatsappIcon },
] as const;

export function hasSocialLinks() {
  const s = getSettings();
  return platforms.some((p) => s[p.key]);
}

export default function SocialLinks() {
  const settings = getSettings();
  const active = platforms.filter((p) => settings[p.key]);
  if (active.length === 0) return null;
  return (
    <ul className="flex gap-3">
      {active.map((p) => (
        <li key={p.key}>
          <a
            href={settings[p.key]} target="_blank" rel="noopener noreferrer" aria-label={p.label}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white transition hover:border-brand hover:text-brand-dark"
          >
            <HugeiconsIcon icon={p.icon} size={22} strokeWidth={1.5} />
          </a>
        </li>
      ))}
    </ul>
  );
}
