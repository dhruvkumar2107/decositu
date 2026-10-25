"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ZodError } from "zod";
import { prisma } from "@/lib/db";
import { assertAdmin } from "@/lib/auth";
import {
  categorySchema,
  couponSchema,
  productSchema,
} from "@/lib/validators";
import type { ActionState } from "@/lib/action-state";
import { slugify } from "@/lib/utils";

function field(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function checked(formData: FormData, key: string) {
  return formData.get(key) === "on" || formData.get(key) === "true";
}

function rupees(value: string) {
  if (!value) return null;
  const number = Number(value);
  if (!Number.isFinite(number)) return Number.NaN;
  return Math.round(number * 100);
}

function imageList(value: string) {
  return [...new Set(value.split(/[\n,]+/).map((item) => item.trim()).filter(Boolean))];
}

function fail(error: unknown, fallback: string): ActionState {
  if (error instanceof ZodError) {
    return { status: "error", message: error.issues[0]?.message || fallback };
  }
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return { status: "error", message: "That slug, SKU or code is already in use." };
    }
    if (error.code === "P2003") {
      return { status: "error", message: "A linked record could not be found." };
    }
  }
  console.error(fallback, error);
  return { status: "error", message: fallback };
}

function refreshStorefront() {
  revalidatePath("/", "layout");
}

async function syncProductStock(productId: string) {
  const aggregate = await prisma.productVariant.aggregate({
    where: { productId, active: true },
    _sum: { stock: true },
  });
  await prisma.product.update({
    where: { id: productId },
    data: { stock: aggregate._sum.stock ?? 0 },
  });
}

export async function createProductAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await assertAdmin();
  const images = imageList(field(formData, "images"));
  const stock = Number(field(formData, "stock"));
  let productId = "";

  try {
    const parsed = productSchema.parse({
      name: field(formData, "name"),
      slug: field(formData, "slug"),
      sku: field(formData, "sku"),
      categoryId: field(formData, "categoryId"),
      description: field(formData, "description"),
      story: field(formData, "story"),
      price: rupees(field(formData, "price")),
      compareAtPrice: rupees(field(formData, "compareAtPrice")),
      stock,
      images: JSON.stringify(images),
      material: field(formData, "material"),
      dimensions: field(formData, "dimensions"),
      care: field(formData, "care"),
      badge: field(formData, "badge"),
      featured: checked(formData, "featured"),
      newArrival: checked(formData, "newArrival"),
      bestseller: checked(formData, "bestseller"),
      active: checked(formData, "active"),
    });

    if (!images.length) throw new Error("Add at least one image path.");
    if (!Number.isInteger(stock) || stock < 0) throw new Error("Enter a valid stock quantity.");

    const size = field(formData, "size") || "Standard";
    const color = field(formData, "color") || "Natural";
    const variantSku =
      field(formData, "variantSku") ||
      `${parsed.sku}-${slugify(size).toUpperCase()}-${slugify(color).toUpperCase()}`;

    const product = await prisma.$transaction(async (tx) => {
      const created = await tx.product.create({
        data: {
          name: parsed.name,
          slug: parsed.slug,
          sku: parsed.sku,
          categoryId: parsed.categoryId,
          description: parsed.description,
          story: parsed.story || null,
          price: parsed.price,
          compareAtPrice: parsed.compareAtPrice ?? null,
          stock: parsed.stock,
          images: parsed.images,
          material: parsed.material,
          dimensions: parsed.dimensions,
          care: parsed.care,
          badge: parsed.badge || null,
          featured: parsed.featured,
          newArrival: parsed.newArrival,
          bestseller: parsed.bestseller,
          active: parsed.active,
        },
      });

      await tx.productVariant.create({
        data: {
          productId: created.id,
          sku: variantSku,
          size,
          color,
          price: parsed.price,
          compareAtPrice: parsed.compareAtPrice ?? null,
          stock: parsed.stock,
          image: images[0],
        },
      });

      return created;
    });

    productId = product.id;
  } catch (error) {
    return fail(error, "Unable to create the product.");
  }

  refreshStorefront();
  revalidatePath("/admin/products");
  redirect(`/admin/products/${productId}?created=1`);
}

