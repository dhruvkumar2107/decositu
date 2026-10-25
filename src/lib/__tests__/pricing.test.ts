import { describe, expect, it } from "vitest";
import { calculateSubtotal, calculateTotals, couponDiscount, type CouponLike } from "../pricing";

const baseCoupon: CouponLike = {
  code: "WELCOME10",
  type: "PERCENT",
  value: 10,
  minSubtotal: 100_000,
  maxDiscount: 100_000,
  active: true,
  usedCount: 0,
};

describe("calculateSubtotal", () => {
  it("multiplies unit prices by quantity and sums the lines", () => {
    expect(calculateSubtotal([
      { unitPrice: 249_900, quantity: 2 },
      { unitPrice: 99_900, quantity: 1 },
    ])).toBe(599_700);
  });
});

describe("couponDiscount", () => {
  it("applies a percentage discount", () => {
    expect(couponDiscount(baseCoupon, 300_000).discount).toBe(30_000);
  });

  it("caps a percentage discount at maxDiscount", () => {
    expect(couponDiscount(baseCoupon, 2_000_000).discount).toBe(100_000);
  });

  it("applies a fixed discount", () => {
    expect(couponDiscount({ ...baseCoupon, type: "FIXED", value: 50_000 }, 300_000).discount).toBe(50_000);
  });

  it("never discounts more than the subtotal", () => {
    expect(couponDiscount({ ...baseCoupon, type: "FIXED", value: 200_000 }, 120_000).discount).toBe(120_000);
  });

  it("rejects inactive, expired, over-limit and below-minimum coupons", () => {
    expect(couponDiscount({ ...baseCoupon, active: false }, 300_000).error).toMatch(/no longer active/i);
    expect(couponDiscount({ ...baseCoupon, expiresAt: new Date("2020-01-01") }, 300_000).error).toMatch(/expired/i);
    expect(couponDiscount({ ...baseCoupon, usageLimit: 5, usedCount: 5 }, 300_000).error).toMatch(/usage limit/i);
    expect(couponDiscount(baseCoupon, 50_000).error).toMatch(/minimum/i);
  });
});

describe("calculateTotals", () => {
  it("adds shipping below the free-shipping threshold", () => {
    const totals = calculateTotals([{ unitPrice: 150_000, quantity: 1 }], {
      shippingThreshold: 199_900,
      shippingFee: 9_900,
    });
    expect(totals).toEqual({
      subtotal: 150_000,
      discount: 0,
      shipping: 9_900,
      tax: 0,
      total: 159_900,
    });
  });

  it("removes shipping at or above the threshold and applies discount", () => {
    const totals = calculateTotals([{ unitPrice: 250_000, quantity: 1 }], {
      coupon: baseCoupon,
      shippingThreshold: 199_900,
      shippingFee: 9_900,
    });
    expect(totals.shipping).toBe(0);
    expect(totals.discount).toBe(25_000);
    expect(totals.total).toBe(225_000);
  });
});
