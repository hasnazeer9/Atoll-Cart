import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CheckoutForm from "@/components/CheckoutForm";
import { listStoreProducts } from "@/lib/data";
import { getSettings } from "@/lib/settings";
import { getAccount } from "@/lib/customer-auth";

export const metadata: Metadata = { title: "Checkout", robots: { index: false } };

export default async function CheckoutPage() {
  const s = getSettings();
  const account = await getAccount();
  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-3xl font-bold">Checkout</h1>
        <CheckoutForm products={listStoreProducts()} deliveryFee={s.deliveryFee} gstRate={s.gstRate} bankEnabled={Boolean(s.bankDetails)} account={account} />
      </main>
      <Footer />
    </>
  );
}
