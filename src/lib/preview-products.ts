import type { ProductCardProps } from "@/components/ui/ProductCard";

// ILLUSTRATIVE sample data only. These are not real products, prices or
// ratings. Ratings are intentionally left out because no genuine data exists.
// 12 cards fill the grid evenly at 2, 3 and 4 columns.
export const previewProducts: ProductCardProps[] = [
  { image: "/products/p1.svg", name: "Sample product — everyday carry bag with a long name to show two-line clamping", price: 249, originalPrice: 349, discountPercentage: 29, badge: "Preview" },
  { image: "/products/p2.svg", name: "Sample product — wireless earbuds", price: 399, badge: "Preview" },
  { image: "/products/p3.svg", name: "Sample product — insulated water bottle", price: 129, originalPrice: 159, discountPercentage: 19, badge: "Preview" },
  { image: "/products/p4.svg", name: "Sample product — minimalist desk lamp", price: 189, badge: "Preview" },
  { image: "/products/p5.svg", name: "Sample product — compact instant camera", price: 899, originalPrice: 1099, discountPercentage: 18, badge: "Preview" },
  { image: "/products/p6.svg", name: "Sample product — ceramic home decor piece", price: 95, badge: "Preview" },
  { image: "/products/p7.svg", name: "Sample product — smartphone with large display", price: 2499, originalPrice: 2999, discountPercentage: 17, badge: "Preview" },
  { image: "/products/p8.svg", name: "Sample product — comfortable everyday sneakers", price: 459, badge: "Preview" },
  { image: "/products/p9.svg", name: "Sample product — classic analog wall clock", price: 149, originalPrice: 199, discountPercentage: 25, badge: "Preview" },
  { image: "/products/p10.svg", name: "Sample product — gift box set", price: 219, badge: "Preview" },
  { image: "/products/p11.svg", name: "Sample product — portable travel blender", price: 279, originalPrice: 329, discountPercentage: 15, badge: "Preview" },
  { image: "/products/p12.svg", name: "Sample product — handmade keepsake", price: 79, badge: "Preview" },
];
