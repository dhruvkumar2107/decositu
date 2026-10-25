import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ChevronDown, Eye, PackagePlus, Plus, Trash2 } from "lucide-react";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { formatPrice, parseImages } from "@/lib/utils";
import { AdminActionForm } from "@/components/admin/AdminActionForm";
import { ProductFields } from "@/components/admin/ProductFields";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import {
  addVariantAction,
  deleteVariantAction,
  updateProductAction,
  updateVariantAction,
} from "@/app/admin/actions";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Edit product" };

export default async function AdminEditProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string }>;
}) {
  await requireAdmin("/admin/products");
  const { id } = await params;
  const query = await searchParams;

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: {
        category: { select: { name: true, slug: true } },
        variants: { orderBy: [{ size: "asc" }, { color: "asc" }] },
      },
    }),
    prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
      select: { id: true, name: true },
    }),
  ]);
  if (!product) notFound();

  return (
    <div>
      <Link href="/admin/products" className="inline-flex items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-muted hover:text-ink">
        <ArrowLeft size={13} /> Back to products
      </Link>

      {query.created && (
        <div className="mt-5 border border-olive/25 bg-olive/5 px-4 py-3 text-xs text-olive">
          Product created. Add variants and review the details before publishing.
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
        <div>
          <p className="eyebrow text-muted">{product.category.name}</p>
          <h1 className="display mt-3 text-4xl sm:text-5xl">{product.name}</h1>
          <p className="mt-2 text-xs text-muted">
            {product.variants.length} variants · {product.stock} units · {product.sku}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn("border px-2.5 py-1.5 text-[0.55rem] font-semibold uppercase tracking-[0.08em]", product.active ? "border-olive/30 bg-olive/8 text-olive" : "border-line bg-cream text-muted")}>
            {product.active ? "Active" : "Hidden"}
          </span>
          <Link href={`/products/${product.slug}`} target="_blank" className="btn btn-outline">
            <Eye size={14} /> View
          </Link>
        </div>
      </div>

      <section className="mt-6 border border-line bg-paper p-5 sm:p-7">
        <p className="eyebrow text-muted">Product details</p>
        <div className="mt-5">
          <AdminActionForm action={updateProductAction} submitLabel="Save product">
            <input type="hidden" name="id" value={product.id} />
            <ProductFields
              categories={categories}
              product={{
                id: product.id,
                name: product.name,
                slug: product.slug,
                sku: product.sku,
                categoryId: product.categoryId,
                description: product.description,
                story: product.story,
                price: product.price,
                compareAtPrice: product.compareAtPrice,
                stock: product.stock,
                images: parseImages(product.images),
                material: product.material,
                dimensions: product.dimensions,
                care: product.care,
                badge: product.badge,
                featured: product.featured,
                newArrival: product.newArrival,
                bestseller: product.bestseller,
                active: product.active,
              }}
            />
          </AdminActionForm>
        </div>
      </section>

      <section className="mt-5 border border-line bg-paper">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
          <div>
            <p className="eyebrow text-muted">Variants & inventory</p>
            <p className="mt-1 text-[0.62rem] text-muted">Stock is calculated from active variants.</p>
          </div>
          <details className="relative">
            <summary className="btn btn-primary list-none">
              <Plus size={14} /> Add variant
            </summary>
            <div className="absolute right-0 top-full z-20 mt-2 w-[min(92vw,480px)] border border-line bg-paper p-4 shadow-xl">
              <AdminActionForm action={addVariantAction} submitLabel="Add variant">
                <input type="hidden" name="productId" value={product.id} />
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="label">Size</label>
                    <input name="size" required className="input" />
                  </div>
                  <div>
                    <label className="label">Colour</label>
                    <input name="color" required className="input" />
                  </div>
                  <div>
                    <label className="label">SKU</label>
                    <input name="sku" placeholder="Auto-generated" className="input" />
                  </div>
                  <div>
                    <label className="label">Stock</label>
                    <input name="stock" type="number" min="0" step="1" required defaultValue="0" className="input" />
                  </div>
                  <div>
                    <label className="label">Price (₹)</label>
                    <input name="price" type="number" min="1" step="0.01" defaultValue={(product.price / 100).toFixed(2)} className="input" />
                  </div>
                  <div>
                    <label className="label">Compare at (₹)</label>
                    <input name="compareAtPrice" type="number" min="0" step="0.01" className="input" />
                  </div>
                </div>
                <div className="mt-3">
                  <label className="label">Image path</label>
                  <input name="image" placeholder="/images/example.jpg" className="input" />
                </div>
              </AdminActionForm>
            </div>
          </details>
        </div>

        <div className="divide-y divide-line">
          {product.variants.map((variant) => (
            <details key={variant.id} className="group">
              <summary className="flex cursor-pointer list-none flex-wrap items-center gap-3 px-5 py-4 hover:bg-cream/30">
                <ChevronDown size={14} className="text-muted transition-transform group-open:rotate-180" />
                <div className="min-w-[120px] flex-1">
                  <p className="text-xs font-medium">{variant.size} · {variant.color}</p>
                  <p className="mt-0.5 text-[0.58rem] text-muted">{variant.sku}</p>
                </div>
                <p className="text-[0.62rem] text-muted">{formatPrice(variant.price)}</p>
                <p className={cn("w-16 text-right text-[0.65rem] font-semibold", variant.stock === 0 ? "text-wine" : variant.stock <= 5 ? "text-clay" : "")}>
                  {variant.stock} units
                </p>
                <span className={cn("border px-2 py-0.5 text-[0.5rem] font-semibold uppercase tracking-[0.06em]", variant.active ? "border-olive/25 bg-olive/5 text-olive" : "border-line text-muted")}>
                  {variant.active ? "Active" : "Hidden"}
                </span>
              </summary>

              <div className="bg-cream/25 px-5 pb-5 pl-12">
                <AdminActionForm action={updateVariantAction} submitLabel="Save variant" buttonClassName="mt-4">
                  <input type="hidden" name="id" value={variant.id} />
                  <input type="hidden" name="productId" value={product.id} />
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div>
                      <label className="label">Size</label>
                      <input name="size" required defaultValue={variant.size} className="input" />
                    </div>
                    <div>
                      <label className="label">Colour</label>
                      <input name="color" required defaultValue={variant.color} className="input" />
                    </div>
                    <div>
                      <label className="label">SKU</label>
                      <input name="sku" required defaultValue={variant.sku} className="input" />
                    </div>
                    <div>
                      <label className="label">Price (₹)</label>
                      <input name="price" type="number" min="1" step="0.01" required defaultValue={(variant.price / 100).toFixed(2)} className="input" />
                    </div>
                    <div>
                      <label className="label">Compare at (₹)</label>
                      <input name="compareAtPrice" type="number" min="0" step="0.01" defaultValue={variant.compareAtPrice ? (variant.compareAtPrice / 100).toFixed(2) : ""} className="input" />
                    </div>
                    <div>
                      <label className="label">Stock</label>
                      <input name="stock" type="number" min="0" step="1" required defaultValue={variant.stock} className="input" />
                    </div>
                  </div>
                  <div className="mt-3">
                    <label className="label">Image path</label>
                    <input name="image" defaultValue={variant.image ?? ""} className="input" />
                  </div>
                  <label className="mt-3 flex items-center gap-2 text-xs">
                    <input type="checkbox" name="active" defaultChecked={variant.active} className="h-3.5 w-3.5 accent-olive" />
                    Variant is active and purchasable
                  </label>
                </AdminActionForm>

                <form action={deleteVariantAction} className="mt-2">
                  <input type="hidden" name="id" value={variant.id} />
                  <input type="hidden" name="productId" value={product.id} />
                  <ConfirmButton
                    message={`Delete variant ${variant.size} / ${variant.color}? Past order items keep their snapshot.`}
                    className="inline-flex items-center gap-1.5 text-[0.58rem] font-semibold uppercase tracking-[0.08em] text-muted hover:text-wine"
                  >
                    <Trash2 size={12} /> Delete variant
                  </ConfirmButton>
                </form>
              </div>
            </details>
          ))}
        </div>

        {!product.variants.length && (
          <div className="px-5 py-10 text-center text-xs text-muted">
            <PackagePlus size={22} className="mx-auto text-muted" />
            <p className="mt-2">No variants yet. Add one to make this product purchasable.</p>
          </div>
        )}
      </section>
    </div>
  );
}
