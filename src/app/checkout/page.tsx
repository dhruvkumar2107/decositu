import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getSettings, isDemoMode, shippingConfig } from "@/lib/settings";
import { isRazorpayConfigured } from "@/lib/payments";
import { CheckoutView } from "@/components/checkout/CheckoutView";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your Decoritu order.",
  robots: { index: false, follow: false },
};

export default async function CheckoutPage() {
  const [user, settings] = await Promise.all([getCurrentUser(), getSettings()]);
  const shipping = shippingConfig(settings);
  const addresses = user
    ? await prisma.address.findMany({
        where: { userId: user.id },
        orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
      })
    : [];

  return (
    <CheckoutView
      user={user ? { name: user.name, email: user.email, phone: user.phone } : null}
      addresses={addresses.map((address) => ({
        id: address.id,
        label: address.label,
        fullName: address.fullName,
        phone: address.phone,
        line1: address.line1,
        line2: address.line2,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        isDefault: address.isDefault,
      }))}
      shippingThreshold={shipping.threshold}
      shippingFee={shipping.fee}
      returnWindow={Number(settings.returnWindow) || 7}
      onlineAvailable={isRazorpayConfigured()}
      demoMode={isDemoMode()}
    />
  );
}
