import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductBrowser from "@/components/ProductBrowser";

export const metadata: Metadata = { title: "All Products (Preview)" };

export default function ProductsPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-10">
        <h1 className="text-3xl font-bold">All Products</h1>
        <p className="mt-2 max-w-2xl text-ink-muted">
          Preview only — the products, prices and discounts below are illustrative samples. Nothing here can be
          bought yet, but the search and filters show how browsing will work.
        </p>
        <ProductBrowser />
      </main>
      <Footer />
    </>
  );
}
