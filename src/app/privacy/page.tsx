import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = { title: "Privacy Policy (Draft)" };

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <p>[Placeholder] This policy will explain what personal information we collect and why.</p>
      <h2 className="text-xl font-semibold text-ink">Information we collect</h2>
      <p>The sign-up form on the coming-soon page is currently a frontend demo and does not store or send any information.</p>
      <h2 className="text-xl font-semibold text-ink">How information will be used</h2>
      <p>[Draft] Once a mailing list is connected, details will be used only for launch updates.</p>
      <h2 className="text-xl font-semibold text-ink">Your choices and contact</h2>
      <p>[Draft] To be completed before launch.</p>
    </LegalPage>
  );
}
