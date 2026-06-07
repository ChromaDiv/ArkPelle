'use server';

// ── IMPORTANT: This file may ONLY export async functions (Next.js 'use server' rule).
// Constants and types live in @/lib/orders/types.ts

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient, createServiceClient, isSupabaseConfigured } from '@/lib/supabase/server';
import type { Order, OrderItem, Product } from '@/lib/supabase/types';
import type { AdminOrder, AdminOrderItem, OrderStatus } from '@/lib/orders/types';

// ─── Admin guard ──────────────────────────────────────────────────────────────

async function requireAdmin() {
  if (process.env.BYPASS_AUTH === 'true') {
    const serviceClient = await createServiceClient();
    return { supabase: serviceClient };
  }

  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) redirect('/');

  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@arkpelle.com';
  const adminEmails = adminEmail.split(',').map(e => e.trim().toLowerCase());

  if (!adminEmails.includes((user.email ?? '').toLowerCase())) {
    redirect('/');
  }

  return { supabase };
}

// ─── READ: All orders with items ──────────────────────────────────────────────

export async function getAdminOrders(): Promise<AdminOrder[]> {
  if (!isSupabaseConfigured()) return [];

  const { supabase } = await requireAdmin();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: orders, error: ordersError } = await (supabase as any)
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (ordersError || !orders?.length) {
    if (ordersError) console.error('getAdminOrders error:', ordersError);
    return [];
  }

  // Fetch order items for all orders
  const orderIds = orders.map((o: Order) => o.id);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: items, error: itemsError } = await (supabase as any)
    .from('order_items')
    .select('*')
    .in('order_id', orderIds);

  if (itemsError) {
    console.error('getAdminOrders items error:', itemsError);
  }

  const orderItems = (items ?? []) as OrderItem[];

  // Fetch product names
  const productIds = [...new Set(orderItems.map(i => i.product_id))];
  let productMap = new Map<string, { name: string; slug: string }>();

  if (productIds.length > 0) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: products } = await (supabase as any)
      .from('products')
      .select('id, name, slug')
      .in('id', productIds);

    if (products) {
      (products as Pick<Product, 'id' | 'name' | 'slug'>[]).forEach(p => {
        productMap.set(p.id, { name: p.name, slug: p.slug });
      });
    }
  }

  // Group items by order
  const itemsByOrder = new Map<string, AdminOrderItem[]>();
  for (const item of orderItems) {
    const product = productMap.get(item.product_id);
    const enriched: AdminOrderItem = {
      ...item,
      product_name: product?.name ?? 'Unknown Product',
      product_slug: product?.slug ?? '',
    };
    if (!itemsByOrder.has(item.order_id)) {
      itemsByOrder.set(item.order_id, []);
    }
    itemsByOrder.get(item.order_id)!.push(enriched);
  }

  return (orders as Order[]).map(order => ({
    ...order,
    status: order.status as OrderStatus,
    items: itemsByOrder.get(order.id) ?? [],
  }));
}

// ─── UPDATE: Order status ─────────────────────────────────────────────────────

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus
): Promise<{ success?: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    revalidatePath('/admin/dashboard/orders');
    return { success: true };
  }

  const { supabase } = await requireAdmin();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('orders')
    .update({ status })
    .eq('id', orderId);

  if (error) {
    console.error('updateOrderStatus error:', error);
    return { error: error.message };
  }

  revalidatePath('/admin/dashboard/orders');
  return { success: true };
}
