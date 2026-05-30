-- ============================================================
-- 001_initial_schema.sql
-- Full schema + RLS applied atomically.
-- Run in Supabase SQL Editor or via: supabase db push
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ────────────────────────────────────────────────────────────
-- COLLECTIONS
-- Future product families: belts, folios, etc.
-- ────────────────────────────────────────────────────────────
create table public.collections (
  id            uuid primary key default uuid_generate_v4(),
  name          text not null,
  slug          text not null unique,
  teaser_copy   text,
  release_date  date,
  is_visible    boolean not null default false,
  created_at    timestamptz not null default now()
);

alter table public.collections enable row level security;

create policy "collections: public read visible"
  on public.collections for select
  using (is_visible = true);

-- ────────────────────────────────────────────────────────────
-- PRODUCTS
-- ────────────────────────────────────────────────────────────
create table public.products (
  id            uuid primary key default uuid_generate_v4(),
  slug          text not null unique,
  name          text not null,
  description   text not null,
  price_cents   integer not null check (price_cents > 0),
  currency      text not null default 'USD',
  images        jsonb not null default '[]',
  material      text not null,
  dimensions    jsonb not null default '{}',
  card_capacity integer not null,
  is_active     boolean not null default true,
  collection_id uuid references public.collections(id),
  created_at    timestamptz not null default now()
);

alter table public.products enable row level security;

create policy "products: public read active"
  on public.products for select
  using (is_active = true);

-- ────────────────────────────────────────────────────────────
-- PROFILES (extends auth.users)
-- ────────────────────────────────────────────────────────────
create table public.profiles (
  id                  uuid primary key references auth.users(id) on delete cascade,
  full_name           text,
  shipping_addresses  jsonb not null default '[]',
  created_at          timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles: owner read"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles: owner update"
  on public.profiles for update
  using (auth.uid() = id);

create policy "profiles: owner insert"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ────────────────────────────────────────────────────────────
-- WAITLIST (email capture — Horizon section)
-- ────────────────────────────────────────────────────────────
create table public.waitlist (
  id          uuid primary key default uuid_generate_v4(),
  email       text not null unique,
  created_at  timestamptz not null default now()
);

alter table public.waitlist enable row level security;

-- Anyone can insert their email; only service role can read
create policy "waitlist: anyone can insert"
  on public.waitlist for insert
  with check (true);

-- ────────────────────────────────────────────────────────────
-- ORDERS
-- ────────────────────────────────────────────────────────────
create table public.orders (
  id               uuid primary key default uuid_generate_v4(),
  user_id          uuid not null references auth.users(id) on delete restrict,
  status           text not null default 'pending'
                     check (status in ('pending','confirmed','shipped','delivered','cancelled')),
  total_cents      integer not null check (total_cents >= 0),
  currency         text not null default 'USD',
  shipping_address jsonb not null,
  created_at       timestamptz not null default now()
);

alter table public.orders enable row level security;

create policy "orders: owner read"
  on public.orders for select
  using (auth.uid() = user_id);

create policy "orders: owner insert"
  on public.orders for insert
  with check (auth.uid() = user_id);

-- ────────────────────────────────────────────────────────────
-- ORDER ITEMS
-- ────────────────────────────────────────────────────────────
create table public.order_items (
  id                uuid primary key default uuid_generate_v4(),
  order_id          uuid not null references public.orders(id) on delete cascade,
  product_id        uuid not null references public.products(id) on delete restrict,
  quantity          integer not null check (quantity > 0),
  unit_price_cents  integer not null check (unit_price_cents > 0),
  variant           jsonb
);

alter table public.order_items enable row level security;

create policy "order_items: owner read via order"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
        and orders.user_id = auth.uid()
    )
  );

create policy "order_items: owner insert via order"
  on public.order_items for insert
  with check (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
        and orders.user_id = auth.uid()
    )
  );

-- ────────────────────────────────────────────────────────────
-- SEED: Flagship Wallet Product
-- ────────────────────────────────────────────────────────────
insert into public.products (
  slug, name, description, price_cents, currency,
  images, material, dimensions, card_capacity, is_active
) values (
  'no-1-slim-wallet',
  'No. 1 Slim Wallet',
  'Constructed from a single piece of full-grain vegetable-tanned leather, the No. 1 requires no breaking-in period — it arrives already supple, already yours. Six cards. Two slip pockets. A profile so slim it disappears into your jacket pocket. This is the wallet as it should have always been made.',
  29500,
  'USD',
  '[
    {"url": "/wallet_main.jpg", "alt": "No. 1 Slim Wallet — Espresso, front view on dark surface"},
    {"url": "https://images.unsplash.com/photo-1614330315994-efd5ea8163a1?w=1600&q=90", "alt": "No. 1 Slim Wallet — open, showing card capacity"},
    {"url": "https://images.unsplash.com/photo-1614267118647-20c5ffa6a6e4?w=1600&q=90", "alt": "No. 1 Slim Wallet — artisan crafting workshop details"},
    {"url": "https://images.unsplash.com/photo-1571829604981-ea159f94e5ad?w=1600&q=90", "alt": "No. 1 Slim Wallet — texture close-up"}
  ]'::jsonb,
  'Full-grain vegetable-tanned leather, linen thread edge stitching, burnished natural edge',
  '{"width_mm": 95, "height_mm": 72, "depth_mm": 6.2}'::jsonb,
  6,
  true
);

