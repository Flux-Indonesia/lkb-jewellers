# LKB Jewellers — Project Mapping
> Full technical bible for AI agents working on this codebase.
> Last updated: 2026-04-29

---

## STACK

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) + React 19 + TypeScript 5 |
| Styling | Tailwind CSS 4 + shadcn/ui (Radix UI) |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase SSR (users) + httpOnly cookie (admin) |
| Payments | Stripe (GBP) |
| CRM | Go High Level (GHL) webhooks |
| Email | Nodemailer + Hostinger SMTP |
| AI | Google Gemini 2.0 Flash (bespoke design generator) |
| Animation | Framer Motion |
| Hosting | Hostinger (production) + Vercel (staging) |
| Notifications | Sonner (toast) |
| Export | jsPDF + xlsx |

---

## ENVIRONMENT VARIABLES

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://ttiwmcrfahbczzehmyds.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Admin
ADMIN_PASSWORD=
SEO_PASSWORD=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Email (Hostinger SMTP)
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_USER=noreply@lkbjewellers.com
SMTP_PASS=
ADMIN_EMAIL=noreply@lkbjewellers.com

# AI
GEMINI_API_KEY=

# GHL Ring Webhook (optional, has hardcoded fallback)
GHL_RING_WEBHOOK_URL=

