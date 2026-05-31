-- ============================================================
-- 005_add_discount_percent.sql
-- Adds discount_percent to the products table.
-- ============================================================

-- Add discount_percent to products table
alter table public.products
add column if not exists discount_percent integer not null default 0
check (discount_percent >= 0 and discount_percent <= 99);
