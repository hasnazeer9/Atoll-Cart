// Central branding configuration. Replace placeholder values with real
// business details. Empty strings mean "not configured yet" and the matching
// UI is hidden automatically.
export const siteConfig = {
  name: "Atoll Cart", // placeholder business name
  shortName: "AC",
  title: "Atoll Cart — Coming Soon to the Maldives",
  description:
    "A better way to shop online in the Maldives is on its way. Sign up to hear when we launch.",
  logo: "/logo.svg",
  favicon: "/favicon.svg",
  currency: "MVR",
  colors: {
    primary: "#F59E0B",
    primaryDark: "#EA580C",
    soft: "#FFF3E0",
    background: "#FFFFFF",
    surface: "#F8FAFC",
    border: "#E5E7EB",
    text: "#292929",
    textMuted: "#737373",
  },
  contact: {
    email: "", // e.g. "hello@example.mv"
    phone: "", // e.g. "+960 000 0000"
  },
  // Leave a link empty to hide it. Never invent URLs.
  social: {
    instagram: "",
    facebook: "",
    tiktok: "",
    whatsapp: "", // e.g. "https://wa.me/9600000000"
  },
  address: "", // shop address, shown in the location section when set
  googleMapsEmbedUrl: "", // the "src" of a Google Maps embed iframe
  nav: [
    { label: "Home", href: "/" },
    { label: "All Products", href: "/products" },
    { label: "About Us", href: "/#about" },
    { label: "Contact", href: "/#connect" },
    { label: "Login", href: "/login" },
  ],
};

export type SiteConfig = typeof siteConfig;
