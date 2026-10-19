import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = { title: "Terms and Conditions (Draft)" };

export default function TermsPage() {
  return (
    <LegalPage title="Terms and Conditions">
      <p>This site is currently a &quot;coming soon&quot; page. No products can be bought and no orders are taken.</p>
      <h2 className="text-xl font-semibold text-ink">1. Use of this website</h2>
      <p>[Draft] Rules for using the website will be written here.</p>
      <h2 className="text-xl font-semibold text-ink">2. Products, pricing and GST</h2>
      <p>[Draft] Prices will be shown in MVR, with GST handling explained here. Sample cards on this page are illustrative only.</p>
      <h2 className="text-xl font-semibold text-ink">3. Orders, delivery and returns</h2>
      <p>[Draft] To be completed before launch.</p>
      <h2 className="text-xl font-semibold text-ink">4. Governing law</h2>
      <p>[Draft] To be completed before launch.</p>
    </LegalPage>
  );
}
