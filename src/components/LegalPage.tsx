import Header from "./Header";
import Footer from "./Footer";

export default function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <p className="mb-4 rounded-xl border border-brand bg-brand-soft p-3 text-sm text-brand-dark">
          <strong>Draft:</strong> this content is a placeholder and must be reviewed and completed (ideally by a
          legal professional) before the shop launches.
        </p>
        <h1 className="mb-6 text-3xl font-bold">{title}</h1>
        <div className="space-y-4 text-ink-muted">{children}</div>
      </main>
      <Footer />
    </>
  );
}
