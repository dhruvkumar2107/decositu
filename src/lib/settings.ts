import { prisma } from "@/lib/db";

const defaults: Record<string, string> = {
  heroEyebrow: "The considered home · Volume 01",
  heroTitle: "Make room for beautiful living.",
  heroSubtitle: "Thoughtfully chosen furnishings for the home you love.",
  announcement: "Handcrafted Luxury Furnishings · Complimentary Shipping on Orders Over ₹1,999",
  announcementSecondary: "Use code WELCOME10 for 10% off your first order",
  supportEmail: "hello@decoritu.in",
  supportHours: "Mon–Sat, 10am–6pm IST",
  shippingThreshold: "199900",
  shippingFee: "9900",
  returnWindow: "7",
  demoNote:
    "Sample catalogue and pricing are shown for preview. No live payment is captured in demo mode.",
};

export async function getSettings() {
  try {
    const rows = await prisma.setting.findMany();
    return { ...defaults, ...Object.fromEntries(rows.map((row) => [row.key, row.value])) };
  } catch {
    return defaults;
  }
}

export function isDemoMode() {
  return process.env.NEXT_PUBLIC_DEMO_MODE !== "false";
}

export function shippingConfig(settings: Awaited<ReturnType<typeof getSettings>>) {
  return {
    threshold: Number(settings.shippingThreshold) || 0,
    fee: Number(settings.shippingFee) || 0,
  };
}
