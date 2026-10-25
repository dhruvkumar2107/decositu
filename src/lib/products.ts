import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { discountPercent, parseImages } from "@/lib/utils";

const cardInclude = {
  category: true,
  variants: {
    where: { active: true },
    orderBy: { createdAt: "asc" as const },
  },
  reviews: {
    where: { status: "APPROVED" },
    select: { rating: true },
  },
} satisfies Prisma.ProductInclude;

type CardProduct = Prisma.ProductGetPayload<{ include: typeof cardInclude }>;

export type ProductCardData = {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice: number | null;
  discount: number;
  image: string;
  hoverImage: string;
  categoryName: string;
  categorySlug: string;
  badge: string | null;
  colors: string[];
  sizes: string[];
  inStock: boolean;
  isNew: boolean;
  isBestseller: boolean;
  rating: number | null;
  reviewCount: number;
  createdAt: string;
  defaultVariant: {
    id: string;
    size: string;
    color: string;
    price: number;
    sku: string;
    stock: number;
    image: string;
  } | null;
};

export type ProductDetailData = {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  story: string | null;
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  price: number;
  compareAtPrice: number | null;
  discount: number;
  images: string[];
  material: string;
  dimensions: string;
  care: string;
  badge: string | null;
  inStock: boolean;
  isNew: boolean;
  rating: number | null;
  reviewCount: number;
  variants: {
    id: string;
    sku: string;
    size: string;
    color: string;
    price: number;
    compareAtPrice: number | null;
    stock: number;
    image: string;
  }[];
  reviews: {
    id: string;
    rating: number;
    title: string | null;
    body: string;
    createdAt: string;
    userName: string;
  }[];
};

function averageRating(reviews: { rating: number }[]) {
  if (!reviews.length) return null;
  return Number((reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1));
}

export function mapProductCard(product: CardProduct): ProductCardData {
  const images = parseImages(product.images);
  const activeVariants = product.variants.filter((variant) => variant.stock > 0);
  const defaultVariant = activeVariants[0] ?? product.variants[0] ?? null;
  const lowestVariant = product.variants.length
    ? [...product.variants].sort((a, b) => a.price - b.price)[0]
    : null;
  const price = lowestVariant?.price ?? product.price;
  const compareAtPrice = lowestVariant?.compareAtPrice ?? product.compareAtPrice;

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    price,
    compareAtPrice,
    discount: discountPercent(price, compareAtPrice),
    image: images[0] ?? defaultVariant?.image ?? "/images/bedding-01.jpg",
    hoverImage: images[1] ?? images[0] ?? defaultVariant?.image ?? "/images/bedding-02.jpg",
    categoryName: product.category.name,
    categorySlug: product.category.slug,
    badge: product.badge,
    colors: [...new Set(product.variants.map((variant) => variant.color))],
    sizes: [...new Set(product.variants.map((variant) => variant.size))],
    inStock: product.variants.some((variant) => variant.stock > 0),
    isNew: product.newArrival,
    isBestseller: product.bestseller,
    rating: averageRating(product.reviews),
    reviewCount: product.reviews.length,
    createdAt: product.createdAt.toISOString(),
    defaultVariant: defaultVariant
      ? {
          id: defaultVariant.id,
          size: defaultVariant.size,
          color: defaultVariant.color,
          price: defaultVariant.price,
          sku: defaultVariant.sku,
          stock: defaultVariant.stock,
          image: defaultVariant.image ?? images[0] ?? "/images/bedding-01.jpg",
        }
      : null,
  };
}

