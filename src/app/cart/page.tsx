import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = { title: "Cart — Coming Soon" };

export default function CartPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="text-3xl font-bold">Your cart is coming soon</h1>
        <p className="mt-3 text-ink-muted">Shopping isn&apos;t open yet, so there is nothing to add to a cart. Please check back after we launch.</p>
        <Link href="/" className="mt-6 inline-block rounded-full bg-brand-dark px-6 py-3 font-semibold text-white">Back to home</Link>
      </main>
      <Footer />
    </>
  );
}
