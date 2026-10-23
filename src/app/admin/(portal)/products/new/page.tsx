import ProductForm from "@/components/admin/ProductForm";
import { Notice, PageHeader } from "@/components/admin/ui";

export default async function NewProductPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return (
    <>
      <PageHeader title="Add product" />
      <Notice error={error} />
      <ProductForm />
    </>
  );
}
