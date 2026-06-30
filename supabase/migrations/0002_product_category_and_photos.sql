-- Adds the product category and a public bucket for real product photos.
--
-- Run this against your Supabase project after 0001_init.sql (SQL editor or
-- the Supabase CLI). Safe to run more than once.

-- Category ------------------------------------------------------------------
-- Nullable text column so older rows stay valid; the seed populates it for
-- every product. Grouped on the shop page, so it is worth an index.
alter table public.products
  add column if not exists category text;

create index if not exists products_category_idx on public.products (category);

-- Public storage bucket for product photos ----------------------------------
-- Unlike the private payment-screenshots bucket, this one is public so the
-- storefront can render photos straight from their public URLs. Uploads still
-- happen server side with the service role (see scripts/upload-product-images.mjs).
insert into storage.buckets (id, name, public)
values ('products', 'products', true)
on conflict (id) do update set public = true;
