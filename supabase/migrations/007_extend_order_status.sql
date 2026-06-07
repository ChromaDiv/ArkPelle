-- 007_extend_order_status.sql
-- Extend the orders.status CHECK constraint to include
-- 'packed' and 'reviewed' statuses used in the admin UI.

-- Drop the old constraint (named automatically by Postgres as orders_status_check)
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;

-- Re-add with the full set of allowed values
ALTER TABLE orders
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
