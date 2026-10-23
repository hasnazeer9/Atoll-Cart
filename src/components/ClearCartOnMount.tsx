"use client";

import { useEffect } from "react";
import { clearCart } from "@/lib/cart";

// Empties the browser cart once, right after an order has been placed.
export default function ClearCartOnMount() {
  useEffect(() => {
    clearCart();
  }, []);
  return null;
}
