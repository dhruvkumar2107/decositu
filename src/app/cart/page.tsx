import type { Metadata } from "next";
import { CartView } from "@/components/cart/CartView";
import { getSettings, shippingConfig } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Your bag",
  description: "Review the pieces in your Decoritu bag.",
  robots: { index: false, follow: true },
};

export default async function CartPage() {
  const settings = await getSettings();
  const shipping = shippingConfig(settings);

  return (
    <CartView shippingThreshold={shipping.threshold} shippingFee={shipping.fee} />
  );
}
