import Link from "next/link";
import { siteConfig } from "@/config/site";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 rounded-lg font-bold text-lg">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={siteConfig.logo} alt="" width={32} height={32} className="h-8 w-8" />
      <span>{siteConfig.name}</span>
    </Link>
  );
}