# App
NEXT_PUBLIC_BASE_URL=https://www.lkbjewellers.com
```

---

## FOLDER STRUCTURE

```
src/
├── app/                          # Next.js App Router
│   ├── (public pages)
│   │   ├── page.tsx              # Homepage
│   │   ├── shop/
│   │   │   ├── page.tsx          # All products
│   │   │   └── [brand]/page.tsx  # Brand-filtered shop (rolex, cartier, etc.)
│   │   ├── product/
│   │   │   └── [...segments]/    # Catch-all product detail + layout
│   │   ├── engagement-rings/
│   │   │   ├── page.tsx          # Ring listing
│   │   │   └── [slug]/page.tsx   # Ring detail (SSG, revalidate: 3600)
│   │   ├── watches/page.tsx
│   │   ├── jewellery/page.tsx
│   │   ├── accessories/page.tsx
│   │   ├── about/page.tsx
│   │   ├── about/our-boutique/page.tsx
│   │   ├── blog/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── services/page.tsx
│   │   ├── servicing/page.tsx
│   │   ├── bespoke/page.tsx
│   │   ├── bespoke/design/page.tsx  # Gemini AI design generator
│   │   ├── we-buy/page.tsx
│   │   ├── hall-of-fame/page.tsx
│   │   ├── delivery-policy/page.tsx
│   │   ├── returns-policy/page.tsx
│   │   ├── privacy-policy/page.tsx
│   │   └── terms-and-conditions/page.tsx
│   ├── (auth pages)
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   ├── forgot-password/page.tsx
│   │   └── reset-password/page.tsx
│   ├── (protected pages)
│   │   ├── checkout/page.tsx
│   │   ├── checkout/success/page.tsx
│   │   ├── profile/page.tsx
│   │   ├── orders/page.tsx
│   │   └── dashboard/page.tsx    # Admin dashboard
│   ├── api/
│   │   ├── auth/                 # Admin + user auth
│   │   ├── enquiry/route.ts      # Product enquiry → GHL
│   │   ├── enquiry/ring/route.ts # Ring enquiry → GHL
│   │   ├── checkout/route.ts     # Stripe checkout session
│   │   ├── checkout/verify/      # Verify Stripe session
│   │   ├── checkout/quote/       # Shipping quote
│   │   ├── webhook/route.ts      # Stripe webhook
│   │   ├── cart/route.ts         # Cart sync
│   │   ├── orders/route.ts       # User orders
│   │   ├── contact/route.ts      # Contact form
│   │   ├── newsletter/route.ts   # Newsletter signup
│   │   ├── sell-submission/      # Sell items form
│   │   ├── rings/listing/        # Paginated rings API
│   │   ├── rings/list/           # All rings
│   │   ├── rings/images/         # Ring image management
│   │   ├── rings/preferences/    # Ring color preferences
│   │   ├── rings/update/         # Admin ring update
│   │   ├── design-generator/     # Save bespoke lead
│   │   ├── design-generator/generate/ # Gemini AI image gen
│   │   ├── seo/route.ts          # Product SEO
│   │   ├── seo/primary/          # Site settings
│   │   ├── seo/faqs/             # Product FAQs
│   │   └── export/route.ts       # CSV/Excel export
│   ├── sitemap.ts                # Dynamic sitemap (572 URLs)
│   └── robots.ts                 # robots.txt
├── components/
│   ├── ui/                       # shadcn components
│   ├── engagement-rings/
│   │   ├── engagement-rings-content.tsx
│   │   ├── filter-bar.tsx
│   │   ├── ring-card.tsx
│   │   ├── ring-listing-card.tsx  # Passes filter params to detail URL
│   │   ├── ring-detail-content.tsx
│   │   ├── image-gallery.tsx
│   │   ├── ring-configurator.tsx  # Shape/metal/size/gemstone selector
│   │   └── ring-enquiry-modal.tsx # Ring-specific enquiry form
│   ├── dashboard/
│   │   ├── engagement-rings/EngagementRingsTab.tsx
│   │   ├── engagement-rings/RingEditForm.tsx
│   │   ├── engagement-rings/RingImageManager.tsx
│   │   └── seo/SeoTab.tsx
│   ├── navbar.tsx
│   ├── footer.tsx
│   ├── app-shell.tsx
│   ├── enquiry-modal.tsx          # Watches/jewellery enquiry form
│   ├── product-card.tsx
│   ├── related-products.tsx
│   ├── shop-content.tsx
│   ├── showroom-section.tsx
│   ├── breadcrumb.tsx
│   ├── json-ld.tsx
│   ├── floating-buttons.tsx
│   └── three-d-carousel.tsx
├── lib/
│   ├── supabase.ts               # Browser client
│   ├── supabase-server.ts        # Server client (SSR)
│   ├── supabase-rings.ts         # Ring queries
│   ├── products.ts               # Product CRUD
│   ├── contacts.ts               # Contact CRUD + Contact interface
│   ├── orders.ts                 # Order queries
│   ├── orders-service.ts         # Stripe → Supabase fulfillment
│   ├── sell-submissions.ts
│   ├── newsletter.ts
│   ├── cart.ts
│   ├── ring-filters.ts           # Filter parsing/serialization
│   ├── ring-preferences.ts
│   ├── gemstone-utils.ts
│   ├── checkout-pricing.ts
│   ├── shipping.ts
│   ├── admin-auth.ts
│   ├── rate-limit.ts
│   ├── email.ts
│   ├── utils.ts
│   └── product-url.ts            # productUrl() helper
├── data/
│   ├── products.ts               # Product interface + nav menu data
│   ├── engagement-rings.ts       # Ring interface + RING_METAL_OPTIONS etc.
│   ├── gemstone-options.ts       # Stone types, clarity, carat, colour
│   └── ring-filters.ts           # shapeOptions, metalOptions, settingStyleOptions, etc.
├── context/
│   ├── auth-context.tsx          # Admin + user auth state
│   └── cart-context.tsx          # Cart state (local + Supabase)
└── middleware.ts                 # Rate limiting + admin auth check
```

---

## DATABASE SCHEMA

### `products`
```
id (uuid PK), _id, name, price, category, brand, image, images (text[]),
description, tags, featured, stock, model, case_size, case_material,
dial_color, year_of_production, slug,
meta_title, meta_description, meta_keywords, canonical_url,
og_title, og_description, og_image, h1_override, image_alt_text,
noindex, nofollow, created_at, updated_at
```
- `category` values: `watch`, `luxury-jewellery`, `merchandise`
- `slug` = `brand-name` format, unique, used for clean URLs

### `engagement_rings`
```
id (uuid PK), slug, name, title, description, base_price (numeric), currency,
shape, setting_style, band_type, setting_profile, is_active,
meta_title, meta_description, meta_keywords, canonical_url,
og_title, og_description, og_image, h1_override,
noindex, nofollow, created_at, updated_at
```
- 225 rings total
- `shape`: round | oval | emerald | radiant | pear | cushion | elongated_cushion | marquise | princess | asscher
- `setting_style`: trilogy | solitaire | halo | toi_et_moi
- `band_type`: plain | pave | accents
- `setting_profile`: high_set | low_set

### `engagement_ring_specs`
```
id, ring_id (FK), band_width, center_stone_size, estimated_weight,
avg_side_stones, claws_count, resizable
```

### `engagement_ring_images`
```
id, ring_id (FK), image_url, _order
```

### `ring_image_preferences`
```
id, user_id (FK), ring_id (FK), color (yellow|white|rose), thumbnail_url, hover_url
```

### `contacts`
```
id (uuid PK), first_name, last_name, email, phone,
interest, message, preferred_contact_method, notes,
product_id, product_name, product_price, product_category, product_image, product_brand,
visited_other_dealers (bool), other_dealer_name, other_dealer_price,
opted_out_newsletter (bool),
ring_metal, ring_side_stones, ring_setting, ring_size,
ring_shape, ring_setting_style, ring_band_type,
ring_stone_type, ring_clarity, ring_carat_range, ring_colour, ring_certificate,
status (new|read|contacted|closed), created_at, updated_at
```
- `interest` values: `Product Enquiry` | `Engagement Ring Enquiry`
- Ring fields only populated for ring enquiries

### `orders`
```
id (uuid PK), payment_intent_id, amount, currency, status,
customer_email, customer_first_name, customer_last_name, customer_phone,
address_line1, address_line2, city, state, postal_code, country,
delivery_type (deliver|collect), notes (jsonb), created_at, updated_at
```

### `cart_items`
```
id, user_id (FK), product_id, name, price, image, quantity, created_at, updated_at
```

### `newsletter`
```
id, email (UNIQUE), name, subscribed_at
```

### `sell_submissions`
```
id, first_name, last_name, email, phone, brand, model,
case_material, case_size, dial_color, movement, condition,
proof_of_authenticity, documents_url, estimated_price,
message, contact_method, status, created_at, updated_at
```

### `design_generator_leads`
```
id, name, email, phone, design_description, generated_image,
metal, stone, style, created_at
```

### `product_faqs`
```
id, product_id, product_type (ring|product), question, answer,
sort_order, is_active
```

### `site_settings`
```
id, key, value, updated_at
```

---

## API ROUTES

### Auth
| Method | Route | Description |
|---|---|---|
| POST | `/api/auth` | Admin login (password → session cookie) |
| GET | `/api/auth/check` | Verify admin session |
| POST | `/api/auth/logout` | Clear session cookie |
| POST | `/api/auth/login` | User login (Supabase) |
| POST | `/api/auth/signup` | User signup (Supabase) |
| GET | `/api/auth/callback` | OAuth callback |

### Enquiry
| Method | Route | Description |
|---|---|---|
| POST | `/api/enquiry` | Product enquiry → DB + GHL webhook + email |
| POST | `/api/enquiry/ring` | Ring enquiry → DB + GHL webhook + email |

### Products/Rings
| Method | Route | Description |
|---|---|---|
| GET | `/api/rings/listing` | Paginated rings (filters: shape, metal, settingStyle, bandType, settingProfile) |
| GET | `/api/rings/list` | All rings unfiltered |
| GET/POST | `/api/rings/images` | Ring image management |
| GET/POST | `/api/rings/preferences` | User ring color preferences |
| GET/PATCH | `/api/rings/update` | Admin: update ring + specs |

### Commerce
| Method | Route | Description |
|---|---|---|
| GET/PUT | `/api/cart` | Get/sync user cart |
| POST | `/api/checkout` | Create Stripe checkout session |
| GET | `/api/checkout/verify` | Verify Stripe session |
| POST | `/api/checkout/quote` | Shipping quote |
| POST | `/api/webhook` | Stripe webhook (order fulfillment) |
| GET/POST/PATCH | `/api/orders` | User orders |

### Forms
| Method | Route | Description |
|---|---|---|
| POST | `/api/contact` | Contact form |
| POST | `/api/newsletter` | Newsletter signup |
| POST | `/api/sell-submission` | Sell item form |

### Admin
| Method | Route | Description |
|---|---|---|
| GET | `/api/export` | Export CSV/Excel (orders, contacts, newsletter, sell) |
| GET/POST | `/api/seo` | Product SEO metadata |
| GET/PATCH | `/api/seo/primary` | Site-level SEO settings |
| GET/POST/PATCH/DELETE | `/api/seo/faqs` | Product/ring FAQs |

### AI
| Method | Route | Description |
|---|---|---|
| POST | `/api/design-generator` | Save bespoke design lead |
| POST | `/api/design-generator/generate` | Gemini AI image generation |

---

## GHL WEBHOOKS

### Product/Watches Enquiry
```
URL: https://services.leadconnectorhq.com/hooks/uQOTLWm2nM7tGBm8XYTA/webhook-trigger/b9a14ac2-3915-4230-9d03-67c22f0d97b5