export async function updateProductAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await assertAdmin();
  const id = field(formData, "id");
  const images = imageList(field(formData, "images"));

  try {
    const stock = await prisma.productVariant.aggregate({
      where: { productId: id, active: true },
      _sum: { stock: true },
    });
    const parsed = productSchema.parse({
      name: field(formData, "name"),
      slug: field(formData, "slug"),
      sku: field(formData, "sku"),
      categoryId: field(formData, "categoryId"),
      description: field(formData, "description"),
      story: field(formData, "story"),
      price: rupees(field(formData, "price")),
      compareAtPrice: rupees(field(formData, "compareAtPrice")),
      stock: stock._sum.stock ?? 0,
      images: JSON.stringify(images),
      material: field(formData, "material"),
      dimensions: field(formData, "dimensions"),
      care: field(formData, "care"),
      badge: field(formData, "badge"),
      featured: checked(formData, "featured"),
      newArrival: checked(formData, "newArrival"),
      bestseller: checked(formData, "bestseller"),
      active: checked(formData, "active"),
    });

    if (!images.length) throw new Error("Add at least one image path.");

    await prisma.product.update({
      where: { id },
      data: {
        name: parsed.name,
        slug: parsed.slug,
        sku: parsed.sku,
        categoryId: parsed.categoryId,
        description: parsed.description,
        story: parsed.story || null,
        price: parsed.price,
        compareAtPrice: parsed.compareAtPrice ?? null,
        stock: parsed.stock,
        images: parsed.images,
        material: parsed.material,
        dimensions: parsed.dimensions,
        care: parsed.care,
        badge: parsed.badge || null,
        featured: parsed.featured,
        newArrival: parsed.newArrival,
        bestseller: parsed.bestseller,
        active: parsed.active,
      },
    });

    refreshStorefront();
    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${id}`);
    return { status: "success", message: "Product saved." };
  } catch (error) {
    return fail(error, "Unable to save the product.");
  }
}

export async function addVariantAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await assertAdmin();
  const productId = field(formData, "productId");

  try {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new Error("Product not found.");
    const size = field(formData, "size");
    const color = field(formData, "color");
    const stock = Number(field(formData, "stock"));
    const price = rupees(field(formData, "price")) ?? product.price;
    if (!size || !color) throw new Error("Enter both size and colour.");
    if (!Number.isInteger(stock) || stock < 0) throw new Error("Enter a valid stock quantity.");
    const sku =
      field(formData, "sku") ||
      `${product.sku}-${slugify(size).toUpperCase()}-${slugify(color).toUpperCase()}`;

    await prisma.productVariant.create({
      data: {
        productId,
        sku,
        size,
        color,
        price,
        compareAtPrice: rupees(field(formData, "compareAtPrice")),
        stock,
        image: field(formData, "image") || imageList(product.images)[0] || null,
      },
    });
    await syncProductStock(productId);
    refreshStorefront();
    revalidatePath(`/admin/products/${productId}`);
    return { status: "success", message: "Variant added." };
  } catch (error) {
    return fail(error, "Unable to add the variant.");
  }
}

export async function updateVariantAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await assertAdmin();
  const id = field(formData, "id");
  const productId = field(formData, "productId");

  try {
    const variant = await prisma.productVariant.findUnique({ where: { id } });
    if (!variant || variant.productId !== productId) throw new Error("Variant not found.");
    const stock = Number(field(formData, "stock"));
    if (!Number.isInteger(stock) || stock < 0) throw new Error("Enter a valid stock quantity.");

    await prisma.productVariant.update({
      where: { id },
      data: {
        sku: field(formData, "sku") || variant.sku,
        size: field(formData, "size") || variant.size,
        color: field(formData, "color") || variant.color,
        price: rupees(field(formData, "price")) ?? variant.price,
        compareAtPrice: rupees(field(formData, "compareAtPrice")),
        stock,
        image: field(formData, "image") || null,
        active: checked(formData, "active"),
      },
    });
    await syncProductStock(productId);
    refreshStorefront();
    revalidatePath(`/admin/products/${productId}`);
    return { status: "success", message: "Variant updated." };
  } catch (error) {
    return fail(error, "Unable to update the variant.");
  }
}

export async function deleteVariantAction(formData: FormData) {
  await assertAdmin();
  const id = field(formData, "id");
  const productId = field(formData, "productId");
  try {
    const count = await prisma.productVariant.count({ where: { productId } });
    if (count <= 1) return;
    await prisma.productVariant.delete({ where: { id } });
    await syncProductStock(productId);
    refreshStorefront();
    revalidatePath(`/admin/products/${productId}`);
  } catch (error) {
    console.error("Variant delete failed", error);
  }
}

export async function toggleProductAction(formData: FormData) {
  await assertAdmin();
  const id = field(formData, "id");
  try {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return;
    await prisma.product.update({ where: { id }, data: { active: !product.active } });
    refreshStorefront();
    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${id}`);
  } catch (error) {
    console.error("Product toggle failed", error);
  }
}

