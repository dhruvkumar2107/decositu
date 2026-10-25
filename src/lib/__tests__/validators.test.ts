import { describe, expect, it } from "vitest";
import {
  addressSchema,
  couponCodeSchema,
  createOrderSchema,
  loginSchema,
  newsletterSchema,
  registerSchema,
} from "../validators";

describe("input validation schemas", () => {
  it("validates user registration", () => {
    const valid = registerSchema.safeParse({
      name: "Dhruv Sharma",
      email: "dhruv@example.com",
      password: "StrongPassword123",
    });
    expect(valid.success).toBe(true);

    const weakPassword = registerSchema.safeParse({
      name: "Dhruv Sharma",
      email: "dhruv@example.com",
      password: "short",
    });
    expect(weakPassword.success).toBe(false);

    const noNumber = registerSchema.safeParse({
      name: "Dhruv Sharma",
      email: "dhruv@example.com",
      password: "LettersOnlyNoNumber",
    });
    expect(noNumber.success).toBe(false);
  });

  it("validates login schema", () => {
    expect(loginSchema.safeParse({ email: "user@decoritu.in", password: "pwd" }).success).toBe(true);
    expect(loginSchema.safeParse({ email: "invalid-email", password: "pwd" }).success).toBe(false);
  });

  it("validates 6-digit Indian PIN codes and 10-digit mobile numbers in addressSchema", () => {
    const valid = addressSchema.safeParse({
      label: "Studio",
      fullName: "Ananya Roy",
      phone: "+91 98765 43210",
      line1: "123 Civil Lines",
      city: "Jaipur",
      state: "Rajasthan",
      pincode: "302001",
    });
    expect(valid.success).toBe(true);
    if (valid.success) {
      expect(valid.data.phone).toBe("9876543210");
    }

    const invalidPin = addressSchema.safeParse({
      fullName: "Ananya Roy",
      phone: "9876543210",
      line1: "123 Civil Lines",
      city: "Jaipur",
      state: "Rajasthan",
      pincode: "012345", // Cannot start with 0
    });
    expect(invalidPin.success).toBe(false);
  });

  it("validates createOrderSchema constraints", () => {
    const invalidItems = createOrderSchema.safeParse({
      fullName: "Ananya Roy",
      email: "ananya@example.com",
      phone: "9876543210",
      line1: "123 Civil Lines",
      city: "Jaipur",
      state: "Rajasthan",
      pincode: "302001",
      paymentMethod: "COD",
      items: [], // Empty bag
    });
    expect(invalidItems.success).toBe(false);
  });

  it("validates newsletter consent requirement", () => {
    expect(newsletterSchema.safeParse({ email: "a@b.com", consent: true }).success).toBe(true);
    expect(newsletterSchema.safeParse({ email: "a@b.com", consent: false }).success).toBe(false);
  });

  it("validates couponCode schema", () => {
    expect(couponCodeSchema.safeParse({ code: "WELCOME10", subtotal: 250000 }).success).toBe(true);
    expect(couponCodeSchema.safeParse({ code: "W", subtotal: 250000 }).success).toBe(false);
  });
});
