import { getSettings } from "@/lib/settings";

export default function AnnouncementBar() {
  const text = getSettings().announcement;
  if (!text) return null;
  return <div className="bg-brand-soft py-2 text-center text-sm font-medium text-brand-dark">{text}</div>;
}
