import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Eye, Plus, Search } from "lucide-react";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { formatPrice, parseImages } from "@/lib/utils";
import { toggleProductAction } from "@/app/admin/actions";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Products" };

const PAGE_SIZE = 20;

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; status?: string; page?: string }>;
}) {
  await requireAdmin("/admin/products");
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q.trim() : "";
  const category = typeof params.category === "string" ? params.category : "";
  const status = typeof params.status === "string" ? params.status : "";
  const requestedPage = Math.max(Number(params.page) || 1, 1);

  const where = {
    ...(query
      ? {
          OR: [
            { name: { contains: query } },
            { sku: { contains: query } },
            { slug: { contains: query } },
          ],
        }
      : {}),
    ...(category ? { categoryId: category } : {}),
    ...(status === "active" ? { active: true } : {}),
    ...(status === "inactive" ? { active: false } : {}),
  };

  const [total, products, categories] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip: (requestedPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: {
        category: { select: { name: true } },
        _count: { select: { variants: true, orderItems: true } },
      },
    }),
    prisma.category.findMany({ orderBy: { sortOrder: "asc" }, select: { id: true, name: true } }),
  ]);
  const pages = Math.max(Math.ceil(total / PAGE_SIZE), 1);
  const page = Math.min(requestedPage, pages);

  function pageHref(nextPage: number) {
    const search = new URLSearchParams();
    if (query) search.set("q", query);
    if (category) search.set("category", category);
    if (status) search.set("status", status);
    if (nextPage > 1) search.set("page", String(nextPage));
    return `/admin/products${search.size ? `?${search.toString()}` : ""}`;
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
        <div>
          <p className="eyebrow text-muted">Catalogue</p>
          <h1 className="display mt-3 text-5xl sm:text-6xl">Products.</h1>
          <p className="mt-3 text-xs text-muted">{total} {total === 1 ? "product" : "products"} in this view</p>
        </div>
        <Link href="/admin/products/new" className="btn btn-primary">
          <Plus size={14} /> Add product
        </Link>
      </div>

      <form method="get" className="mt-5 flex flex-wrap items-end gap-2.5">
        <div className="min-w-[200px] flex-1">
          <label htmlFor="product-search" className="label">Search</label>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              id="product-search"
              name="q"
              defaultValue={query}
              placeholder="Name, slug or SKU"
              className="input pl-9"
            />
          </div>
        </div>
        <div>
          <label htmlFor="product-category" className="label">Category</label>
          <select id="product-category" name="category" defaultValue={category} className="select min-w-[155px]">
            <option value="">All categories</option>
            {categories.map((entry) => (
              <option key={entry.id} value={entry.id}>{entry.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="product-status" className="label">Status</label>
          <select id="product-status" name="status" defaultValue={status} className="select min-w-[130px]">
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <button type="submit" className="btn btn-outline h-[46px] min-h-[46px]">Filter</button>
        {(query || category || status) && (
          <Link href="/admin/products" className="text-[0.62rem] font-semibold uppercase tracking-[0.09em] text-muted hover:text-ink">
            Clear
          </Link>
        )}
      </form>

      <div className="mt-5 overflow-x-auto border border-line bg-paper">
        <table className="w-full min-w-[850px] text-left text-xs">
          <thead className="border-b border-line bg-cream/60 text-[0.56rem] uppercase tracking-[0.1em] text-muted">
            <tr>
              <th className="px-4 py-3 font-semibold">Product</th>
              <th className="px-4 py-3 font-semibold">Category</th>
              <th className="px-4 py-3 font-semibold">Price</th>
              <th className="px-4 py-3 font-semibold">Stock</th>
              <th className="px-4 py-3 font-semibold">Variants</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {products.length ? (
              products.map((product) => {
                const image = parseImages(product.images)[0] ?? "/images/bedding-01.jpg";
                return (
                  <tr key={product.id} className="transition-colors hover:bg-cream/30">
                    <td className="px-4 py-3">
                      <Link href={`/admin/products/${product.id}`} className="flex items-center gap-3">
                        <div className="relative h-14 w-11 shrink-0 overflow-hidden bg-cream">
                          <Image src={image} alt={product.name} fill sizes="44px" className="object-cover" />
                        </div>
                        <div>
                          <p className="font-medium leading-5">{product.name}</p>
                          <p className="mt-0.5 text-[0.58rem] text-muted">{product.sku}</p>
                        </div>
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-[0.65rem] text-muted">{product.category.name}</td>
                    <td className="whitespace-nowrap px-4 py-3">{formatPrice(product.price)}</td>
                    <td className="px-4 py-3">
                      <span className={cn(product.stock === 0 ? "text-wine" : product.stock <= 10 ? "text-clay" : "")}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[0.65rem] text-muted">{product._count.variants}</td>
                    <td className="px-4 py-3">
                      <span className={cn("border px-2 py-1 text-[0.52rem] font-semibold uppercase tracking-[0.07em]", product.active ? "border-olive/30 bg-olive/8 text-olive" : "border-line bg-cream text-muted")}>
                        {product.active ? "Active" : "Hidden"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-3 text-[0.58rem] font-semibold uppercase tracking-[0.07em]">
                        <Link href={`/admin/products/${product.id}`} className="text-olive hover:text-ink">Edit</Link>
                        <Link href={`/products/${product.slug}`} target="_blank" className="text-muted hover:text-ink" aria-label="View product">
                          <Eye size={13} />
                        </Link>
                        <form action={toggleProductAction}>
                          <input type="hidden" name="id" value={product.id} />
                          <button type="submit" className="text-muted hover:text-wine">
                            {product.active ? "Hide" : "Show"}
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-muted">No products match this view.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div className="mt-4 flex items-center justify-between text-[0.65rem]">
          <span className="text-muted">Page {page} of {pages}</span>
          <div className="flex gap-2">
            {page > 1 && <Link href={pageHref(page - 1)} className="border border-line px-3 py-2 hover:bg-cream">Previous</Link>}
            {page < pages && <Link href={pageHref(page + 1)} className="border border-line px-3 py-2 hover:bg-cream">Next</Link>}
          </div>
        </div>
      )}
    </div>
  );
}
