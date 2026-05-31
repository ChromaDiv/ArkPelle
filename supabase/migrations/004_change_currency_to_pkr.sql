-- ============================================================
-- 004_change_currency_to_pkr.sql
-- Sets the default table currency to PKR and updates existing rows.
-- ============================================================

-- Alter products column default and update existing products
alter table public.products alter column currency set default 'PKR';
update public.products set currency = 'PKR';

-- Alter orders column default and update existing orders
alter table public.orders alter column currency set default 'PKR';
update public.orders set currency = 'PKR';
