export type PricingLine = {
  unitPrice: number;
  quantity: number;
};

export type CouponLike = {
  code: string;
  type: string;
  value: number;
  minSubtotal: number;
  maxDiscount?: number | null;
  active: boolean;
  startsAt?: Date | null;
  expiresAt?: Date | null;
  usageLimit?: number | null;
  usedCount: number;
};

export type Totals = {
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
};

export function calculateSubtotal(items: PricingLine[]) {
  return items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
}

export function bulkDiscount(subtotal: number, threshold: number, discount: number) {
  return subtotal >= threshold ? discount : 0;
}

export function couponDiscount(coupon: CouponLike, subtotal: number, now = new Date()) {
  if (!coupon.active) return { discount: 0, error: "This coupon is no longer active." };
  if (coupon.startsAt && coupon.startsAt > now) {
    return { discount: 0, error: "This coupon is not active yet." };
  }
  if (coupon.expiresAt && coupon.expiresAt < now) {
    return { discount: 0, error: "This coupon has expired." };
  }
  if (coupon.usageLimit !== null && coupon.usageLimit !== undefined && coupon.usedCount >= coupon.usageLimit) {
    return { discount: 0, error: "This coupon has reached its usage limit." };
  }
  if (subtotal < coupon.minSubtotal) {
    return { discount: 0, error: "Your order does not meet the minimum value for this coupon." };
  }

  let discount = coupon.type === "PERCENT"
    ? Math.round((subtotal * coupon.value) / 100)
    : coupon.value;

  if (coupon.type === "PERCENT" && coupon.maxDiscount) {
    discount = Math.min(discount, coupon.maxDiscount);
  }

  discount = Math.min(discount, subtotal);

  return { discount, error: null };
}

export function calculateTotals(
  items: PricingLine[],
  options: {
    coupon?: CouponLike | null;
    bulkDiscount?: { threshold: number; discount: number };
    shippingThreshold: number;
    shippingFee: number;
    taxRate?: number;
  },
  now = new Date(),
): Totals {
  const subtotal = calculateSubtotal(items);
  const couponResult = options.coupon ? couponDiscount(options.coupon, subtotal, now) : { discount: 0, error: null };
  const bulkDiscountResult = options.bulkDiscount
    ? bulkDiscount(subtotal, options.bulkDiscount.threshold, options.bulkDiscount.discount)
    : 0;
  const discount = couponResult.discount + bulkDiscountResult;
  const shipping = subtotal >= options.shippingThreshold ? 0 : options.shippingFee;
  const taxable = Math.max(subtotal - discount, 0);
  const taxRate = options.taxRate ?? 0;
  const tax = Math.round((taxable * taxRate) / (100 + taxRate));

  return {
    subtotal,
    discount,
    shipping,
    tax,
    total: Math.max(subtotal - discount + shipping, 0),
  };
}

export function generateOrderNumber(date = new Date()) {
  const datePart = date.toISOString().slice(0, 10).replaceAll("-", "");
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `DCT-${datePart}-${random}`;
}
