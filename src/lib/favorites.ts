"use client";

import { useSyncExternalStore } from "react";

// Frontend-only favourites: saved in this browser's localStorage, so they are
// not tied to an account and don't follow the visitor to another device.
const KEY = "atollcart:favorites";
const EMPTY: string[] = [];

let cache: string[] | null = null;
const listeners = new Set<() => void>();

function read(): string[] {
  if (cache) return cache;
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    cache = Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    cache = [];
  }
  return cache;
}

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Keep tabs in sync when another tab changes the list.
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

export function toggleFavorite(id: string) {
  const current = read();
  cache = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
  try {
    localStorage.setItem(KEY, JSON.stringify(cache));
  } catch {
    // Storage blocked (e.g. private mode): the heart still works until reload.
  }
  emit();
}

export function useFavorites(): string[] {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}