export async function createCategoryAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await assertAdmin();
  try {
    const parsed = categorySchema.parse({
      name: field(formData, "name"),
      slug: field(formData, "slug"),
      description: field(formData, "description"),
      image: field(formData, "image"),
      sortOrder: field(formData, "sortOrder") || 0,
    });
    await prisma.category.create({ data: parsed });
    refreshStorefront();
    revalidatePath("/admin/categories");
    return { status: "success", message: "Category created." };
  } catch (error) {
    return fail(error, "Unable to create the category.");
  }
}

export async function updateCategoryAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await assertAdmin();
  const id = field(formData, "id");
  try {
    const parsed = categorySchema.parse({
      name: field(formData, "name"),
      slug: field(formData, "slug"),
      description: field(formData, "description"),
      image: field(formData, "image"),
      sortOrder: field(formData, "sortOrder") || 0,
    });
    await prisma.category.update({
      where: { id },
      data: { ...parsed, active: checked(formData, "active") },
    });
    refreshStorefront();
    revalidatePath("/admin/categories");
    return { status: "success", message: "Category saved." };
  } catch (error) {
    return fail(error, "Unable to save the category.");
  }
}

export async function toggleCategoryAction(formData: FormData) {
  await assertAdmin();
  const id = field(formData, "id");
  try {
    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) return;
    await prisma.category.update({ where: { id }, data: { active: !category.active } });
    refreshStorefront();
    revalidatePath("/admin/categories");
  } catch (error) {
    console.error("Category toggle failed", error);
  }
}

function couponData(formData: FormData) {
  const type = field(formData, "type") === "FIXED" ? "FIXED" : "PERCENT";
  const rawValue = Number(field(formData, "value"));
  const value = type === "FIXED" ? Math.round(rawValue * 100) : rawValue;
  return couponSchema.parse({
    code: field(formData, "code"),
    description: field(formData, "description"),
    type,
    value,
    minSubtotal: rupees(field(formData, "minSubtotal")) ?? 0,
    maxDiscount: rupees(field(formData, "maxDiscount")),
    usageLimit: field(formData, "usageLimit") ? Number(field(formData, "usageLimit")) : null,
    active: checked(formData, "active"),
    expiresAt: field(formData, "expiresAt"),
  });
}

function couponDate(value: string) {
  return value ? new Date(`${value}T23:59:59.000Z`) : null;
}

