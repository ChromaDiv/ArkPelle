-- ============================================================
-- 002_admin_rls.sql
-- Admin-only RLS policies for product mutations + storage.
--
-- HOW TO USE:
-- 1. Replace 'ADMIN_EMAIL_PLACEHOLDER' with your actual admin email.
-- 2. Run in Supabase SQL Editor or via: supabase db push
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- HELPER FUNCTION: is_admin()
-- Checks if the currently authenticated user's email matches
-- the admin email set in Supabase Vault / app metadata.
-- We store it in a DB function so it can be reused across policies.
-- ────────────────────────────────────────────────────────────
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
as $$
  select (
    auth.role() = 'authenticated'
    and (
      -- Primary check: email in admin list
      -- Add additional emails by extending this array.
      auth.email() = any(
        string_to_array(
          coalesce(current_setting('app.admin_emails', true), 'admin@arkpelle.com'),
          ','
        )
      )
    )
  );
$$;

-- Grant execute to authenticated and anon roles
grant execute on function public.is_admin() to authenticated, anon;

-- ────────────────────────────────────────────────────────────
-- PRODUCTS TABLE: Admin mutation policies
-- SELECT policy already exists from migration 001.
-- We add INSERT, UPDATE, DELETE for admins only.
-- ────────────────────────────────────────────────────────────

-- DROP existing permissive policies if re-running
drop policy if exists "products: admin insert" on public.products;
drop policy if exists "products: admin update" on public.products;
drop policy if exists "products: admin delete" on public.products;
-- Also allow admins to read inactive products
drop policy if exists "products: admin read all" on public.products;

create policy "products: admin read all"
  on public.products for select
  using (
    is_active = true
    or public.is_admin()
  );

create policy "products: admin insert"
  on public.products for insert
  with check (public.is_admin());

create policy "products: admin update"
  on public.products for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "products: admin delete"
  on public.products for delete
  using (public.is_admin());

-- ────────────────────────────────────────────────────────────
-- STORAGE: Create product-images bucket
-- Run this ONLY if the bucket doesn't exist yet.
-- ────────────────────────────────────────────────────────────

-- Note: Storage buckets are typically created via Dashboard UI or API.
-- The SQL below works if supabase_storage schema is accessible.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,          -- Public: images are served without auth tokens
  5242880,       -- 5 MB max per file
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do nothing;

-- ────────────────────────────────────────────────────────────
-- STORAGE RLS: product-images bucket
-- ────────────────────────────────────────────────────────────

-- Public read (anyone can view product images)
drop policy if exists "product-images: public read" on storage.objects;
create policy "product-images: public read"
  on storage.objects for select
  using (bucket_id = 'product-images');

-- Admin upload
drop policy if exists "product-images: admin insert" on storage.objects;
create policy "product-images: admin insert"
  on storage.objects for insert
  with check (
    bucket_id = 'product-images'
    and public.is_admin()
  );

-- Admin delete
drop policy if exists "product-images: admin delete" on storage.objects;
create policy "product-images: admin delete"
  on storage.objects for delete
  using (
    bucket_id = 'product-images'
    and public.is_admin()
  );

-- ────────────────────────────────────────────────────────────
-- APP SETTING: Set admin emails
-- Run this once to configure which email(s) have admin access.
-- Replace with your real admin email.
-- ────────────────────────────────────────────────────────────
-- alter database postgres set app.admin_emails = 'admin@arkpelle.com';
-- After running the above, you must reconnect or run: SELECT pg_reload_conf();
