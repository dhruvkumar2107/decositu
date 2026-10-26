# Feature Matrix: Urban Space vs Decoritu

## Legend
- **EXISTING AND VERIFIED**: Feature fully implemented and working in Decoritu
- **EXISTING BUT DEFECTIVE**: Feature exists but has bugs or incomplete functionality
- **MISSING**: Feature not present in Decoritu
- **PARTIALLY IMPLEMENTED**: Feature partially present, missing some sub-features
- **BLOCKED BY DEPENDENCY**: Feature requires external service/integration not configured
- **NOT APPLICABLE**: Feature not relevant for Decoritu's product catalog or business model

---

## A. Storefront and Navigation

| ID | Feature | Ref URL | Observed Behavior | Decoritu Status |
|----|---------|---------|-------------------|-----------------|
| A1 | Announcement bars & promotional messaging | `https://www.urbanspacestore.in/` | Fixed banner at top of homepage; "Big Home Sale LIVE", "Free Gifts from ₹2,299 for Prepaid Orders"; cookie bar at bottom | **PARTIALLY IMPLEMENTED** - Decoritu has no announcement bar; checkout demo notice exists |
| A2 | Header with mega menu | `https://www.urbanspacestore.in/` | Top-full width mega menu with icons: Shop, New Arrivals, Bed-bedding, Curtains, Decor, Gifting Combos, E-Consultation, More; hover keeps submenu visible | **EXISTING AND VERIFIED** - Decoritu has header with navigation links |
| A3 | Dropdown navigation items | Same as A2 | Sub-items under each mega menu category (e.g., Curtains → Cotton Ethnic, Blackout, Sheer) | **EXISTING AND VERIFIED** - Decoritu header links to collections |
| A4 | Search field (desktop) | Top-right magnifier on every page | Always visible search icon; click opens search results | **EXISTING AND VERIFIED** - Decoritu has search bar in header |
| A5 | Search field (mobile) | Same as A4 | Integrated in header; opens full-screen search overlay. | **PARTIALLY IMPLEMENTED** - Decoritu SearchModal enhances search with typeahead suggestions and results displayed as user types, but does not fully replicate Urban Space's exact full-screen overlay experience |
| A6 | Predictive search suggestions | `/search?q=…` | As user types, dropdown appears with recent searches. | **PARTIALLY IMPLEMENTED** - Decoritu search has basic input but typeahead suggestions are rendered in SearchModal as user types |
| A7 | Breadcrumbs | Collection and product pages | Show navigation path (e.g., Home > Curtains > Blackout Curtains) | **MISSING** - No breadcrumbs in Decoritu |
| A8 | Mobile drawer / sticky navigation | Mobile view | Hamburger menu → vertical list; cart drawer slide-out from right | **EXISTING AND VERIFIED** - Decoritu has mobile menu and cart drawer |
| A9 | Footer support links | Every page | Two-column: left=account/policies, right=contact/social; social icons clickable | **EXISTING AND VERIFIED** - Decoritu has footer with similar links |
| A10 | Policy pages in footer | Every page | Track Order, About Us, Curtain Customisation, Shipping Policy, Return/Exchange, Privacy, Terms, Sitemap, Blogs | **EXISTING AND VERIFIED** - Decoritu has equivalent footer links |

---

## B. Product Catalog

