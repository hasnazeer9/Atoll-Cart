import { notFound } from "next/navigation";
import CustomerForm from "@/components/admin/CustomerForm";
import { Notice, PageHeader } from "@/components/admin/ui";
import { getCustomer } from "@/lib/data";

export default async function EditCustomerPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ error?: string }> }) {
  const { id } = await params;
  const { error } = await searchParams;
  const customer = getCustomer(Number(id));
  if (!customer) notFound();
  return (<><PageHeader title="Edit customer" /><Notice error={error} /><CustomerForm customer={customer} /></>);
}
