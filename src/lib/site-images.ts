/**
 * Every image on the storefront that is not a product or category image.
 * Each slot is stored as a Setting row (key = slot key, value = image URL),
 * so the admin can swap any of them from /admin/site-images.
 */
export type SiteImageSlot = {
  key: string;
  label: string;
  group: string;
  defaultSrc: string;
  hint?: string;
};

export const siteImageSlots = [
  { key: "img.logo", group: "Brand", label: "Website logo", defaultSrc: "/images/logo.png", hint: "Shown in the header and footer. A PNG with a transparent background looks best." },
  { key: "img.socialShare", group: "Brand", label: "Social share image", defaultSrc: "/images/hero-living.jpg", hint: "Preview image when the site is shared on WhatsApp, Facebook, etc. Landscape works best (1200 × 630)." },

  { key: "img.homeHero", group: "Homepage", label: "Hero banner", defaultSrc: "/images/hero-living.jpg", hint: "Large full-width image at the top of the homepage. Landscape, at least 2000px wide." },
  { key: "img.homeBedding", group: "Homepage", label: "Bedding campaign", defaultSrc: "/images/campaign-bedding.jpg" },
  { key: "img.homeCurtains", group: "Homepage", label: "Curtains campaign", defaultSrc: "/images/campaign-curtains.jpg" },
  { key: "img.homeDohar", group: "Homepage", label: "Dohar / quilt feature", defaultSrc: "/images/dohar-02.jpg" },
  { key: "img.homeCushions", group: "Homepage", label: "Cushions tile", defaultSrc: "/images/cushions-01.jpg" },
  { key: "img.homeRugs", group: "Homepage", label: "Rugs tile", defaultSrc: "/images/rugs-01.jpg" },
  { key: "img.homeSofa", group: "Homepage", label: "Sofa covers tile", defaultSrc: "/images/sofa-01.jpg" },
  { key: "img.homeFestive", group: "Homepage", label: "Festive banner", defaultSrc: "/images/campaign-festive.jpg" },
  { key: "img.story", group: "Homepage", label: "Brand story / newsletter", defaultSrc: "/images/story-craft.jpg", hint: "Also used on the inspiration, care guide and 404 pages." },

  { key: "img.roomBedroom", group: "Rooms & inspiration", label: "Bedroom", defaultSrc: "/images/room-bedroom.jpg" },
  { key: "img.roomLiving", group: "Rooms & inspiration", label: "Living room", defaultSrc: "/images/room-living.jpg" },
  { key: "img.roomDining", group: "Rooms & inspiration", label: "Dining room", defaultSrc: "/images/room-dining.jpg" },
  { key: "img.inspirationHero", group: "Rooms & inspiration", label: "Inspiration page hero", defaultSrc: "/images/hero-living.jpg" },
  { key: "img.inspBedroomDetail", group: "Rooms & inspiration", label: "Bedroom detail", defaultSrc: "/images/bedding-07.jpg" },
  { key: "img.inspLivingDetail", group: "Rooms & inspiration", label: "Living room detail", defaultSrc: "/images/cushions-03.jpg" },
  { key: "img.inspDiningDetail", group: "Rooms & inspiration", label: "Dining room detail", defaultSrc: "/images/dining-03.jpg" },

  { key: "img.menuFeature", group: "Navigation & pages", label: "Shop menu feature", defaultSrc: "/images/dohar-02.jpg", hint: "Image inside the desktop “Shop” dropdown." },
  { key: "img.authSide", group: "Navigation & pages", label: "Login / register side image", defaultSrc: "/images/campaign-bedding.jpg" },
  { key: "img.collectionNew", group: "Navigation & pages", label: "New arrivals banner", defaultSrc: "/images/bedding-02.jpg" },
  { key: "img.collectionBestsellers", group: "Navigation & pages", label: "Bestsellers banner", defaultSrc: "/images/dohar-02.jpg" },
  { key: "img.collectionSale", group: "Navigation & pages", label: "Sale banner", defaultSrc: "/images/curtains-03.jpg" },
  { key: "img.pageContact", group: "Navigation & pages", label: "Contact page header", defaultSrc: "/images/story-craft.jpg" },
  { key: "img.pageFaq", group: "Navigation & pages", label: "FAQ page header", defaultSrc: "/images/bedding-06.jpg" },
  { key: "img.pageCare", group: "Navigation & pages", label: "Care guide header", defaultSrc: "/images/bedding-04.jpg" },
  { key: "img.pageShipping", group: "Navigation & pages", label: "Shipping & returns header", defaultSrc: "/images/decor-06.jpg" },
] as const satisfies readonly SiteImageSlot[];

export type SiteImageKey = (typeof siteImageSlots)[number]["key"];

export const siteImageDefaults: Record<SiteImageKey, string> = Object.fromEntries(
  siteImageSlots.map((slot) => [slot.key, slot.defaultSrc]),
) as Record<SiteImageKey, string>;

export const siteImageKeys = new Set<string>(siteImageSlots.map((slot) => slot.key));

/** Accepts local paths ("/images/x.jpg", "/api/media/abc") or absolute http(s) URLs. */
export function isValidImageUrl(value: string) {
  if (!value || value.length > 1000) return false;
  if (value.startsWith("/") && !value.startsWith("//")) return !/\s/.test(value);
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}
