-- ============================================================
-- 006_add_colors.sql
-- Adds colors text array to the products table and seeds existing.
-- ============================================================

-- Add colors to products table
alter table public.products
add column if not exists colors text[] not null default '{}';

-- Seed existing products with their colors matching ProductDetailClient.tsx PRODUCT_FINISHES
update public.products
set colors = array['brown', 'tan', 'black']
where slug in ('no-1-slim-wallet', 'pluto', 'holly', 'rio');

update public.products
set colors = array['black']
where slug = 'magic';

update public.products
set colors = array[]::text[]
where slug = 'wax';
