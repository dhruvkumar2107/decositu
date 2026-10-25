import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { AdminActionForm } from "@/components/admin/AdminActionForm";
import { ProductFields } from "@/components/admin/ProductFields";
import { createProductAction } from "@/app/admin/actions";

export const metadata: Metadata = { title: "Add product" };

export default async function AdminNewProductPage() {
  await requireAdmin("/admin/products/new");
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div>
      <Link href="/admin/products" className="inline-flex items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-muted hover:text-ink">
        <ArrowLeft size={13} /> Back to products
      </Link>
      <div className="mt-5 border-b border-line pb-6">
        <p className="eyebrow text-muted">Catalogue</p>
        <h1 className="display mt-3 text-5xl sm:text-6xl">Add a product.</h1>
        <p className="mt-3 text-xs text-muted">
          Create the product and its first variant. Variant stock controls availability.
        </p>
      </div>

      {!categories.length ? (
        <div className="mt-6 border border-clay/25 bg-clay/5 p-5 text-xs leading-6 text-clay">
          Create a category before adding your first product.{" "}
          <Link href="/admin/categories" className="underline underline-offset-2">Go to categories</Link>.
        </div>
      ) : (
        <div className="mt-6 border border-line bg-paper p-5 sm:p-7">
          <AdminActionForm action={createProductAction} submitLabel="Create product">
            <ProductFields categories={categories} />
          </AdminActionForm>
        </div>
      )}
    </div>
  );
}
