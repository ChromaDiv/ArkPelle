'use server';

import { createClient, createServiceClient, isSupabaseConfigured } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import type { ShippingAddress } from '@/lib/supabase/types';

async function requireAdmin() {
  if (process.env.BYPASS_AUTH === 'true') {
    return { supabase: await createServiceClient() };
  }
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) redirect('/');
  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@arkpelle.com';
  const adminEmails = adminEmail.split(',').map(e => e.trim().toLowerCase());
  if (!adminEmails.includes((user.email ?? '').toLowerCase())) redirect('/');
  return { supabase };
}

export interface OrderNotification {
  id: string;
  customer_name: string;
  total_cents: number;
  currency: string;
  status: string;
  created_at: string;
}

/**
 * Returns the 20 most recent orders for the notification bell.
 * Callers compare created_at against a localStorage timestamp to
 * determine which ones are "new".
 */
export async function getRecentOrderNotifications(): Promise<OrderNotification[]> {
  if (!isSupabaseConfigured()) return [];

  const { supabase } = await requireAdmin();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('orders')
    .select('id, total_cents, currency, status, created_at, shipping_address')
    .order('created_at', { ascending: false })
    .limit(20);

  if (error || !data) {
    console.error('getRecentOrderNotifications error:', error);
    return [];
  }

  return (data as { id: string; total_cents: number; currency: string; status: string; created_at: string; shipping_address: ShippingAddress }[]).map(row => ({
    id: row.id,
    customer_name: row.shipping_address?.full_name ?? 'Customer',
    total_cents: row.total_cents,
    currency: row.currency,
    status: row.status,
    created_at: row.created_at,
  }));
}