export async function createCouponAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await assertAdmin();
  try {
    const parsed = couponData(formData);
    if (parsed.type === "PERCENT" && parsed.value > 100) {
      throw new Error("Percentage discount cannot exceed 100.");
    }
    await prisma.coupon.create({
      data: {
        code: parsed.code,
        description: parsed.description,
        type: parsed.type,
        value: parsed.value,
        minSubtotal: parsed.minSubtotal,
        maxDiscount: parsed.maxDiscount ?? null,
        usageLimit: parsed.usageLimit ?? null,
        active: parsed.active,
        expiresAt: couponDate(parsed.expiresAt),
      },
    });
    revalidatePath("/admin/coupons");
    return { status: "success", message: "Coupon created." };
  } catch (error) {
    return fail(error, "Unable to create the coupon.");
  }
}

export async function updateCouponAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await assertAdmin();
  const id = field(formData, "id");
  try {
    const parsed = couponData(formData);
    if (parsed.type === "PERCENT" && parsed.value > 100) {
      throw new Error("Percentage discount cannot exceed 100.");
    }
    await prisma.coupon.update({
      where: { id },
      data: {
        code: parsed.code,
        description: parsed.description,
        type: parsed.type,
        value: parsed.value,
        minSubtotal: parsed.minSubtotal,
        maxDiscount: parsed.maxDiscount ?? null,
        usageLimit: parsed.usageLimit ?? null,
        active: parsed.active,
        expiresAt: couponDate(parsed.expiresAt),
      },
    });
    revalidatePath("/admin/coupons");
    return { status: "success", message: "Coupon saved." };
  } catch (error) {
    return fail(error, "Unable to save the coupon.");
  }
}

export async function toggleCouponAction(formData: FormData) {
  await assertAdmin();
  const id = field(formData, "id");
  try {
    const coupon = await prisma.coupon.findUnique({ where: { id } });
    if (!coupon) return;
    await prisma.coupon.update({ where: { id }, data: { active: !coupon.active } });
    revalidatePath("/admin/coupons");
  } catch (error) {
    console.error("Coupon toggle failed", error);
  }
}

export async function deleteCouponAction(formData: FormData) {
  await assertAdmin();
  const id = field(formData, "id");
  try {
    await prisma.coupon.delete({ where: { id } });
    revalidatePath("/admin/coupons");
  } catch (error) {
    console.error("Coupon delete failed", error);
  }
}

