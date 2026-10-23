import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import { Notice, PageHeader } from "@/components/admin/ui";
import { getProduct } from "@/lib/data";

export default async function EditProductPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ error?: string }> }) {
  const { id } = await params;
  const { error } = await searchParams;
  const product = getProduct(id);
  if (!product) notFound();
  return (
    <>
      <PageHeader title="Edit product" />
      <Notice error={error} />
      <ProductForm product={product} />
    </>
  );
}
