# Maati & Co. storefront

A small production e-commerce app for a studio that sells handmade goods in
small lots, in the spirit of a tiny Shopify store. Customers browse a catalogue,
add pieces to a cart, and check out by bank transfer with a payment screenshot.
The studio verifies each payment and updates order status from a protected admin
area.

## Stack

- Next.js (App Router, TypeScript)
- Supabase Postgres (data), Supabase Storage (payment screenshots), Supabase
  Auth (admin login)
- Nodemailer over Gmail SMTP (transactional email)
- Tailwind CSS v4
- Deploy target: Vercel

## How it fits together

- The storefront (home, shop, product, cart, checkout, confirmation) is public.
- The cart lives client side in a React context backed by `localStorage`, so it
  survives reloads. Everything else is server backed.
- Placing an order is a server action. It never trusts client totals: it
  re-fetches every product price from the database, recomputes the totals,
  uploads the screenshot to a private bucket, inserts the order and its items
  atomically through a Postgres function, then emails the customer and the
  studio.
- Order line items snapshot the product name and price at purchase time, so old
  orders stay correct even if a product later changes.
- The admin area is behind Supabase Auth and lists orders newest first, with
  items, delivery details, the payment screenshot via a signed URL, and a status
  control.

## Project layout

```
supabase/
  migrations/0001_init.sql   tables, RLS, the place_order RPC, storage bucket
  seed.sql                   the six products
src/
  app/                       App Router pages, the order action, the admin area
  components/                cart context and shared UI
  lib/                       supabase clients, config, money, email, types
```

## 1. Install

```bash
npm install
```

## 2. Configure environment

Copy the example and fill in real values:

```bash
cp .env.local.example .env.local
```

| Variable | Where it is used | Public? |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Order flow and admin screenshot signing | no, server only |
| `EMAIL_USER` | Gmail address that sends order email | no, server only |
| `EMAIL_PASS` | Gmail App Password for that address | no, server only |
| `COMPANY_NOTIFICATION_EMAIL` | Where new-order alerts are sent (defaults to `EMAIL_USER`) | no, server only |
| `BANK_ACCOUNT_NAME` | Shown on the checkout panel | no, server only |
| `BANK_ACCOUNT_NUMBER` | Shown on the checkout panel | no, server only |
| `BANK_IBAN` | Shown on the checkout panel | no, server only |
| `EASYPAISA_ACCOUNT` | Optional Easypaisa account (hidden if blank) | no, server only |
| `JAZZCASH_ACCOUNT` | Optional JazzCash account (hidden if blank) | no, server only |
| `NEXT_PUBLIC_CURRENCY_SYMBOL` | Currency symbol, defaults to `$` | yes |
| `NEXT_PUBLIC_SITE_URL` | Base URL used in email links | yes |

The service role key and the Gmail credentials are server only and are never
sent to the browser. The `admin.ts` and `email.ts` modules import `server-only`,
so the build fails if either is ever pulled into a client bundle.

## 3. Create the database

In the Supabase dashboard, create a project, then open the SQL editor and run,
in order:

1. `supabase/migrations/0001_init.sql`
2. `supabase/seed.sql`

The migration creates the three tables, the `order_status` enum, row level
security policies, the `place_order` function, and the private
`payment-screenshots` storage bucket.

If you prefer the Supabase CLI:

```bash
supabase db execute --file supabase/migrations/0001_init.sql
supabase db execute --file supabase/seed.sql
```

### Row level security, in short

- `products`: anyone can read rows where `active = true`. Writes are done with
  the service role.
- `orders` and `order_items`: no anonymous access. The authenticated admin can
  read all of them and update order status. Inserts only ever happen through the
  `place_order` function, called with the service role.
- The `payment-screenshots` bucket is private. Uploads happen server side; the
  studio views screenshots through short lived signed URLs.

## 4. Create the admin user

In the Supabase dashboard, go to Authentication and add a user with an email and
password. Any authenticated user is treated as the admin (a single user is
enough). Sign in at `/admin/login`.

If you do not want public sign-ups, disable them under Authentication settings;
the app never exposes a sign-up form.

## 5. Set up Gmail SMTP

Order email is sent with Nodemailer over Gmail SMTP. On the Gmail account you
want to send from:

1. Turn on 2-step verification at
   `https://myaccount.google.com/security`.
2. Create an App Password at `https://myaccount.google.com/apppasswords`. Google
   gives you a 16 character password.
3. Set `EMAIL_USER` to the Gmail address and `EMAIL_PASS` to that App Password.
   Set `COMPANY_NOTIFICATION_EMAIL` to wherever the studio wants new-order
   alerts (it defaults to `EMAIL_USER` if left blank).

The transporter is created once and reused. Emails are sent only after the order
is saved, and if sending fails the order is kept, the error is logged, and the
customer still gets a successful response.

## 6. Run locally

```bash
npm run dev
```

Visit `http://localhost:3000`. Place a test order, then sign in at
`/admin/login` to see it.

## Deploy to Vercel

1. Push this repository to GitHub.
2. In Vercel, import the repository. The framework preset is detected as
   Next.js; no build settings change is needed.
3. Add every environment variable from the table above in the Vercel project
   settings (Production and Preview). Set `NEXT_PUBLIC_SITE_URL` to the deployed
   URL.
4. Deploy. Run the migration and seed against your Supabase project (steps 3 and
   4 above) if you have not already.

## Currency and the Pakistani client switch

Currency is a single config value. By default `NEXT_PUBLIC_CURRENCY_SYMBOL` is
`$`. To switch the whole store to Pakistani rupees:

1. Set `NEXT_PUBLIC_CURRENCY_SYMBOL=Rs`. Prices format as `Rs 2,400`.
2. Set `EASYPAISA_ACCOUNT` and `JAZZCASH_ACCOUNT`. When either is set it appears
   as its own transfer panel next to the bank account on the checkout page, so
   customers can pay by Easypaisa or JazzCash as well as bank transfer.

No code change is needed for either switch.

## Notes

- Prices are stored as integers in the smallest currency unit (cents), so `$24`
  is `2400`.
- Product images are inline SVG line-art for now, keyed to each product type.
  Set a product's `image_url` to a real photo to swap it in with no code change.
- There are no em dashes in this project's code, copy, or docs, by design.
