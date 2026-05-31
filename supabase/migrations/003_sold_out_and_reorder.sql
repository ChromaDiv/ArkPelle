-- ============================================================
-- 003_sold_out_and_reorder.sql
-- Adds is_sold_out and display_order to the products table.
-- ============================================================

-- Add is_sold_out to products table
alter table public.products
add column if not exists is_sold_out boolean not null default false;

-- Add display_order to products table
alter table public.products
add column if not exists display_order integer not null default 0;

-- Update existing products with unique display_orders
-- This assigns a sequential display_order based on created_at asc
with ordered_products as (
  select id, row_number() over (order by created_at asc) - 1 as new_order
  from public.products
)
update public.products p
set display_order = op.new_order
from ordered_products op
where p.id = op.id;
