// Order status constants and types — not a server action file.
// Imported by both server actions and client components.

import type { ShippingAddress } from '@/lib/supabase/types';
import type { OrderItem } from '@/lib/supabase/types';

// ─── Extended status type ─────────────────────────────────────────────────────

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'packed'
  | 'shipped'
  | 'delivered'
  | 'reviewed'
  | 'cancelled';

export const ORDER_STATUS_OPTIONS: { value: OrderStatus; label: string; color: string }[] = [
  { value: 'pending',   label: 'Pending',              color: '#8A8078' },
  { value: 'confirmed', label: 'Confirmed',             color: '#B8934A' },
  { value: 'packed',    label: 'Packed',                color: '#7B9EA6' },
  { value: 'shipped',   label: 'Shipped',               color: '#5B8C6B' },
  { value: 'delivered', label: 'Delivered',             color: '#4CAF50' },
  { value: 'reviewed',  label: 'Reviewed by Customer',  color: '#9C7BB5' },
  { value: 'cancelled', label: 'Cancelled',             color: '#C0392B' },
];

// ─── Extended order types ─────────────────────────────────────────────────────

export interface AdminOrderItem extends OrderItem {
  product_name: string;
  product_slug: string;
}

export interface AdminOrder {
  id: string;
  user_id: string;
  status: OrderStatus;
  total_cents: number;
  currency: string;
  shipping_address: ShippingAddress;
  created_at: string;
  items: AdminOrderItem[];
}
