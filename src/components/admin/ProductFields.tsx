export type AdminProduct = {
  id: string;
  name: string;
  slug: string;
  sku: string;
  categoryId: string;
  description: string;
  story: string | null;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  images: string[];
  material: string;
  dimensions: string;
  care: string;
  badge: string | null;
  featured: boolean;
  newArrival: boolean;
  bestseller: boolean;
  active: boolean;
};

export function ProductFields({
  product,
  categories,
}: {
  product?: AdminProduct;
  categories: { id: string; name: string }[];
}) {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="product-name" className="label">Product name</label>
          <input
            id="product-name"
            name="name"
            required
            minLength={2}
            maxLength={140}
            defaultValue={product?.name}
            className="input"
          />
        </div>
        <div>
          <label htmlFor="product-slug" className="label">URL slug</label>
          <input
            id="product-slug"
            name="slug"
            required
            pattern="[a-z0-9-]+"
            maxLength={160}
            defaultValue={product?.slug}
            placeholder="linen-bedding-set"
            className="input"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="product-sku" className="label">Product SKU</label>
          <input
            id="product-sku"
            name="sku"
            required
            minLength={2}
            maxLength={60}
            defaultValue={product?.sku}
            className="input"
          />
        </div>
        <div>
          <label htmlFor="product-category" className="label">Category</label>
          <select
            id="product-category"
            name="categoryId"
            required
            defaultValue={product?.categoryId ?? ""}
            className="select"
          >
            <option value="" disabled>Choose a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="product-description" className="label">Description</label>
        <textarea
          id="product-description"
          name="description"
          required
          minLength={20}
          maxLength={4000}
          rows={4}
          defaultValue={product?.description}
          className="textarea resize-y"
        />
      </div>

      <div>
        <label htmlFor="product-story" className="label">
          Editorial line <span className="font-normal text-muted">(optional)</span>
        </label>
        <textarea
          id="product-story"
          name="story"
          maxLength={1000}
          rows={2}
          defaultValue={product?.story ?? ""}
          className="textarea resize-y"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="product-price" className="label">Price (₹)</label>
          <input
            id="product-price"
            name="price"
            type="number"
            min="1"
            step="0.01"
            required
            defaultValue={product ? (product.price / 100).toFixed(2) : ""}
            className="input"
          />
        </div>
        <div>
          <label htmlFor="product-compare" className="label">Compare at (₹)</label>
          <input
            id="product-compare"
            name="compareAtPrice"
            type="number"
            min="0"
            step="0.01"
            defaultValue={product?.compareAtPrice ? (product.compareAtPrice / 100).toFixed(2) : ""}
            className="input"
          />
        </div>
        {!product && (
          <div>
            <label htmlFor="product-stock" className="label">Initial stock</label>
            <input
              id="product-stock"
              name="stock"
              type="number"
              min="0"
              step="1"
              required
              defaultValue="0"
              className="input"
            />
          </div>
        )}
        {product && (
          <div>
            <label className="label">Current stock</label>
            <div className="input flex items-center bg-cream/50 text-muted">{product.stock} (managed by variants)</div>
          </div>
        )}
      </div>

      <div>
        <label htmlFor="product-images" className="label">Image paths or URLs</label>
        <textarea
          id="product-images"
          name="images"
          required
          rows={4}
          defaultValue={product?.images.join("\n") ?? ""}
          placeholder={"/images/bedding-01.jpg\n/images/bedding-02.jpg"}
          className="textarea resize-y font-mono text-xs"
        />
        <p className="mt-1.5 text-[0.6rem] leading-5 text-muted">
          One image per line. Use an existing path under <code>/images</code> or a full HTTPS image URL.
          The first image is the primary product image.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="product-material" className="label">Material</label>
          <input
            id="product-material"
            name="material"
            required
            minLength={2}
            maxLength={300}
            defaultValue={product?.material}
            className="input"
          />
        </div>
        <div>
          <label htmlFor="product-dimensions" className="label">Dimensions</label>
          <input
            id="product-dimensions"
            name="dimensions"
            required
            minLength={2}
            maxLength={300}
            defaultValue={product?.dimensions}
            className="input"
          />
        </div>
      </div>

      <div>
        <label htmlFor="product-care" className="label">Care instructions</label>
        <textarea
          id="product-care"
          name="care"
          required
          minLength={2}
          maxLength={1000}
          rows={2}
          defaultValue={product?.care}
          className="textarea resize-y"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="product-badge" className="label">
            Badge <span className="font-normal text-muted">(optional)</span>
          </label>
          <input
            id="product-badge"
            name="badge"
            maxLength={30}
            defaultValue={product?.badge ?? ""}
            placeholder="New"
            className="input"
          />
        </div>
        <div className="flex flex-wrap items-end gap-x-5 gap-y-2 pb-2">
          <label className="flex items-center gap-2 text-xs">
            <input type="checkbox" name="active" defaultChecked={product ? product.active : true} className="h-3.5 w-3.5 accent-olive" />
            Active
          </label>
          <label className="flex items-center gap-2 text-xs">
            <input type="checkbox" name="featured" defaultChecked={product?.featured ?? false} className="h-3.5 w-3.5 accent-olive" />
            Featured
          </label>
          <label className="flex items-center gap-2 text-xs">
            <input type="checkbox" name="newArrival" defaultChecked={product?.newArrival ?? false} className="h-3.5 w-3.5 accent-olive" />
            New
          </label>
          <label className="flex items-center gap-2 text-xs">
            <input type="checkbox" name="bestseller" defaultChecked={product?.bestseller ?? false} className="h-3.5 w-3.5 accent-olive" />
            Bestseller
          </label>
        </div>
      </div>

      {!product && (
        <div className="border border-line bg-cream/50 p-4">
          <p className="eyebrow text-muted">Initial variant</p>
          <p className="mt-1 text-[0.62rem] leading-5 text-muted">
            A product needs at least one variant. You can add more after creating it.
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <div>
              <label htmlFor="variant-size" className="label">Size</label>
              <input id="variant-size" name="size" required defaultValue="Standard" className="input" />
            </div>
            <div>
              <label htmlFor="variant-color" className="label">Colour</label>
              <input id="variant-color" name="color" required defaultValue="Natural" className="input" />
            </div>
            <div>
              <label htmlFor="variant-sku" className="label">
                Variant SKU <span className="font-normal text-muted">(auto)</span>
              </label>
              <input id="variant-sku" name="variantSku" className="input" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
