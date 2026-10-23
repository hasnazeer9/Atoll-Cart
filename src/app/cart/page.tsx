import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartList from "@/components/CartList";
import { listStoreProducts } from "@/lib/data";

export const metadata: Metadata = { title: "Your Cart (Preview)" };

export default function CartPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-3xl font-bold">Your Cart</h1>
        <CartList products={listStoreProducts()} />
      </main>
      <Footer />
    </>
  );
}