export async function updateOrderAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await assertAdmin();
  const id = field(formData, "id");
  const status = field(formData, "status");
  const paymentStatus = field(formData, "paymentStatus");
  const allowedStatuses = [
    "PENDING",
    "CONFIRMED",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
    "RETURNED",
    "REFUNDED",
  ];
  const allowedPaymentStatuses = ["PENDING", "COD_PENDING", "PAID", "FAILED", "CANCELLED", "REFUNDED"];
  if (!allowedStatuses.includes(status) || !allowedPaymentStatuses.includes(paymentStatus)) {
    return { status: "error", message: "Choose valid order and payment statuses." };
  }

  try {
    const order = await prisma.order.findUnique({ where: { id }, include: { items: true } });
    if (!order) return { status: "error", message: "Order not found." };
    if (order.status === "CANCELLED" && status !== "CANCELLED") {
      return { status: "error", message: "A cancelled order cannot be reopened." };
    }

    await prisma.$transaction(async (tx) => {
      if (status === "CANCELLED" && order.status !== "CANCELLED") {
        for (const item of order.items) {
          if (item.variantId) {
            await tx.productVariant.update({
              where: { id: item.variantId },
              data: { stock: { increment: item.quantity } },
            });
          }
          if (item.productId) {
            await tx.product.update({
              where: { id: item.productId },
              data: { stock: { increment: item.quantity } },
            });
          }
        }
        if (order.couponCode) {
          await tx.coupon.updateMany({
            where: { code: order.couponCode },
            data: { usedCount: { decrement: 1 } },
          });
        }
      }

      await tx.order.update({
        where: { id },
        data: {
          status,
          paymentStatus,
          shippedAt:
            status === "SHIPPED" ? order.shippedAt ?? new Date() : order.shippedAt,
          deliveredAt:
            status === "DELIVERED" ? order.deliveredAt ?? new Date() : order.deliveredAt,
          cancelledAt:
            status === "CANCELLED" ? order.cancelledAt ?? new Date() : order.cancelledAt,
          paidAt:
            paymentStatus === "PAID" ? order.paidAt ?? new Date() : order.paidAt,
        },
      });
    });

    refreshStorefront();
    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${id}`);
    return { status: "success", message: "Order updated." };
  } catch (error) {
    return fail(error, "Unable to update the order.");
  }
}

export async function setReviewStatusAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await assertAdmin();
  const id = field(formData, "id");
  const status = field(formData, "status");
  if (!["PENDING", "APPROVED", "REJECTED"].includes(status)) {
    return { status: "error", message: "Choose a valid review status." };
  }
  try {
    const review = await prisma.review.update({
      where: { id },
      data: { status },
      include: { product: { select: { slug: true } } },
    });
    revalidatePath("/admin/reviews");
    revalidatePath(`/products/${review.product.slug}`);
    return { status: "success", message: `Review marked ${status.toLowerCase()}.` };
  } catch (error) {
    return fail(error, "Unable to update the review.");
  }
}

export async function deleteReviewAction(formData: FormData) {
  await assertAdmin();
  const id = field(formData, "id");
  try {
    const review = await prisma.review.delete({
      where: { id },
      include: { product: { select: { slug: true } } },
    });
    revalidatePath("/admin/reviews");
    revalidatePath(`/products/${review.product.slug}`);
  } catch (error) {
    console.error("Review delete failed", error);
  }
}

export async function updateMessageStatusAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await assertAdmin();
  const id = field(formData, "id");
  const status = field(formData, "status");
  if (!["NEW", "READ", "RESPONDED"].includes(status)) {
    return { status: "error", message: "Choose a valid message status." };
  }
  try {
    await prisma.contactMessage.update({ where: { id }, data: { status } });
    revalidatePath("/admin/messages");
    return { status: "success", message: "Message updated." };
  } catch (error) {
    return fail(error, "Unable to update the message.");
  }
}

export async function deleteSubscriberAction(formData: FormData) {
  await assertAdmin();
  const id = field(formData, "id");
  try {
    await prisma.newsletterSubscriber.delete({ where: { id } });
    revalidatePath("/admin/newsletter");
  } catch (error) {
    console.error("Subscriber delete failed", error);
  }
}

export async function updateSettingsAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await assertAdmin();
  const shippingThreshold = rupees(field(formData, "shippingThreshold"));
  const shippingFee = rupees(field(formData, "shippingFee"));
  if (!shippingThreshold || !Number.isFinite(shippingThreshold)) {
    return { status: "error", message: "Enter a valid free-shipping threshold." };
  }
  if (shippingFee === null || !Number.isFinite(shippingFee)) {
    return { status: "error", message: "Enter a valid shipping fee." };
  }

  const values: Record<string, string> = {
    heroEyebrow: field(formData, "heroEyebrow"),
    heroTitle: field(formData, "heroTitle"),
    heroSubtitle: field(formData, "heroSubtitle"),
    announcement: field(formData, "announcement"),
    announcementSecondary: field(formData, "announcementSecondary"),
    supportEmail: field(formData, "supportEmail"),
    supportHours: field(formData, "supportHours"),
    shippingThreshold: String(shippingThreshold),
    shippingFee: String(shippingFee),
    returnWindow: field(formData, "returnWindow"),
    demoNote: field(formData, "demoNote"),
  };

  try {
    await prisma.$transaction(
      Object.entries(values).map(([key, value]) =>
        prisma.setting.upsert({
          where: { key },
          update: { value },
          create: { key, value },
        }),
      ),
    );
    refreshStorefront();
    revalidatePath("/admin/settings");
    return { status: "success", message: "Store settings saved." };
  } catch (error) {
    return fail(error, "Unable to save the settings.");
  }
}
