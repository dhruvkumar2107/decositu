import type { Metadata, Viewport } from "next";
import "@fontsource-variable/manrope";
import "@fontsource-variable/cormorant-garamond";
import "./globals.css";
import { Toaster } from "sonner";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { StoreProvider } from "@/components/providers/StoreProvider";
import { getCurrentUser } from "@/lib/auth";
import { getCategories } from "@/lib/products";
import { getSettings, isDemoMode, shippingConfig } from "@/lib/settings";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "Decoritu — Considered things for beautiful living",
    template: "%s | Decoritu",
  },
  description:
    "Discover considered bedding, curtains, dohars, cushions, rugs and objects for the home. Thoughtfully chosen furnishings for the home you love.",
  keywords: [
    "home decor India",
    "bedsheets",
    "curtains",
    "dohars",
    "cushion covers",
    "rugs",
    "home furnishings",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Decoritu",
    title: "Decoritu — Considered things for beautiful living",
    description: "Thoughtfully chosen furnishings for the home you love.",
    images: [{ url: "/images/hero-living.jpg", width: 2400, height: 1350, alt: "A warmly styled Decoritu living room" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Decoritu — Considered things for beautiful living",
    description: "Thoughtfully chosen furnishings for the home you love.",
    images: ["/images/hero-living.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f8f4ed",
  colorScheme: "light",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [categories, settings, user] = await Promise.all([
    getCategories().catch(() => []),
    getSettings(),
    getCurrentUser(),
  ]);

  const navCategories = categories.map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    image: category.image,
    description: category.description,
  }));

  const footerCategories = categories.map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
  }));

  const shipping = shippingConfig(settings);

  return (
    <html lang="en-IN">
      <body>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <StoreProvider>
          <AnnouncementBar
            primary={settings.announcement}
            secondary={settings.announcementSecondary}
          />
          <Header
            categories={navCategories}
            user={user}
            shippingThreshold={shipping.threshold}
            returnWindow={Number(settings.returnWindow) || 7}
          />
          <main id="main-content">{children}</main>
          <Footer categories={footerCategories} settings={settings} demoMode={isDemoMode()} />
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "#2b2a25",
                color: "#f8f4ed",
                border: "1px solid rgba(248,244,237,0.18)",
                borderRadius: 0,
                fontFamily: "Manrope Variable, sans-serif",
                fontSize: "13px",
              },
            }}
          />
        </StoreProvider>
      </body>
    </html>
  );
}
