import Link from "next/link";
import type { CustomerRow } from "@/lib/data";
import { saveCustomerAction } from "@/app/admin/actions";
import { btnGhost, btnPrimary, inputClass, labelClass } from "./ui";

export default function CustomerForm({ customer }: { customer?: CustomerRow }) {
  return (
    <form action={saveCustomerAction} className="max-w-xl space-y-4 rounded-2xl border border-line bg-white p-6">
      {customer && <input type="hidden" name="id" value={customer.id} />}
      <label className={labelClass}>Name<input name="name" required maxLength={120} defaultValue={customer?.name} className={`${inputClass} mt-1`} /></label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={labelClass}>Email<input name="email" type="email" defaultValue={customer?.email} className={`${inputClass} mt-1`} /></label>
        <label className={labelClass}>Phone<input name="phone" defaultValue={customer?.phone} className={`${inputClass} mt-1`} /></label>
      </div>
      <label className={labelClass}>Address<textarea name="address" rows={3} defaultValue={customer?.address} className={`${inputClass} mt-1 py-2`} /></label>
      <div className="flex gap-3">
        <button type="submit" className={btnPrimary}>{customer ? "Save changes" : "Add customer"}</button>
        <Link href="/admin/customers" className={btnGhost}>Cancel</Link>
      </div>
    </form>
  );
}