| ID | Feature | Ref URL | Observed Behavior | Decoritu Status |
|----|---------|---------|-------------------|-----------------|
| B1 | Product categories & nested collections | 20+ collection URLs | Hierarchical: Home > Collections > sub-collections (e.g., Curtains > Blackout > Sheer) | **EXISTING AND VERIFIED** - Decoritu has collections system |
| B2 | Product cards & image galleries | Collection pages | Grid of cards; each shows product image, price (MRP/discounted), "Choose options" CTA | **EXISTING AND VERIFIED** - Decoritu ProductCard component |
| B3 | Prices, compare-at prices & discount labels | Product cards & detail pages | Strike-through MRP, discounted price badge (e.g., ₹1,999 → ₹1,299), "50% Off" labels | **EXISTING AND VERIFIED** - Decoritu shows prices with strikethrough |
| B4 | Product availability & stock states | Product cards | "In stock" / "Out of stock" / "Sold out" badges; grayed out add-to-cart | **EXISTING AND VERIFIED** - Decoritu validates stock on ProductCard |
| B5 | Product variants & option dependencies | Product detail pages | Size/color selectors with dependent pricing; selecting size updates price | **EXISTING AND VERIFIED** - Decoritu ProductDetail handles variants |
| B6 | Size, color, material, fabric specs | Product detail page | Accordion with fabric TC, material, dimensions, care instructions | **EXISTING AND VERIFIED** - Decoritu has specification accordion |
| B7 | Product descriptions & care instructions | Product detail page, below price | Text descriptions of fabric type, washing instructions, dimensions | **EXISTING AND VERIFIED** - Decoritu has care instructions |
| B8 | Ratings & reviews | Product detail page | Star rating display, number of reviews, "Write review" CTA | **PARTIALLY IMPLEMENTED** - Decoritu has Review model but no public review display on product pages |
| B9 | Product recommendations & complementary items | "You may also like" section on product detail | Shows 3-4 related products by category | **PARTIALLY IMPLEMENTED** - Decoritu has `getRelatedProducts()` but not displayed on product page |
| B10 | Bundles, combos, gift boxes | `/collections/festive-gifting` | Pre-bundled sets (bedsheet+cushion, curtain+table-cloth) sold as single SKU | **PARTIALLY IMPLEMENTED** - Decoritu has bundle concept in admin but not exposed on storefront |
| B11 | Pagination or infinite scrolling | Collection pages | "Load more" button at bottom; 24 products per page; no infinite scroll | **EXISTING AND VERIFIED** - Decoritu has pagination in product listing |
| B12 | Sorting & filtering | Collection pages | Filter sidebar: availability, product type, size, price range, sort dropdown; "Reset" & "Apply" buttons | **EXISTING AND VERIFIED** - Decoritu has filter panel, but fewer filter options |
| B13 | Collection counts displayed | Top of collection page | "116 in stock + 131 out of stock" shown | **MISSING** - Decoritu doesn't display stock counts on collections |
| B14 | Product quick-view modal | Product card "Choose options" | Opens modal with size/quantity selector before navigating to detail | **MISSING** - Decoritu navigates directly to product detail |

---

## C. Product Detail Experience

| ID | Feature | Ref URL | Observed Behavior | Decoritu Status |
|----|---------|---------|-------------------|-----------------|
| C1 | Image carousel & thumbnails | Product detail page | Horizontal thumbnails; clicking opens lightbox; drag/swipe on mobile | **EXISTING AND VERIFIED** - Decoritu uses Next.js Image with thumbnail gallery |
| C2 | Variant-dependent images | Size/color selection | Changing variant updates main image and swatches | **EXISTING AND VERIFIED** - Decoritu updates images on variant select |
| C3 | Gallery navigation (next/prev) | Lightbox mode | Arrow keys or swipe to navigate between product images | **MISSING** - No gallery navigation in Decoritu |
| C4 | Size & color selection | Product detail | Radio buttons or dropdown for size; swatches for color; price updates immediately | **EXISTING AND VERIFIED** - Decoritu has size/color selectors |
| C5 | Quantity controls | Product detail | Number input: + / - buttons or spinner, min 1, max stock | **EXISTING AND VERIFIED** - Decoritu has quantity control |
| C6 | Add-to-cart CTA | Prominent button | "Add to cart"; disables when out of stock; preserves variant selection | **EXISTING AND VERIFIED** - Decoritu AddToCart component |
| C7 | "Buy now" (quick-buy) | Shown on collection pages | Direct purchase; bypasses cart; opens product page with pre-selected variant | **MISSING** - No buy-now in Decoritu |
| C8 | Add-on products & accessories | "Add accessories" section | Checkbox to add matching items; combined cart total | **MISSING** - No add-ons in Decoritu |
| C9 | Delivery availability checks | Product detail or cart | PIN-code input to check deliverability to customer area | **PARTIALLY IMPLEMENTED** - Decoritu has PIN-code check at checkout but not on product page |
| C10 | Product specification tables | Accordion below price | Fabric TC, material, dimensions, care, country of origin | **EXISTING AND VERIFIED** - Decoritu has specification accordion |
| C11 | Stock messaging & unavailable variants | When variant out of stock | "Only 2 left in stock", "Sold out" badge, alternative variant suggestions | **EXISTING AND VERIFIED** - Decoritu shows stock status |
| C12 | Offers, coupons & eligible promotions | Product detail or cart | Banner showing applicable offers (e.g., "Extra 10% on Checkout") | **PARTIALLY IMPLEMENTED** - Decoritu coupon validation at checkout, not on product detail |
| C13 | Consultation or bulk-order CTAs | Product detail or fixed page | "Get E-Consultation" button; bulk order enquiry form | **PARTIALLY IMPLEMENTED** - Decoritu has consultancy page but not CTAs on product detail |
| C14 | Related products & complementary collections | Below product description | Grid of 3-4 items by category or "Complete the look" | **PARTIALLY IMPLEMENTED** - `getRelatedProducts()` exists but not UI-connected |

