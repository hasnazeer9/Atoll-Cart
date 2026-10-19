import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = { title: "Login — Coming Soon" };

export default function LoginPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="text-3xl font-bold">Customer accounts are coming soon</h1>
        <p className="mt-3 text-ink-muted">Login isn&apos;t available yet. Please check back after we launch.</p>
        <Link href="/" className="mt-6 inline-block rounded-full bg-brand-dark px-6 py-3 font-semibold text-white">Back to home</Link>
      </main>
      <Footer />
    </>
  );
}
