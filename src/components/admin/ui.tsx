import Link from "next/link";
import type { OrderStatus } from "@/lib/data";

export const inputClass =
  "min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm focus:border-brand-dark focus:outline-none focus:ring-2 focus:ring-brand/40";
export const labelClass = "block text-sm font-medium";
export const btnPrimary =
  "inline-flex min-h-11 items-center justify-center rounded-lg bg-brand-dark px-5 text-sm font-semibold text-white transition hover:bg-brand";
export const btnGhost =
  "inline-flex min-h-11 items-center justify-center rounded-lg border border-gray-300 bg-white px-5 text-sm font-medium transition hover:border-brand-dark hover:text-brand-dark";

export function PageHeader({ title, action }: { title: string; action?: { href: string; label: string } }) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <h1 className="text-2xl font-bold">{title}</h1>
      {action && <Link href={action.href} className={btnPrimary}>{action.label}</Link>}
    </div>
  );
}

export function Notice({ error, saved }: { error?: string; saved?: string }) {
  if (error) return <p role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>;
  if (saved) return <p role="status" className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">Saved.</p>;
  return null;
}

const statusStyle: Record<OrderStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-gray-200 text-gray-700",
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusStyle[status]}`}>{status}</span>;
}

export const fmtDate = (ts: number) =>
  new Date(ts).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

export function Table({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-line bg-white">
      <table className="w-full min-w-[560px] text-left text-sm">{children}</table>
    </div>
  );
}
export const th = "px-4 py-3 text-xs font-semibold uppercase tracking-wide text-ink-muted";
export const td = "px-4 py-3 align-middle";