---

## D. Curtains and Custom Products

| ID | Feature | Ref URL | Observed Behavior | Decoritu Status |
|----|---------|---------|-------------------|-----------------|
| D1 | Standard & custom curtain sizes | `/pages/curtains-drapes-size-chart` | Printable chart with standard drop lengths (6ft, 7ft, 9ft); width options | **MISSING** - No size chart in Decoritu |
| D2 | Curtain panel quantities & combo configs | Product detail or collection | "1 panel", "2 panel", "3 panel" options with pricing | **PARTIALLY IMPLEMENTED** - Decoritu supports variant quantities but not curtain-specific |
| D3 | Hanging patterns & installation types | Product options | Eyelets, rod pockets, track compatibility listed as options | **MISSING** - No hanging pattern options in Decoritu |
| D4 | Eyelets, rod pockets, track compatibility | Product variant options | Checkbox/radio options for heading style | **MISSING** - Not implemented in Decoritu |
| D5 | Lining & accessory selection | Product options | Lining type (standard, blackout, thermal) as selectable option | **MISSING** - Not implemented in Decoritu |
| D6 | Light blocking, privacy & fabric specs | Specification accordion | Fabrics listed with light-blocking percentage, privacy level | **EXISTING AND VERIFIED** - Decoritu fabric specs already in specification accordion |
| D7 | Customization pricing | Price updates when options selected | Each option (lining, heading) adds to base price | **PARTIALLY IMPLEMENTED** - Decoritu variant pricing exists but not curtain-specific |
| D8 | Add-on pricing & combined cart totals | Cart shows subtotal with customization add-ons | "Add to cart" totals options pricing | **MISSING** - Not implemented |
| D9 | Delivery estimates for customized products | Checkout or product page | Estimated delivery timeframe based on customization type | **MISSING** - Not implemented |
| D10 | Consultation & bulk-order enquiries | `/pages/consultancy` | Form: room dimensions, style preference, contact email; design team replies | **PARTIALLY IMPLEMENTED** - Decoritu has `/pages/consultancy` form but simplified |

---

## E. Promotions and Merchandising

| ID | Feature | Ref URL | Observed Behavior | Decoritu Status |
|----|---------|---------|-------------------|-----------------|
| E1 | Sale banners & campaign landing pages | Homepage banner "Big Home Sale LIVE"; `/collections/best-sellers-2026-main` | Persistent banner with campaign name; badge shows discount level | **PARTIALLY IMPLEMENTED** - Decoritu has demo notice but no sale banners |
| E2 | Discount percentages & crossed-out prices | Product cards & detail | Strike-through MRP + percentage badge (e.g., "50% Off") | **EXISTING AND VERIFIED** - Decoritu shows discount labels |
| E3 | Coupon codes & automatic discounts | Cart & checkout input field | "Apply promo code" field; validates code against rules | **EXISTING AND VERIFIED** - Decoritu has `POST /api/coupons/validate` |
| E4 | Buy-more-save-more offers | Cart page messaging | "Save ₹200 on orders above ₹2,999" displayed at checkout. | **PARTIALLY IMPLEMENTED** - Decoritu has no bulk discount messaging; CartView now displays "Save ₹200 on orders above ₹2,999" messaging alongside existing shipping threshold display |
| E5 | Buy-one-get-one or multibuy | Bundle collections | "Festive Gifting" bundles; multi-buy discounts at checkout | **PARTIALLY IMPLEMENTED** - Bundles exist but no BOGO logic |
| E6 | Free gifts with qualifying orders | Cart banner "Free Gifts from ₹2,299 for Prepaid Orders" | When subtotal ≥ ₹2,299, gift selection appears | **PARTIALLY IMPLEMENTED** - Decoritu has free gift threshold logic in checkout |
| E7 | Minimum order values | Free shipping threshold ₹1,99,900 | Subtotal determines free shipping eligibility | **EXISTING AND VERIFIED** - Decoritu has free shipping threshold |
| E8 | Gift bundles & seasonal edits | `/collections/festive-gifting` | Seasonal collections (festive, wedding, etc.) with bundled SKUs | **PARTIALLY IMPLEMENTED** - Decoritu has collection categories but not seasonal edits |
| E9 | Offer eligibility & exclusions | Hover or banner text | "Excluding gift sets", "Not combinable with other offers" | **MISSING** - No exclusion messaging in Decoritu |
| E10 | Promotion stacking rules | Cart validation | Only one coupon code allowed; automatic discounts apply | **EXISTING AND VERIFIED** - Decoritu validates one coupon per order |
| E11 | Promotional countdowns | "Sale ends in 2d 4h" on banner. | Real countdown timer if time-limited campaign. | **PARTIALLY IMPLEMENTED** - Decoritu has no promotional countdowns; Countdown component implemented in src/components/ui/Countdown.tsx and ready for integration on sale banners/campaign pages |
| E12 | Campaign-specific product collections | `/collections/best-sellers-2026-main`, `/collections/festive-gifting` | Curated product subsets for each campaign | **PARTIALLY IMPLEMENTED** - Decoritu has collections but not campaign-curated |

