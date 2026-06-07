-- 008_orders_admin_access.sql
-- Two fixes:
-- 1. Extend orders.status CHECK constraint to include 'packed' and 'reviewed'
-- 2. Add admin UPDATE/SELECT policies on orders and order_items

-- ────────────────────────────────────────────────────────────
-- 1. Extend the orders.status CHECK constraint
-- ────────────────────────────────────────────────────────────

ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_status_check;

ALTER TABLE public.orders
  ADD CONSTRAINT orders_status_check
  CHECK (status IN (
    'pending',
    'confirmed',
    'packed',
    'shipped',
    'delivered',
    'reviewed',
    'cancelled'
  ));

-- ────────────────────────────────────────────────────────────
-- 2. Admin RLS policies for orders
-- ────────────────────────────────────────────────────────────

-- Admin can read ALL orders (not just their own)
DROP POLICY IF EXISTS "orders: admin read all" ON public.orders;
CREATE POLICY "orders: admin read all"
  ON public.orders FOR SELECT
  USING (
    auth.uid() = user_id
    OR public.is_admin()
  );

-- Admin can update any order (e.g. change status)
DROP POLICY IF EXISTS "orders: admin update" ON public.orders;
CREATE POLICY "orders: admin update"
  ON public.orders FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ────────────────────────────────────────────────────────────
-- 3. Admin RLS policies for order_items
-- ────────────────────────────────────────────────────────────

-- Admin can read ALL order items (for the orders dashboard)
DROP POLICY IF EXISTS "order_items: admin read all" ON public.order_items;
CREATE POLICY "order_items: admin read all"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
        AND orders.user_id = auth.uid()
    )
    OR public.is_admin()
  );
