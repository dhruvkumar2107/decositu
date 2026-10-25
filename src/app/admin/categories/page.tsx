import type { Metadata } from "next";
import Image from "next/image";
import { ChevronDown, Plus } from "lucide-react";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { AdminActionForm } from "@/components/admin/AdminActionForm";
import { createCategoryAction, toggleCategoryAction, updateCategoryAction } from "@/app/admin/actions";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Categories" };

export default async function AdminCategoriesPage() {
  await requireAdmin("/admin/categories");
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
        <div>
          <p className="eyebrow text-muted">Catalogue structure</p>
          <h1 className="display mt-3 text-5xl sm:text-6xl">Categories.</h1>
          <p className="mt-3 text-xs text-muted">{categories.length} categories</p>
        </div>
        <details className="relative">
          <summary className="btn btn-primary list-none">
            <Plus size={14} /> Add category
          </summary>
          <div className="absolute right-0 top-full z-20 mt-2 w-[min(92vw,480px)] border border-line bg-paper p-4 shadow-xl">
            <AdminActionForm action={createCategoryAction} submitLabel="Create category">
              <CategoryFields />
            </AdminActionForm>
          </div>
        </details>
      </div>

      <div className="mt-5 space-y-3">
        {categories.map((category) => (
          <details key={category.id} className="group border border-line bg-paper">
            <summary className="flex cursor-pointer list-none items-center gap-3 p-4 hover:bg-cream/30">
              <ChevronDown size={14} className="text-muted transition-transform group-open:rotate-180" />
              <div className="relative h-12 w-14 shrink-0 overflow-hidden bg-cream">
                <Image src={category.image} alt={category.name} fill sizes="56px" className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{category.name}</p>
                <p className="mt-0.5 text-[0.58rem] text-muted">/{category.slug} · {category._count.products} products · sort {category.sortOrder}</p>
              </div>
              <span className={cn("border px-2 py-1 text-[0.52rem] font-semibold uppercase tracking-[0.07em]", category.active ? "border-olive/30 bg-olive/8 text-olive" : "border-line text-muted")}>
                {category.active ? "Active" : "Hidden"}
              </span>
            </summary>

            <div className="border-t border-line bg-cream/20 p-5">
              <AdminActionForm action={updateCategoryAction} submitLabel="Save category">
                <input type="hidden" name="id" value={category.id} />
                <CategoryFields
                  category={{
                    name: category.name,
                    slug: category.slug,
                    description: category.description,
                    image: category.image,
                    sortOrder: category.sortOrder,
                    active: category.active,
                  }}
                />
              </AdminActionForm>
              <form action={toggleCategoryAction} className="mt-3">
                <input type="hidden" name="id" value={category.id} />
                <button type="submit" className="text-[0.6rem] font-semibold uppercase tracking-[0.08em] text-muted hover:text-wine">
                  {category.active ? "Hide category from storefront" : "Show category on storefront"}
                </button>
              </form>
            </div>
          </details>
        ))}
        {!categories.length && (
          <div className="border border-dashed border-line px-5 py-12 text-center text-xs text-muted">
            No categories yet. Use “Add category” to begin.
          </div>
        )}
      </div>
    </div>
  );
}

function CategoryFields({
  category,
}: {
  category?: {
    name: string;
    slug: string;
    description: string;
    image: string;
    sortOrder: number;
    active: boolean;
  };
}) {
  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="label">Name</label>
          <input name="name" required minLength={2} defaultValue={category?.name} className="input" />
        </div>
        <div>
          <label className="label">Slug</label>
          <input name="slug" required pattern="[a-z0-9-]+" defaultValue={category?.slug} placeholder="bedding" className="input" />
        </div>
      </div>
      <div>
        <label className="label">Description</label>
        <textarea name="description" required minLength={5} rows={2} defaultValue={category?.description} className="textarea resize-y" />
      </div>
      <div className="grid gap-3 sm:grid-cols-[1fr_120px]">
        <div>
          <label className="label">Image path</label>
          <input name="image" required defaultValue={category?.image} placeholder="/images/bedding-01.jpg" className="input" />
        </div>
        <div>
          <label className="label">Sort order</label>
          <input name="sortOrder" type="number" min="0" max="999" defaultValue={category?.sortOrder ?? 0} className="input" />
        </div>
      </div>
      <label className="flex items-center gap-2 text-xs">
        <input type="checkbox" name="active" defaultChecked={category?.active ?? true} className="h-3.5 w-3.5 accent-olive" />
        Active on storefront
      </label>
    </div>
  );
}
