import CustomerForm from "@/components/admin/CustomerForm";
import { Notice, PageHeader } from "@/components/admin/ui";

export default async function NewCustomerPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return (<><PageHeader title="Add customer" /><Notice error={error} /><CustomerForm /></>);
}
