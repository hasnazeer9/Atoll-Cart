"use client";

import { useSyncExternalStore } from "react";

// Frontend-only cart: item ids and quantities saved in this browser's
// localStorage. There is no checkout, payment or order system behind it yet.
const KEY = "atollcart:cart";
export type CartLine = { id: string; qty: number };
const EMPTY: CartLine[] = [];

let cache: CartLine[] | null = null;
const listeners = new Set<() => void>();

function read(): CartLine[] {
  if (cache) return cache;
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    cache = Array.isArray(parsed)
      ? parsed.filter((l) => l && typeof l.id === "string" && Number.isInteger(l.qty) && l.qty > 0)
      : [];
  } catch {
    cache = [];
  }
  return cache!;
}

function write(next: CartLine[]) {
  cache = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Storage blocked: the cart still works until the page reloads.
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = null;
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function addToCart(id: string) {
  const cart = read();
  const found = cart.find((l) => l.id === id);
  write(found ? cart.map((l) => (l.id === id ? { ...l, qty: Math.min(l.qty + 1, 99) } : l)) : [...cart, { id, qty: 1 }]);
}

export function setQuantity(id: string, qty: number) {
  write(qty <= 0 ? read().filter((l) => l.id !== id) : read().map((l) => (l.id === id ? { ...l, qty: Math.min(qty, 99) } : l)));
}

export function removeFromCart(id: string) {
  write(read().filter((l) => l.id !== id));
}

export function clearCart() {
  write([]);
}

export function useCart(): CartLine[] {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}