Payload:
{
  firstName, lastName, email, phone, message,
  source: "LKB Website Enquiry",
  product_name, product_category, product_brand, product_price,
  preferred_contact_method,
  visited_other_dealers, other_dealer_name, other_dealer_price,
  opted_out_newsletter
}
```

### Ring Enquiry
```
URL: https://services.leadconnectorhq.com/hooks/uQOTLWm2nM7tGBm8XYTA/webhook-trigger/6101b4b6-7a2a-4df0-9017-fe96456456d2

Payload: above + {
  source: "LKB Website Ring Enquiry",
  ring_name, ring_price,
  ring_metal, ring_side_stones, ring_setting, ring_size,
  ring_shape, ring_setting_style, ring_band_type,
  ring_stone_type, ring_clarity, ring_carat_range, ring_colour, ring_certificate
}
```

---

## URL STRUCTURE

### Public
```
/                              Homepage
/shop                          All products
/shop/[brand]                  Brand shop (rolex|audemars-piguet|cartier|patek-philippe|richard-mille)
/product/[brand]/[slug]        Product detail (canonical)
/product/[slug]                Product detail (legacy, redirects to canonical)
/engagement-rings              Ring listing
/engagement-rings/[slug]       Ring detail
/watches                       Watches category
/jewellery                     Jewellery category
/accessories                   Accessories category
/about                         About us
/about/our-boutique            Our boutique
/blog                          Blog
/contact                       Contact
/services                      Services
/servicing                     Watch servicing
/bespoke                       Bespoke jewellery
/bespoke/design                AI design generator
/we-buy                        Sell to us
/hall-of-fame                  Client gallery
/delivery-policy               Delivery info
/returns-policy                Returns
/privacy-policy                Privacy
/terms-and-conditions          T&C
/legal                         Legal
```

### Protected
```
/checkout                      Checkout (Supabase auth)
/checkout/success              Order confirmation
/profile                       User profile
/orders                        User order history
/login                         Login
/signup                        Signup
/forgot-password               Password reset request
/reset-password                Password reset
/dashboard                     Admin dashboard (cookie auth)
```

---

## KEY HELPERS

### `productUrl(product)` — `src/lib/product-url.ts`
Generates canonical product URL.
```ts
productUrl({ id, brand, seo }) → "/product/rolex/rolex-cosmograph-daytona-40"
```
**Always use this** when linking to products. Never construct product URLs manually.

### `parseFiltersFromURL(searchParams)` — `src/lib/ring-filters.ts`
Parses ring filter query params into `ActiveFilters` object.

### `filtersToURL(filters)` — `src/lib/ring-filters.ts`
Serializes `ActiveFilters` back to query string.

---

## PRODUCT URL PATTERN
- Slug format: `[brand]-[name]` e.g. `rolex-cosmograph-daytona-40`
- Slugs stored in `products.slug` column
- Lookup: try slug first, fallback to id
- Canonical URL enforced via client-side redirect in `[...segments]/page.tsx`

---

## RING FILTER → CONFIGURATOR MAPPING

Filter page uses `value` keys (lowercase/underscore), configurator uses display labels:

| Filter value | Configurator label |
|---|---|
| `platinum` | `Platinum` |
| `yellow_gold` | `18k Yellow Gold` |
| `rose_gold` | `18k Rose Gold` |
| `white_gold` | `18k White Gold` |
| `9k_yellow_gold` | `9k Yellow Gold` |
| `9k_rose_gold` | `9k Rose Gold` |
| `9k_white_gold` | `9k White Gold` |
| `palladium` | `Palladium` |
| `high_set` | `High Setting` |
| `low_set` | `Low Setting` |

Filter params passed via URL when navigating from listing → detail page.

---

## AUTHENTICATION FLOWS

### Admin
1. POST `/api/auth` with password
2. Server validates against `ADMIN_PASSWORD` or `SEO_PASSWORD`
3. Sets `admin_session` httpOnly cookie (7 days)
4. All `/dashboard` and admin API routes check this cookie

### User (Supabase)
1. POST `/api/auth/login` or `/api/auth/signup`
2. Supabase JWT stored in session
3. `auth-context.tsx` exposes `user` and `isAdmin` state
4. Protected routes check Supabase session

---

## RATE LIMITING (middleware.ts)

| Endpoint | Limit |
|---|---|
| Global | 30 req/min |
| `/api/auth/login` | 5 req/min |
| `/api/checkout` | 10 req/min |
| `/api/design-generator/generate` | 5 req/min |
| `/api/enquiry`, `/api/newsletter`, `/api/sell-submission` | 5 req/min |

---

## BRANCHES

| Branch | Deployment | Purpose |
|---|---|---|
| `main` | Hostinger (production) | Live site |
| `staging` | Vercel | Testing before production |

**Workflow**: develop on `staging` → test → merge to `main` → deploy to Hostinger.

---

## IMPORTANT RULES FOR AI AGENTS

1. **Never construct product URLs manually** — always use `productUrl()` from `src/lib/product-url.ts`
2. **Never modify rings webhook** — rings use `/api/enquiry/ring`, watches use `/api/enquiry`
3. **DB columns for ring fields** — ring enquiry data goes in dedicated columns (`ring_metal`, `ring_size`, etc.), NOT in the `notes` JSON field
4. **Supabase client** — use `supabase-server.ts` in server components/routes, `supabase.ts` in client components
5. **Admin auth** — cookie-based, separate from Supabase user auth. Check `admin-auth.ts`
6. **Filter values vs display labels** — ring filter values use `snake_case`, configurator uses display strings. See mapping table above
7. **Slugs** — always slug-first lookup with id fallback in both `getProductById()` and layout `findProduct()`
8. **GHL webhooks** — sent non-blocking via `Promise.allSettled()`, never block the response
9. **Do not commit** until user confirms
10. **Do not push** until user confirms

---

## SITEMAP
- Location: `src/app/sitemap.ts`
- Generated dynamically at build time
- 572 URLs total: 18 static + ~328 products + ~226 rings
- Submitted to Google Search Console: https://www.lkbjewellers.com/sitemap.xml
