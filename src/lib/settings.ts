import { siteConfig } from "@/config/site";
import { readSettingRows } from "./data";

// Shop settings = the defaults in config/site.ts, overridden by whatever the
// admin saved in the portal.
export type Settings = {
  name: string;
  description: string;
  announcement: string;
  email: string;
  phone: string;
  address: string;
  mapEmbedUrl: string;
  advertisePhone: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  whatsapp: string;
  gstRate: number;
  deliveryFee: number;
  bankDetails: string;
};

export const SETTING_KEYS = [
  "name", "description", "announcement", "email", "phone", "address", "mapEmbedUrl",
  "advertisePhone", "instagram", "facebook", "tiktok", "whatsapp", "gstRate",
  "deliveryFee", "bankDetails",
] as const;

export function getSettings(): Settings {
  const d = readSettingRows();
  const pick = (key: string, fallback: string) => (key in d ? d[key] : fallback);
  const gst = Number(pick("gstRate", "8"));
  const fee = Number(pick("deliveryFee", "0"));
  return {
    name: pick("name", siteConfig.name),
    description: pick("description", siteConfig.description),
    announcement: pick("announcement", "Something exciting is coming to the Maldives!"),
    email: pick("email", siteConfig.contact.email),
    phone: pick("phone", siteConfig.contact.phone),
    address: pick("address", siteConfig.address),
    mapEmbedUrl: pick("mapEmbedUrl", siteConfig.googleMapsEmbedUrl),
    advertisePhone: pick("advertisePhone", siteConfig.advertisePhone),
    instagram: pick("instagram", siteConfig.social.instagram),
    facebook: pick("facebook", siteConfig.social.facebook),
    tiktok: pick("tiktok", siteConfig.social.tiktok),
    whatsapp: pick("whatsapp", siteConfig.social.whatsapp),
    gstRate: Number.isFinite(gst) && gst >= 0 ? gst : 8,
    deliveryFee: Number.isFinite(fee) && fee >= 0 ? fee : 0,
    bankDetails: pick("bankDetails", ""),
  };
}