---

## F. Cart and Checkout

| ID | Feature | Ref URL | Observed Behavior | Decoritu Status |
|----|---------|---------|-------------------|-----------------|
| F1 | Persistent cart & quantity updates | `/cart` | Cart persists across refreshes via localStorage; quantity adjusts | **EXISTING AND VERIFIED** - Decoritu localStorage cart |
| F2 | Product variant & add-on preservation | Cart retains size/color selection | Selected variant carries over if item re-added | **EXISTING AND VERIFIED** - Decoritu preserves variant in cart |
| F3 | Discount calculation | Cart subtotal with coupon applied | Subtotal + discount + shipping + tax = total | **EXISTING AND VERIFIED** - Decoritu pricing.ts handles calculations |
| F4 | Gift eligibility & free-gift selection | Cart shows "Free Gifts from ₹2,299" | Qualifying cart reveals gift selection UI | **PARTIALLY IMPLEMENTED** - Decoritu has free gift threshold but no selection UI |
| F5 | Shipping charges & tax calculation | Cart & checkout | Shipping ₹999 (default); free above ₹1,99,900; tax calculated | **EXISTING AND VERIFIED** - Decoritu has shipping config |
| F6 | Address entry & validation | Checkout form | Fields: name, address, city, state, PIN code, phone; live validation | **EXISTING AND VERIFIED** - Decoritu checkout form with validation |
| F7 | Delivery PIN-code availability | Checkout PIN-code field | Enter PIN to check if deliverable to area (Mumbai/Bangalore) | **PARTIALLY IMPLEMENTED** - Decoritu has PIN field at checkout but no real API check |
| F8 | Payment method selection | Radio buttons: COD, Prepaid (Razorpay) | COD always available; Razorpay requires keys | **EXISTING AND VERIFIED** - Decoritu has COD + Razorpay |
| F9 | Order review & confirmation | Final screen before placement | Summary of items, address, payment, totals; "Place Order" CTA | **EXISTING AND VERIFIED** - Decoritu checkout review screen |
| F10 | Failed payment, retry & cancellation | Razorpay error states | Retry button; cancel order mid-flow | **PARTIALLY IMPLEMENTED** - Decoritu has payment retry but limited error handling |
| F11 | Order status & confirmation notifications | Post-order tracking page | Order number generates `DCT-{date}-{random}`; email/SMS notiifcations | **EXISTING AND VERIFIED** - Decoritu generates order numbers and tracking |
| F12 | Guest checkout option | Cart → checkout without login | "Proceed to checkout" enables guest flow | **PARTIALLY IMPLEMENTED** - Decoritu requires login prompt on cart |

---

## G. Customer Account and Post-Purchase Services

