-- Maati & Co. storefront schema
-- One migration: products, orders, order_items, an atomic order RPC,
-- row level security, and the private screenshot bucket.
--
-- Run this against your Supabase project (SQL editor or the Supabase CLI).
-- See the README for the exact commands.

-- Extensions ----------------------------------------------------------------
create extension if not exists "pgcrypto";

-- Enums ---------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'order_status') then
    create type order_status as enum (
      'pending_payment',
      'paid',
      'shipped',
      'cancelled'
    );
  end if;
end
$$;

-- Tables --------------------------------------------------------------------
create table if not exists public.products (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  name        text not null,
  tagline     text,
  description text not null,
  price       integer not null check (price >= 0), -- smallest currency unit
  lot         text not null,
  sku         text not null,
  materials   text[] not null default '{}',
  dimensions  text,
  image_url   text,
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

create table if not exists public.orders (
  id                    uuid primary key default gen_random_uuid(),
  order_number          text not null unique, -- MTC-YYYY-NNNN
  customer_name         text not null,
  email                 text not null,
  phone                 text not null,
  address               text not null,
  city                  text not null,
  postal_code           text not null,
  subtotal              integer not null check (subtotal >= 0),
  total                 integer not null check (total >= 0),
  status                order_status not null default 'pending_payment',
  payment_screenshot_url text, -- storage object path inside payment-screenshots
  created_at            timestamptz not null default now()
);

create table if not exists public.order_items (
  id           uuid primary key default gen_random_uuid(),
  order_id     uuid not null references public.orders (id) on delete cascade,
  product_id   uuid references public.products (id),
  product_name text not null,    -- snapshot at purchase time
  unit_price   integer not null, -- snapshot at purchase time
  quantity     integer not null check (quantity > 0),
  line_total   integer not null check (line_total >= 0)
);

create index if not exists order_items_order_id_idx on public.order_items (order_id);
create index if not exists orders_created_at_idx on public.orders (created_at desc);
create index if not exists products_active_idx on public.products (active);

-- Atomic order placement ----------------------------------------------------
-- Generates the order number and inserts the order plus its items inside a
-- single transaction. security definer so it runs as the table owner and is
-- safe to call with the service role from the server. Prices are passed in by
-- the server only after it has re-fetched and recomputed them; this function
-- still recomputes line and order totals from the items to be safe.
create or replace function public.place_order(
  p_customer_name text,
  p_email text,
  p_phone text,
  p_address text,
  p_city text,
  p_postal_code text,
  p_screenshot_path text,
  p_items jsonb
)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order_id   uuid;
  v_year       text := to_char(now(), 'YYYY');
  v_seq        integer;
  v_number     text;
  v_subtotal   integer := 0;
  v_item       jsonb;
  v_line_total integer;
begin
  if p_items is null or jsonb_array_length(p_items) = 0 then
    raise exception 'Cannot place an order with no items';
  end if;

  -- Recompute the subtotal from the supplied (server-validated) line items.
  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_line_total := (v_item->>'unit_price')::integer * (v_item->>'quantity')::integer;
    v_subtotal := v_subtotal + v_line_total;
  end loop;

  -- Serialise order number generation so two concurrent orders never collide.
  perform pg_advisory_xact_lock(hashtext('maati_order_number'));

  select coalesce(max((split_part(order_number, '-', 3))::integer), 0) + 1
    into v_seq
  from public.orders
  where order_number like 'MTC-' || v_year || '-%';

  v_number := 'MTC-' || v_year || '-' || lpad(v_seq::text, 4, '0');

  insert into public.orders (
    order_number, customer_name, email, phone, address, city, postal_code,
    subtotal, total, status, payment_screenshot_url
  )
  values (
    v_number, p_customer_name, p_email, p_phone, p_address, p_city, p_postal_code,
    v_subtotal, v_subtotal, 'pending_payment', p_screenshot_path
  )
  returning id into v_order_id;

  insert into public.order_items (
    order_id, product_id, product_name, unit_price, quantity, line_total
  )
  select
    v_order_id,
    (item->>'product_id')::uuid,
    item->>'product_name',
    (item->>'unit_price')::integer,
    (item->>'quantity')::integer,
    (item->>'unit_price')::integer * (item->>'quantity')::integer
  from jsonb_array_elements(p_items) as item;

  return v_number;
end;
$$;

-- Lock the RPC down: only the service role may execute it.
revoke all on function public.place_order(
  text, text, text, text, text, text, text, jsonb
) from public, anon, authenticated;
grant execute on function public.place_order(
  text, text, text, text, text, text, text, jsonb
) to service_role;

-- Row level security --------------------------------------------------------
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Products: anyone may read the active ones. Writes happen via the service role.
drop policy if exists "products_public_read_active" on public.products;
create policy "products_public_read_active"
  on public.products
  for select
  to anon, authenticated
  using (active = true);

-- Orders: no anon access at all. The authenticated admin may read every order
-- and update its status. Inserts only ever happen through place_order /
-- service role, which bypasses RLS.
drop policy if exists "orders_admin_read" on public.orders;
create policy "orders_admin_read"
  on public.orders
  for select
  to authenticated
  using (true);

drop policy if exists "orders_admin_update" on public.orders;
create policy "orders_admin_update"
  on public.orders
  for update
  to authenticated
  using (true)
  with check (true);

-- Order items: same shape. Admin read only; writes via service role.
drop policy if exists "order_items_admin_read" on public.order_items;
create policy "order_items_admin_read"
  on public.order_items
  for select
  to authenticated
  using (true);

-- Private storage bucket for payment screenshots ----------------------------
-- The bucket is private. Uploads happen server side with the service role and
-- the company views screenshots through short lived signed URLs, so no public
-- storage policies are added.
insert into storage.buckets (id, name, public)
values ('payment-screenshots', 'payment-screenshots', false)
on conflict (id) do nothing;
