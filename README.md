# Decoritu

A premium home-décor storefront built with Next.js, React, Prisma and Tailwind CSS. The experience covers discovery, product detail, cart, guest or account checkout, order tracking, reviews, and a full admin dashboard.

> **Preview notice:** the repository ships with a sample catalogue, sample pricing and demo mode enabled. It does not represent a live store until real catalogue data, payment credentials, contact details and legal review are in place.

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 15.5 (App Router) |
| UI | React 19, Tailwind CSS 4, Lucide icons |
| Data | Prisma 6 + SQLite for local development |
| Validation | Zod 4 |
| Auth | Email/password, bcrypt, database sessions |
| Payments | Razorpay (optional), Cash on Delivery |
| Email | Resend (optional) |
| Tests | Vitest |

## Getting started

Requirements: Node.js 20+ and npm.

```bash
npm install
npx prisma db push
npm run db:seed
npm run dev
```

Open `http://localhost:3000`.

The seed creates 8 categories, the sample catalogue, settings, two coupons and an administrator account.

```text
Email:    admin@decoritu.in
Password: DecorituAdmin!2026
```

Change the admin password and `AUTH_SECRET` before deploying. `npm run db:seed` recreates product variants, so do not run it against a database with live orders.

### Environment

Copy `.env.example` to `.env` and adjust:

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | SQLite locally (`file:./dev.db`); PostgreSQL in production |
| `AUTH_SECRET` | Long random secret used for sessions and token hashing workflows |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Administrator created by the seed |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL used in metadata and sitemap |
| `NEXT_PUBLIC_DEMO_MODE` | `true` shows preview messaging; set `false` only for a real launch |
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` | Server-side Razorpay credentials |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Public Razorpay key used by checkout |
| `RESEND_API_KEY` / `ORDER_EMAIL_FROM` | Optional transactional email |

## Scripts

```bash
npm run dev          # development server
npm run build        # prisma generate + production build
npm run start        # production server
npm run lint         # ESLint
npm run typecheck    # TypeScript, no emit
npm test             # Vitest unit tests
npm run db:push      # apply Prisma schema
npm run db:seed      # seed sample catalogue and admin
npm run db:studio    # Prisma Studio
```

## What is included

### Storefront
- Editorial homepage with hero, collections, bestsellers, new arrivals and room inspiration.
- Category, curated collection, sale, new-arrival and bestseller pages.
- Search with live product results.
- Product pages with gallery, variants, stock, reviews, related pieces, recently viewed and structured data.
- Persistent cart and wishlist, plus complimentary-shipping progress.
- Contact form, newsletter signup, FAQs, shipping and returns, care guide, privacy and terms.

### Checkout and orders
- Guest and signed-in checkout.
- Saved addresses for signed-in customers.
- Server-side price, stock, coupon and shipping validation.
- Cash on Delivery, or Razorpay when credentials are configured.
- Private order confirmation using an access token.
- Order cancellation while processing, with stock restoration.
- Transactional order email when Resend is configured.

### Accounts
- Registration, login, logout, password reset flow.
- Profile, phone and password management.
- Address book with default address control.
- Order history, order detail and status timeline.
- Review history and settings.

### Admin
- Dashboard with revenue, orders, stock and moderation summaries.
- Order list and detail, payment/fulfilment status updates.
- Product create/edit, publishing flags, image fields and variant/inventory management.
- Category management, coupon management, review moderation.
- Contact inbox and newsletter subscriber list.
- Storefront settings for hero copy, announcements, support details, shipping and returns.

## Architecture

```text
src/app                 App Router pages, API route handlers, server actions
src/components          Storefront, account, checkout and admin UI
src/lib                 Auth, pricing, orders, payments, email, validation
src/lib/__tests__       Unit tests
prisma/schema.prisma    Data model
prisma/seed.ts          Sample catalogue and administrator
public/images           Locally hosted licensed photography
```

- Prices are stored as integer **paise**. `formatPrice()` renders INR.
- Server code recomputes every order total; client totals are presentation only.
- Auth sessions use SHA-256 token hashes in `httpOnly`, `sameSite=lax` cookies.
- Guest order access uses a hashed access token in the confirmation URL.
- Stock is decremented inside a transaction with a conditional update, reducing overselling under concurrency.
- Admin mutations use server actions guarded by `assertAdmin()`.
- Reviews are moderated and only verified purchasers can publish one per product.

## Production checklist

1. **Move to PostgreSQL.** Change `provider` in `prisma/schema.prisma` to `postgresql`, update `DATABASE_URL`, then run `npx prisma db push` (or a reviewed migration) against the production database.
2. **Replace preview data.** Seed or import the real catalogue, inventory, prices, categories, policies and support details. Set `NEXT_PUBLIC_DEMO_MODE="false"` only when the store is genuinely live.
3. **Rotate secrets.** Use a long random `AUTH_SECRET`, create a new admin password, and remove default credentials from deployment notes.
4. **Configure payments.** Add Razorpay server and public keys and test signature verification, failure handling and refunds in test mode before going live.
5. **Configure email.** Add Resend credentials and verify the sending domain. Confirm password-reset and order emails arrive.
6. **Set the canonical URL.** Set `NEXT_PUBLIC_SITE_URL` to the production HTTPS origin.
7. **Review legal copy.** Privacy, terms, shipping and returns pages are practical templates, not legal advice. Have them reviewed for the operating entity, grievance officer, tax treatment and jurisdiction.
8. **Replace placeholders.** Replace the social links and support email, and confirm the Jaipur studio wording and all image credits.
9. **Harden operations.** Use a shared rate-limit store (for example Redis) if deploying more than one instance, enable database backups, error monitoring and uptime checks.
10. **Run the gates.** `npm run lint`, `npm run typecheck`, `npm test` and `npm run build` must all pass before release.

## Known limitations

- SQLite is ideal for local development but not for multi-instance production traffic.
- Rate limiting is in-memory and therefore per process. Replace it with a shared store for scaled deployments.
- Razorpay and Resend are optional integrations; COD and the in-app order view work without them.
- The sample catalogue and photography are for preview. Confirm ownership or licensing before commercial use.
- Automated browser QA smoke tests can be run using `node .qa-smoke.mjs` against a running server. The Vitest test suite covers pricing, orders, address formatting, and input validation schemas.

## Image credits

Photography is sourced from [Unsplash](https://unsplash.com) under the Unsplash License and stored locally in `public/images`. Replace with owned product photography before launch.

---

© Decoritu. The name, interface and original editorial copy are part of this project.
