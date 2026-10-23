import { Suspense } from "react";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductBrowser from "@/components/ProductBrowser";
import HeroPhone from "@/components/HeroPhone";
import { getSettings } from "@/lib/settings";
import { listStoreProducts } from "@/lib/data";

export const metadata: Metadata = { title: "All Products (Preview)" };

export default function ProductsPage() {
  const { advertisePhone } = getSettings();
  const products = listStoreProducts();
  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-10">
        <h1 className="sr-only">All Products</h1>
        <div className="flex min-h-[210px] items-end justify-between gap-3 rounded-3xl bg-brand-soft px-4 pb-4 pt-12 sm:gap-8 sm:px-10">
          <HeroPhone src="/phone-red.webp" alt="" priority className="w-16 shrink-0 sm:w-24" />
          <div className="self-center text-center">
            <h2 className="text-2xl font-extrabold tracking-tight sm:text-4xl">Advertise Here</h2>
            <a href={`tel:${advertisePhone}`} className="mt-4 inline-flex min-h-11 items-center rounded-full bg-brand-dark px-6 font-semibold text-white shadow-card transition hover:bg-brand">
              {advertisePhone}
            </a>
          </div>
          <HeroPhone src="/phone-black.webp" alt="" delay="-2s" priority className="w-16 shrink-0 sm:w-24" />
        </div>
        <Suspense fallback={null}>
          <ProductBrowser products={products} />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
