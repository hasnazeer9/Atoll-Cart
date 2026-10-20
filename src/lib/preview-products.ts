import type { ProductCardProps } from "@/components/ui/ProductCard";

// ILLUSTRATIVE sample data only. These are not real products, prices or
// ratings. Ratings are intentionally left out because no genuine data exists.
// 24 cards fill the grid evenly at 2, 3, 4 and 6 columns.
export type PreviewProduct = ProductCardProps & { id: string; category: string };

export const previewCategories = ["Phones", "Electronics", "Bags", "Fashion", "Home", "Kitchen", "Gifts"] as const;

export const previewProducts: PreviewProduct[] = [
  { id: "p1", category: "Bags", image: "/products/p1.jpg", name: "Genuine Leather Backpack — Everyday Commuter Bag", price: 249, originalPrice: 349, discountPercentage: 29, badge: "Preview" },
  { id: "p2", category: "Electronics", image: "/products/p2.jpg", name: "True Wireless Earbuds with Charging Case", price: 399, badge: "Preview" },
  { id: "p3", category: "Kitchen", image: "/products/p3.jpg", name: "Insulated Stainless Steel Water Bottle, 500ml", price: 129, originalPrice: 159, discountPercentage: 19, badge: "Preview" },
  { id: "p4", category: "Home", image: "/products/p4.jpg", name: "Adjustable Arm Desk Lamp, Warm Light", price: 189, badge: "Preview" },
  { id: "p5", category: "Electronics", image: "/products/p5.jpg", name: "Instant Film Camera — Compact Square Format", price: 899, originalPrice: 1099, discountPercentage: 18, badge: "Preview" },
  { id: "p6", category: "Home", image: "/products/p6.jpg", name: "Ceramic Table Vase, Matte White", price: 95, badge: "Preview" },
  { id: "p7", category: "Phones", image: "/products/p7.jpg", name: "Smartphone with 6.5\" Display, 128GB", price: 2499, originalPrice: 2999, discountPercentage: 17, badge: "Preview" },
  { id: "p8", category: "Fashion", image: "/products/p8.jpg", name: "Classic White Leather Sneakers", price: 459, badge: "Preview" },
  { id: "p9", category: "Home", image: "/products/p9.jpg", name: "Minimalist Round Wall Clock, 30cm", price: 149, originalPrice: 199, discountPercentage: 25, badge: "Preview" },
  { id: "p10", category: "Gifts", image: "/products/p10.jpg", name: "Gift Box Set with Satin Ribbon", price: 219, badge: "Preview" },
  { id: "p11", category: "Kitchen", image: "/products/p11.jpg", name: "Portable Rechargeable Blender, 380ml", price: 279, originalPrice: 329, discountPercentage: 15, badge: "Preview" },
  { id: "p12", category: "Gifts", image: "/products/p12.jpg", name: "Hand-Poured Soy Wax Candle", price: 79, badge: "Preview" },
  { id: "p13", category: "Phones", image: "/products/p13.jpg", name: "Foldable Smartphone — Red Leather Finish", price: 14999, badge: "Preview" },
  { id: "p14", category: "Phones", image: "/products/p14.jpg", name: "Foldable Smartphone — Black Leather Finish", price: 14999, originalPrice: 15999, discountPercentage: 6, badge: "Preview" },
  { id: "p15", category: "Phones", image: "/products/p15.jpg", name: "Pro Camera Smartphone, Triple Lens 50MP", price: 8999, originalPrice: 9999, discountPercentage: 10, badge: "Preview" },
  { id: "p16", category: "Electronics", image: "/products/p16.jpg", name: "Fitness Smartwatch with Heart-Rate Monitor", price: 1299, badge: "Preview" },
  { id: "p17", category: "Electronics", image: "/products/p17.jpg", name: "Portable Bluetooth Speaker, Waterproof", price: 459, originalPrice: 549, discountPercentage: 16, badge: "Preview" },
  { id: "p18", category: "Electronics", image: "/products/p18.jpg", name: "Noise-Cancelling Over-Ear Headphones", price: 1199, originalPrice: 1499, discountPercentage: 20, badge: "Preview" },
  { id: "p19", category: "Electronics", image: "/products/p19.jpg", name: "10.9\" Tablet with Folio Case", price: 4999, badge: "Preview" },
  { id: "p20", category: "Electronics", image: "/products/p20.jpg", name: "Ultrabook Laptop, 13.3\" Display", price: 11999, originalPrice: 12999, discountPercentage: 8, badge: "Preview" },
  { id: "p21", category: "Electronics", image: "/products/p21.jpg", name: "20,000mAh Power Bank with 3-in-1 Cable", price: 349, originalPrice: 399, discountPercentage: 13, badge: "Preview" },
  { id: "p22", category: "Electronics", image: "/products/p22.jpg", name: "Retro Mechanical Keyboard, Hot-Swappable", price: 599, badge: "Preview" },
  { id: "p23", category: "Fashion", image: "/products/p23.jpg", name: "Round Metal-Frame Sunglasses, UV400", price: 159, originalPrice: 229, discountPercentage: 31, badge: "Preview" },
  { id: "p24", category: "Bags", image: "/products/p24.jpg", name: "Black Canvas Tote Bag", price: 89, badge: "Preview" },
];