insert into public.products (
  slug, name, description, price_cents, currency,
  images, material, dimensions, card_capacity, is_active
) values (
  'pluto',
  'The Pluto Bi-Fold',
  'Combining a clean bi-fold shape with rich leather tone, Pluto brings ease and elegance to your essentials. Lightweight yet sturdy, it delivers the kind of dependability and class you expect from a quality men’s wallet.',
  16500,
  'USD',
  '[
    {"url": "https://obipelle.com/cdn/shop/files/Pluto-Midnight-Black-f1.webp", "alt": "The Pluto Bi-Fold — Midnight Black close-up"},
    {"url": "https://obipelle.com/cdn/shop/files/Pluto-Midnight-Black-f2.webp", "alt": "The Pluto Bi-Fold — interior details"},
    {"url": "https://obipelle.com/cdn/shop/files/Pluto-GBF1.png", "alt": "The Pluto Bi-Fold — Geneva Brown detail"},
    {"url": "https://obipelle.com/cdn/shop/files/Pluto-GBF2.png", "alt": "The Pluto Bi-Fold — open brown layout"}
  ]'::jsonb,
  'Premium full-grain vegetable-tanned leather with soft satin lining',
  '{"width_mm": 110, "height_mm": 90, "depth_mm": 12.0}'::jsonb,
  8,
  true
), (
  'holly',
  'The Holly Compact',
  'Soft yet structured, Holly is a compact wallet built for daily function. The vegetable tanned leather construction offers durability, while the simple bi-fold format keeps your card and cash safe. Among the most trusted wallets, Holly fits neatly into any pocket.',
  14500,
  'USD',
  '[
    {"url": "https://obipelle.com/cdn/shop/files/Holly-Geneva-Brown-f1.png", "alt": "The Holly Compact — Geneva Brown front view"},
    {"url": "https://obipelle.com/cdn/shop/files/Holly-Midnight-Black-f1.webp", "alt": "The Holly Compact — Midnight Black front view"}
  ]'::jsonb,
  'Full-grain vegetable-tanned leather, heavy-duty waxed nylon stitching',
  '{"width_mm": 105, "height_mm": 80, "depth_mm": 10.0}'::jsonb,
  6,
  true
), (
  'rio',
  'The Rio Symmetrical',
  'Sleek and symmetrical, the Rio wallet adds structure to your everyday with a premium finish and hidden interior coin pocket. Built from durable leather, this timeless wallet is crafted for those who appreciate fine details and everyday dependability.',
  19500,
  'USD',
  '[
    {"url": "https://obipelle.com/cdn/shop/files/Rio-GBF1.png", "alt": "The Rio Symmetrical — Geneva Brown front view"},
    {"url": "https://obipelle.com/cdn/shop/files/Rio-Midnight-Black-f1.webp", "alt": "The Rio Symmetrical — Midnight Black front view"}
  ]'::jsonb,
  'Durable top-tier aniline leather, hand-burnished edges, internal coin pocket lining',
  '{"width_mm": 115, "height_mm": 95, "depth_mm": 14.0}'::jsonb,
  8,
  true
), (
  'magic',
  'The Magic Folding Wallet',
  'The Magic wallet series reimagines how you carry – with innovating folding, German-engineered elastic, and dual slot compartments for both coins and cards. These are the wallets that blend function, fashion, and long-lasting flexibility.',
  22000,
  'USD',
  '[
    {"url": "https://obipelle.com/cdn/shop/files/Magic-Midnight-Black-1.webp", "alt": "The Magic Folding Wallet — Midnight Black close-up"},
    {"url": "https://obipelle.com/cdn/shop/files/1_50680c9d-42e0-411b-ab3e-d0aebd4d6263.png", "alt": "The Magic Folding Wallet — Geneva Brown layout"}
  ]'::jsonb,
  'Full-grain hide with German-engineered cross-elastic straps and quick-draw pull tabs',
  '{"width_mm": 100, "height_mm": 75, "depth_mm": 8.5}'::jsonb,
  10,
  true
), (
  'wax',
  'Nourishing Leather Wax',
  'A premium leather wax that nourishes, protects, and enhances the natural beauty of your leather. Provides lasting shine while keeping leather soft, supple and water-resistant.',
  3500,
  'USD',
  '[
    {"url": "https://obipelle.com/cdn/shop/files/Wax_01_1.webp", "alt": "Nourishing Leather Wax — premium care balm"}
  ]'::jsonb,
  'Natural beeswax, organic seed oils, and premium shine-enhancing wax blend',
  '{"width_mm": 60, "height_mm": 60, "depth_mm": 35.0}'::jsonb,
  0,
  true
);

-- ────────────────────────────────────────────────────────────
-- SEED: Coming Soon Collections
-- ────────────────────────────────────────────────────────────
insert into public.collections (name, slug, teaser_copy, release_date, is_visible)
values
  ('The Belt', 'belt', 'A single-piece full-grain strap. Solid brass hardware. Nothing superfluous.', '2026-09-01', true),
  ('The Folio', 'folio', 'A writing companion for those who still believe in the handwritten word.', '2026-12-01', true),
  ('The Card Sleeve', 'card-sleeve', 'Three cards. Nothing more. The purist''s answer to the wallet question.', '2026-07-01', true);
