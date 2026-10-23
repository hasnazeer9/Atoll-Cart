import OrderForm from "@/components/admin/OrderForm";
import { Notice, PageHeader } from "@/components/admin/ui";
import { listCustomers, listProducts } from "@/lib/data";

export default async function NewOrderPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const products = listProducts().map((p) => ({ id: p.id, name: p.name, price: p.price, stock: p.stock }));
  const customers = listCustomers().map((c) => ({ id: c.id, name: c.name }));
  return (
    <>
      <PageHeader title="New order" />
      <Notice error={error} />
      <OrderForm products={products} customers={customers} />
    </>
  );
}
