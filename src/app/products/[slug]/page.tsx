import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { prisma } from "@/lib/db";
import {
  getProductBySlug,
  getRelatedProducts,
} from "@/lib/products";
import { getCurrentUser } from "@/lib/auth";
import { getSettings, shippingConfig } from "@/lib/settings";
import { ProductGallery } from "@/components/product/ProductGallery";
import { PurchasePanel } from "@/components/product/PurchasePanel";
import { ReviewSection } from "@/components/product/ReviewSection";
import { RecentlyViewed } from "@/components/product/RecentlyViewed";
import { ProductCard } from "@/components/shop/ProductCard";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };

  const description = product.description.slice(0, 158);
  return {
    title: product.name,
    description,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      type: "website",
      title: `${product.name} | Decoritu`,
      description,
      images: product.images.map((image) => ({ url: image })),
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | Decoritu`,
      description,
      images: [product.images[0]],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [product, user, settings] = await Promise.all([
    getProductBySlug(slug),
    getCurrentUser(),
    getSettings(),
  ]);
  if (!product) notFound();

  const shipping = shippingConfig(settings);
  const returnWindow = Number(settings.returnWindow) || 7;

  const [related, existingReview] = await Promise.all([
    getRelatedProducts(product.id, product.categoryId, 4),
    user
      ? prisma.review.findUnique({
          where: { productId_userId: { productId: product.id, userId: user.id } },
          select: { status: true },
        })
      : Promise.resolve(null),
  ]);

  const galleryImages = [
    ...product.images,
    ...product.variants.map((variant) => variant.image),
  ];

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images.map((image) => `${siteUrl}${image}`),
    description: product.description,
    sku: product.sku,
    brand: { "@type": "Brand", name: "Decoritu" },
    material: product.material,
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: (product.price / 100).toFixed(2),
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `${siteUrl}/products/${product.slug}`,
      seller: { "@type": "Organization", name: "Decoritu" },
    },
    ...(product.rating !== null && product.reviewCount > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: product.rating,
            reviewCount: product.reviewCount,
          },
        }
      : {}),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      {
        "@type": "ListItem",
        position: 2,
        name: product.categoryName,
        item: `${siteUrl}/collections/${product.categorySlug}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: `${siteUrl}/products/${product.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <section className="container-luxe pb-16 pt-6 md:pb-24 md:pt-8">
        <nav className="flex flex-wrap items-center gap-2 text-[0.62rem] uppercase tracking-[0.12em] text-muted" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-ink">Home</Link>
          <ChevronRight size={11} />
          <Link href={`/collections/${product.categorySlug}`} className="hover:text-ink">
            {product.categoryName}
          </Link>
          <ChevronRight size={11} />
          <span className="text-ink">{product.name}</span>
        </nav>

        <div className="mt-6 grid gap-10 lg:mt-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-12 xl:gap-20">
          <ProductGallery images={galleryImages} name={product.name} badge={product.badge} />
          <PurchasePanel product={product} shipping={shipping} returnWindow={returnWindow} />
        </div>
      </section>

      <section className="border-y border-line bg-cream">
        <div className="container-luxe grid items-center gap-10 py-14 md:grid-cols-2 md:gap-16 md:py-20">
          <div className="order-2 md:order-1">
            <p className="eyebrow text-muted">The considered detail</p>
            <h2 className="display mt-4 max-w-lg text-[2.5rem] leading-[0.98] sm:text-[3.2rem]">
              {product.story ?? "Made to be lived with, not just looked at."}
            </h2>
            <p className="mt-5 max-w-lg text-sm leading-7 text-muted">
              Every Decoritu piece is selected for the way it settles into a home over time — the
              texture it brings, the light it catches, the small daily comfort it offers.
            </p>
          </div>
          <div className="relative order-1 aspect-[5/3] overflow-hidden md:order-2">
            <Image
              src={product.images[1] ?? product.images[0]}
              alt={`${product.name} detail`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <ReviewSection
        product={product}
        currentUser={user ? { name: user.name, email: user.email } : null}
        existingStatus={existingReview?.status ?? null}
      />

      {related.length > 0 && (
        <section className="border-t border-line py-16 md:py-24">
          <div className="container-luxe">
            <SectionHeading
              eyebrow="Complete the room"
              title="You may also love."
              action="Shop the category"
              actionHref={`/collections/${product.categorySlug}`}
            />
            <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </div>
        </section>
      )}

      <RecentlyViewed product={product} />
    </>
  );
}
