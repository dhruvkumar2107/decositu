import { describe, expect, it } from "vitest";
import {
  canCancelOrder,
  formatAddress,
  orderStatusClass,
  orderStatusLabel,
  orderStepIndex,
  paymentStatusLabel,
} from "../orders";

describe("orders logic", () => {
  it("translates order and payment statuses correctly", () => {
    expect(orderStatusLabel("CONFIRMED")).toBe("Confirmed");
    expect(orderStatusLabel("UNKNOWN")).toBe("UNKNOWN");
    expect(paymentStatusLabel("PAID")).toBe("Paid");
    expect(paymentStatusLabel("COD_PENDING")).toBe("Pay on delivery");
  });

  it("calculates status badges", () => {
    expect(orderStatusClass("DELIVERED")).toContain("text-olive");
    expect(orderStatusClass("CANCELLED")).toContain("text-wine");
    expect(orderStatusClass("PROCESSING")).toContain("text-clay");
  });

  it("evaluates online cancellation eligibility", () => {
    expect(canCancelOrder("PENDING", "PENDING")).toBe(true);
    expect(canCancelOrder("CONFIRMED", "COD_PENDING")).toBe(true);
    expect(canCancelOrder("PROCESSING", "COD_PENDING")).toBe(true);
    expect(canCancelOrder("CONFIRMED", "PAID")).toBe(false);
    expect(canCancelOrder("SHIPPED", "COD_PENDING")).toBe(false);
    expect(canCancelOrder("DELIVERED", "PAID")).toBe(false);
  });

  it("determines correct timeline step index", () => {
    expect(orderStepIndex("CONFIRMED")).toBe(0);
    expect(orderStepIndex("PROCESSING")).toBe(1);
    expect(orderStepIndex("SHIPPED")).toBe(2);
    expect(orderStepIndex("DELIVERED")).toBe(3);
    expect(orderStepIndex("CANCELLED")).toBe(-1);
  });

  it("formats Indian delivery addresses correctly", () => {
    const address = formatAddress({
      fullName: "Ananya Roy",
      line1: "42 Heritage Boulevard",
      line2: "Apt 4B",
      city: "Jaipur",
      state: "Rajasthan",
      pincode: "302001",
    });
    expect(address).toBe("Ananya Roy, 42 Heritage Boulevard, Apt 4B, Jaipur, Rajasthan 302001");
  });
});