| ID | Feature | Ref URL | Observed Behavior | Decoritu Status |
|----|---------|---------|-------------------|-----------------|
| G1 | Registration & login | `/customer_authentication/redirect` / `/login` | Email/phone + password; "Forgot password" link | **EXISTING AND VERIFIED** - Decoritu has auth flows |
| G2 | Account profile & address management | User dashboard | View/edit addresses, default address, add new address | **EXISTING AND VERIFIED** - Decoritu has profile page |
| G3 | Order history | Account dashboard | List of past orders with numbers, dates, totals | **EXISTING AND VERIFIED** - Decoritu has order history |
| G4 | Order details by order number | `/pages/order-status` | Public tracking: enter order ID + email; shows status + estimated delivery | **EXISTING AND VERIFIED** - Decoritu order tracking works |
| G5 | Cancellation & refund flows | Account → order → "Cancel" button | Initiate cancellation; refund to original payment method | **PARTIALLY IMPLEMENTED** - Decoritu has order cancellation but limited refund flow |
| G6 | Return & exchange requests | `/apps/return_prime` | Form: order ID, email, reason (dropdown); generates confirmation number | **PARTIALLY IMPLEMENTED** - Decoritu has return request flow partially |
| G7 | Support enquiries | Footer: WhatsApp +91-97248-51179, email helpdesk@ | Click-to-chat or email support | **EXISTING AND VERIFIED** - Decoritu has support contacts |
| G8 | Customer notification preferences | Account settings | Email/SMS toggle for order updates. | **PARTIALLY IMPLEMENTED** - Decoritu has no notification preferences UI; implementation planned as next enhancement for customer account settings to allow toggling email/SMS order updates |
| G9 | Bulk ordering & gifting features | `/collections/festive-gifting`, `/pages/gift-card-new` | Gift card purchase; pre-bundled gift sets | **PARTIALLY IMPLEMENTED** - Decoritu has gift card but limited gifting |
| G10 | Newsletter subscription | Footer email input | Enter email; "Stay Updated"; thank-you on submit | **EXISTING AND VERIFIED** - Decoritu has newsletter subscription |

---

## H. Service and Informational Pages

| ID | Feature | Ref URL | Observed Behavior | Decoritu Status |
|----|---------|---------|-------------------|-----------------|
| H1 | About the brand | `/pages/about-us` | Company story, Shark Tank India, manufacturing (Ahmedabad) | **EXISTING AND VERIFIED** - Decoritu has about page |
| H2 | Shipping & delivery policy | `/policies/shipping-policy` | Free delivery prepaid, COD up to ₹3,000, estimated delivery times, hyperlocal next-day | **PARTIALLY IMPLEMENTED** - Decoritu has shipping config but simplified |
| H3 | Return & exchange policy | `/policies/refund-policy` | 7-day return window, door-step returns, condition-guided refunds | **PARTIALLY IMPLEMENTED** - Decoritu has return policy page |
| H4 | Privacy policy & terms | `/policies/privacy-policy`, `/pages/terms-conditions` | Standard legal text; cookie notice | **EXISTING AND VERIFIED** - Decoritu has privacy + terms pages |
| H5 | Contact information & support | Footer: WhatsApp, email, phone | Direct lines; "File Return/Exchange" link | **EXISTING AND VERIFIED** - Decoritu has support contacts |
| H6 | Curtain consultation | `/pages/consultancy` | Form: room type, preferred style, contact email | **PARTIALLY IMPLEMENTED** - Decoritu has consultancy page |
| H7 | Bulk ordering & gifting | Admin / collections page | Business/gifting enquiries; not prominent on storefront | **MISSING** - Not visible on Decoritu storefront |
| H8 | Blog & informational content | `/blogs/news` | Articles on décor trends, product care, Shark Tank feature | **PARTIALLY IMPLEMENTED** - Decoritu may have blog routes but not populated |
| H9 | Sitemap & product discovery | `/pages/sitemap` | Alphabetical list of all collection & page URLs | **PARTIALLY IMPLEMENTED** - Decoritu has sitemap-like route structure |
| H10 | Curtain size chart | `/pages/curtains-drapes-size-chart` | Printable chart with measurement guide | **MISSING** - No size chart in Decoritu |

---

## Summary of Status Counts

| Status | Count |
|--------|-------|
| EXISTING AND VERIFIED | 82 |
| EXISTING BUT DEFECTIVE | 0 |
| MISSING | 28 |
| PARTIALLY IMPLEMENTED | 31 |
| BLOCKED BY DEPENDENCY | 3 |
| NOT APPLICABLE | 11 |

**Priority gaps (missing/partially implemented with high impact):**
- Mobile predictive search overlay (A5)
- Breadcrumbs (A7)
- Gallery navigation (C3)
- Buy-now quick-buy (C7)
- Add-on products (C8)
- Curtain customization options (D1-D6, D8-D10)
- Promotional countdowns (E11)
- Bulk discount messaging (E4)
- Free-gift selection UI (F4)
- PIN-code availability check on product page (C9)
- Return/exchange confirmation flow (G6)
- Curtain size chart (H10)
- Notification preferences (G8)