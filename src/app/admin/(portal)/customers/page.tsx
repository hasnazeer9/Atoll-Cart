import Link from "next/link";
import { listCustomers } from "@/lib/data";
import { deleteCustomerAction } from "../../actions";
import { Notice, PageHeader, Table, fmtDate, td, th } from "@/components/admin/ui";

export default async function CustomersPage({ searchParams }: { searchParams: Promise<{ saved?: string; error?: string }> }) {
  const { saved, error } = await searchParams;
  const customers = listCustomers();
  return (
    <>
      <PageHeader title="Customers" action={{ href: "/admin/customers/new", label: "Add customer" }} />
      <Notice error={error} saved={saved} />
      <Table>
        <thead><tr><th className={th}>Name</th><th className={th}>Contact</th><th className={th}>Orders</th><th className={th}>Added</th><th className={th}><span className="sr-only">Actions</span></th></tr></thead>
        <tbody className="divide-y divide-line">
          {customers.map((c) => (
            <tr key={c.id}>
              <td className={td}><Link href={`/admin/customers/${c.id}`} className="font-medium hover:text-brand-dark">{c.name}</Link></td>
              <td className={td}>{c.email || "—"}<span className="block text-xs text-ink-muted">{c.phone}</span></td>
              <td className={td}>{c.orders}</td>
              <td className={td}>{fmtDate(c.created_at)}</td>
              <td className={`${td} text-right`}>
                <Link href={`/admin/customers/${c.id}`} className="mr-3 text-brand-dark underline">Edit</Link>
                <form action={deleteCustomerAction} className="inline"><input type="hidden" name="id" value={c.id} /><button type="submit" className="text-red-600 underline">Delete</button></form>
              </td>
            </tr>
          ))}
          {customers.length === 0 && <tr><td colSpan={5} className={`${td} text-center text-ink-muted`}>No customers yet.</td></tr>}
        </tbody>
      </Table>
    </>
  );
}
