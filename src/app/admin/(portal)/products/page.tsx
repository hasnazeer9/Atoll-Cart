import Image from "next/image";
import Link from "next/link";
import { listProducts, discountOf, LOW_STOCK } from "@/lib/data";
import { formatMVR } from "@/lib/utils";
import { deleteProductAction } from "../../actions";
import { Notice, PageHeader, Table, td, th } from "@/components/admin/ui";

export default async function ProductsAdminPage({ searchParams }: { searchParams: Promise<{ error?: string; saved?: string; q?: string }> }) {
  const { error, saved, q } = await searchParams;
  const needle = (q ?? "").trim().toLowerCase();
  const products = listProducts().filter((p) => !needle || `${p.name} ${p.category}`.toLowerCase().includes(needle));
  return (
    <>
      <PageHeader title="Products" action={{ href: "/admin/products/new", label: "Add product" }} />
      <Notice error={error} saved={saved} />
      <form className="mb-4 max-w-sm" role="search">
        <input name="q" defaultValue={q} placeholder="Search products…" aria-label="Search products" className="min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm" />
      </form>
      <Table>
        <thead><tr><th className={th}>Product</th><th className={th}>Category</th><th className={th}>Price</th><th className={th}>Stock</th><th className={th}>Status</th><th className={th}><span className="sr-only">Actions</span></th></tr></thead>
        <tbody className="divide-y divide-line">
          {products.map((p) => {
            const d = discountOf(p);
            return (
              <tr key={p.id}>
                <td className={td}>
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-surface">
                      {p.image && <Image src={p.image} alt="" fill unoptimized sizes="48px" className="object-cover" />}
                    </div>
                    <Link href={`/admin/products/${p.id}`} className="line-clamp-2 font-medium hover:text-brand-dark">{p.name}</Link>
                  </div>
                </td>
                <td className={td}>{p.category}</td>
                <td className={td}>{formatMVR(p.price)}{d > 0 && <span className="ml-1 text-xs text-brand-dark">-{d}%</span>}</td>
                <td className={`${td} font-semibold ${p.stock === 0 ? "text-red-600" : p.stock <= LOW_STOCK ? "text-amber-600" : ""}`}>{p.stock}</td>
                <td className={td}><span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${p.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-700"}`}>{p.status}</span></td>
                <td className={`${td} text-right`}>
                  <Link href={`/admin/products/${p.id}`} className="mr-3 text-brand-dark underline">Edit</Link>
                  <form action={deleteProductAction} className="inline">
                    <input type="hidden" name="id" value={p.id} />
                    <button type="submit" className="text-red-600 underline">Delete</button>
                  </form>
                </td>
              </tr>
            );
          })}
          {products.length === 0 && <tr><td colSpan={6} className={`${td} text-center text-ink-muted`}>No products found.</td></tr>}
        </tbody>
      </Table>
    </>
  );
}
