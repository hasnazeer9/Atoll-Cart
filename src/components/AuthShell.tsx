import Header from "./Header";
import Footer from "./Footer";

export default function AuthShell({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-md px-4 py-12">
        <h1 className="text-3xl font-bold">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-ink-muted">{subtitle}</p>}
        <div className="mt-6 space-y-4 rounded-2xl border border-line bg-white p-6 shadow-card">{children}</div>
      </main>
      <Footer />
    </>
  );
}

export const fieldClass =
  "mt-1 min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm focus:border-brand-dark focus:outline-none focus:ring-2 focus:ring-brand/40";
export const primaryBtn =
  "min-h-12 w-full rounded-full bg-brand-dark font-semibold text-white transition hover:bg-brand";

export function FormMessage({ error, saved }: { error?: string; saved?: string }) {
  if (error) return <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>;
  if (saved) return <p role="status" className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">Saved.</p>;
  return null;
}
