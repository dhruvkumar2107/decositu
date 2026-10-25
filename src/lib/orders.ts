export const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING: "Payment pending",
  CONFIRMED: "Confirmed",
  PROCESSING: "Being prepared",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  RETURNED: "Return requested",
  REFUNDED: "Refunded",
};

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  PAID: "Paid",
  COD_PENDING: "Pay on delivery",
  CANCELLED: "Cancelled",
  REFUNDED: "Refunded",
  FAILED: "Failed",
};

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  COD: "Cash on delivery",
  ONLINE: "Online payment",
};

export function orderStatusLabel(status: string) {
  return ORDER_STATUS_LABELS[status] ?? status;
}

export function paymentStatusLabel(status: string) {
  return PAYMENT_STATUS_LABELS[status] ?? status;
}

export function paymentMethodLabel(method: string) {
  return PAYMENT_METHOD_LABELS[method] ?? method;
}

export function orderStatusClass(status: string) {
  switch (status) {
    case "DELIVERED":
      return "border-olive/30 bg-olive/10 text-olive";
    case "SHIPPED":
    case "PROCESSING":
      return "border-clay/30 bg-clay/10 text-clay";
    case "CANCELLED":
    case "REFUNDED":
      return "border-wine/30 bg-wine/8 text-wine";
    case "CONFIRMED":
      return "border-olive/25 bg-paper text-olive";
    default:
      return "border-line bg-cream text-muted";
  }
}

export function canCancelOrder(status: string, paymentStatus: string) {
  return (
    ["PENDING", "CONFIRMED", "PROCESSING"].includes(status) &&
    paymentStatus !== "PAID"
  );
}

export const ORDER_STEPS = [
  { key: "CONFIRMED", label: "Confirmed" },
  { key: "PROCESSING", label: "Preparing" },
  { key: "SHIPPED", label: "Shipped" },
  { key: "DELIVERED", label: "Delivered" },
] as const;

export function orderStepIndex(status: string) {
  return ORDER_STEPS.findIndex((step) => step.key === status);
}

export function formatAddress(order: {
  fullName: string;
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  pincode: string;
}) {
  return [
    order.fullName,
    order.line1,
    order.line2,
    `${order.city}, ${order.state} ${order.pincode}`,
  ]
    .filter(Boolean)
    .join(", ");
}