export async function getCategories() {
  return prisma.category.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getProductCards(options?: {
  where?: Prisma.ProductWhereInput;
  orderBy?: Prisma.ProductOrderByWithRelationInput | Prisma.ProductOrderByWithRelationInput[];
  take?: number;
  skip?: number;
}) {
  const products = await prisma.product.findMany({
    where: { active: true, ...options?.where },
    include: cardInclude,
    orderBy: options?.orderBy ?? [{ bestseller: "desc" }, { sortOrder: "asc" }],
    take: options?.take,
    skip: options?.skip,
  });

  return products.map(mapProductCard);
}

export async function getFeaturedProducts(take = 4) {
  return getProductCards({
    where: { OR: [{ featured: true }, { bestseller: true }] },
    orderBy: [{ bestseller: "desc" }, { sortOrder: "asc" }],
    take,
  });
}

export async function getNewArrivals(take = 4) {
  return getProductCards({
    where: { newArrival: true },
    orderBy: { createdAt: "desc" },
    take,
  });
}

export async function getBestsellers(take = 4) {
  return getProductCards({
    where: { bestseller: true },
    orderBy: { sortOrder: "asc" },
    take,
  });
}

export async function getProductsByCategorySlug(slug: string, take = 4) {
  return getProductCards({
    where: { category: { slug } },
    orderBy: [{ featured: "desc" }, { sortOrder: "asc" }],
    take,
  });
}

export async function searchProducts(query: string, take = 6) {
  const trimmed = query.trim();
  if (!trimmed) return [];

  return getProductCards({
    where: {
      OR: [
        { name: { contains: trimmed } },
        { description: { contains: trimmed } },
        { sku: { contains: trimmed } },
        { category: { name: { contains: trimmed } } },
      ],
    },
    orderBy: [{ bestseller: "desc" }, { sortOrder: "asc" }],
    take,
  });
}

export async function getProductBySlug(slug: string): Promise<ProductDetailData | null> {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      variants: {
        where: { active: true },
        orderBy: { createdAt: "asc" },
      },
      reviews: {
        where: { status: "APPROVED" },
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!product || !product.active) return null;

  const images = parseImages(product.images);
  const lowest = product.variants.length
    ? [...product.variants].sort((a, b) => a.price - b.price)[0]
    : null;

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    sku: product.sku,
    description: product.description,
    story: product.story,
    categoryId: product.categoryId,
    categoryName: product.category.name,
    categorySlug: product.category.slug,
    price: lowest?.price ?? product.price,
    compareAtPrice: lowest?.compareAtPrice ?? product.compareAtPrice,
    discount: discountPercent(lowest?.price ?? product.price, lowest?.compareAtPrice ?? product.compareAtPrice),
    images,
    material: product.material,
    dimensions: product.dimensions,
    care: product.care,
    badge: product.badge,
    inStock: product.variants.some((variant) => variant.stock > 0),
    isNew: product.newArrival,
    rating: averageRating(product.reviews),
    reviewCount: product.reviews.length,
    variants: product.variants.map((variant) => ({
      id: variant.id,
      sku: variant.sku,
      size: variant.size,
      color: variant.color,
      price: variant.price,
      compareAtPrice: variant.compareAtPrice,
      stock: variant.stock,
      image: variant.image ?? images[0] ?? "/images/bedding-01.jpg",
    })),
    reviews: product.reviews.map((review) => ({
      id: review.id,
      rating: review.rating,
      title: review.title,
      body: review.body,
      createdAt: review.createdAt.toISOString(),
      userName: review.user.name,
    })),
  };
}

export async function getRelatedProducts(productId: string, categoryId: string, take = 4) {
  const products = await prisma.product.findMany({
    where: {
      active: true,
      categoryId,
      id: { not: productId },
    },
    include: cardInclude,
    orderBy: [{ featured: "desc" }, { sortOrder: "asc" }],
    take,
  });

  return products.map(mapProductCard);
}

export async function getCategoryById(id: string) {
  return prisma.category.findUnique({ where: { id } });
}

export type CollectionData = {
  title: string;
  slug: string;
  description: string;
  image: string;
  products: ProductCardData[];
  isCategory: boolean;
};

export async function getCollection(slug: string): Promise<CollectionData | null> {
  if (slug === "new-arrivals") {
    return {
      title: "New Arrivals",
      slug,
      description: "The latest additions to the Decoritu edit, chosen for the season ahead.",
      image: "/images/bedding-02.jpg",
      products: await getProductCards({
        where: { newArrival: true },
        orderBy: { createdAt: "desc" },
      }),
      isCategory: false,
    };
  }

  if (slug === "bestsellers") {
    return {
      title: "Bestsellers",
      slug,
      description: "The pieces our customers return to, again and again.",
      image: "/images/dohar-02.jpg",
      products: await getProductCards({
        where: { bestseller: true },
        orderBy: { sortOrder: "asc" },
      }),
      isCategory: false,
    };
  }

  if (slug === "sale") {
    return {
      title: "The Quiet Sale",
      slug,
      description: "Considered pieces at a softer price. Limited quantities, no noise.",
      image: "/images/curtains-03.jpg",
      products: await getProductCards({
        where: { compareAtPrice: { not: null } },
        orderBy: { updatedAt: "desc" },
      }),
      isCategory: false,
    };
  }

  const category = await prisma.category.findUnique({ where: { slug, active: true } });
  if (!category) return null;

  return {
    title: category.name,
    slug: category.slug,
    description: category.description,
    image: category.image,
    products: await getProductCards({
      where: { categoryId: category.id },
      orderBy: [{ featured: "desc" }, { sortOrder: "asc" }],
    }),
    isCategory: true,
  };
}

export async function getRelatedCategoryId(slug: string) {
  const category = await prisma.category.findUnique({ where: { slug }, select: { id: true } });
  return category?.id ?? null;
}
