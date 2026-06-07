-- ============================================================
-- 009_add_color_quantities.sql
-- Adds color_quantities JSONB column to public.products table
-- and seeds existing product records with default quantities.
-- ============================================================

-- Add color_quantities JSONB column
alter table public.products
add column if not exists color_quantities jsonb not null default '{}'::jsonb;

-- Seed existing products with initial color quantities
-- If is_sold_out is true, all selected colors are set to 0.
-- If is_sold_out is false, all selected colors are set to 10.
update public.products
set color_quantities = (
  case 
    when is_sold_out = true then 
      (select coalesce(jsonb_object_agg(elem, 0), '{}'::jsonb) from unnest(colors) elem)
    else
      (select coalesce(jsonb_object_agg(elem, 10), '{}'::jsonb) from unnest(colors) elem)
  end
)
where colors is not null and array_length(colors, 1) > 0;

-- For products with no colors, ensure color_quantities is '{}'::jsonb
update public.products
set color_quantities = '{}'::jsonb
where colors is null or array_length(colors, 1) is null or array_length(colors, 1) = 0;
