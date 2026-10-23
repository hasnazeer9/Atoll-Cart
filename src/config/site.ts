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
    email: "hello@atollcart.example", // SAMPLE: replace with the real address
    phone: "+960 912 3456", // SAMPLE: replace with the real number
  },
  // SAMPLE links: they point at each platform's home page, not a real account.
  // Replace with the shop's own pages. Leave a link empty to hide it.
  social: {
    instagram: "https://www.instagram.com/",
    facebook: "https://www.facebook.com/",
    tiktok: "https://www.tiktok.com/",
    whatsapp: "https://wa.me/9609123456",
  },
  advertisePhone: "9123456", // shown on the "Advertise Here" banner (All Products page)
  address: "Sample address: 12 Orange Lane, Malé 20002, Maldives", // SAMPLE: replace with the real shop address
  // SAMPLE map: an OpenStreetMap embed centred on Malé. Replace with a Google
  // Maps embed "src" (or any map embed URL) for the real shop location.
  googleMapsEmbedUrl:
    "https://www.openstreetmap.org/export/embed.html?bbox=73.4950%2C4.1650%2C73.5250%2C4.1900&layer=mapnik&marker=4.1755%2C73.5093",
  nav: [
    { label: "Home", href: "/" },
    { label: "All Products", href: "/products" },
    { label: "About Us", href: "/#about" },
    { label: "Contact", href: "/#connect" },
  ],
};

export type SiteConfig = typeof siteConfig;
