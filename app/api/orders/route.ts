import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import type { ShippingAddress, Product, Order, OrderItem } from '@/lib/supabase/types';

interface OrderItemInput {
  productId: string;
  quantity: number;
  variant: Record<string, string> | null;
}

interface CreateOrderBody {
  items: OrderItemInput[];
  shippingAddress: ShippingAddress;
  currency: string;
}

type ProductRow = Pick<Product, 'id' | 'price_cents' | 'is_active'>;

/**
 * POST /api/orders
 * Creates an order + order items via the service role client.
 * Service role key never reaches the client bundle.
 *
 * Security:
 * - Validates user session via cookie-based server client
 * - Re-fetches prices from DB — never trusts client-sent prices
 */
export async function POST(request: NextRequest) {
  const supabase = await createServiceClient();

  // 1. Verify session
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. Parse body
  let body: CreateOrderBody;
  try {
    body = (await request.json()) as CreateOrderBody;
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { items, shippingAddress, currency } = body;

  if (!items?.length || !shippingAddress) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // 3. Fetch authoritative product prices from DB
  const productIds = items.map((i) => i.productId);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: rawProducts, error: productsError } = await (supabase as any)
    .from('products')
    .select('id, price_cents, is_active')
    .in('id', productIds);

  const products = (rawProducts ?? []) as unknown as ProductRow[];

  if (productsError || !products.length) {
    return NextResponse.json({ error: 'Products not found' }, { status: 422 });
  }

  // Validate all items exist and are active
  const productMap = new Map(products.map((p) => [p.id, p]));
  for (const item of items) {
    const product = productMap.get(item.productId);
    if (!product || !product.is_active) {
      return NextResponse.json(
        { error: `Product ${item.productId} is unavailable` },
        { status: 422 }
      );
    }
  }

  // 4. Compute authoritative total
  const totalCents = items.reduce((sum, item) => {
    const product = productMap.get(item.productId);
    return sum + (product?.price_cents ?? 0) * item.quantity;
  }, 0);

  // 5. Insert order
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: rawOrder, error: orderError } = await (supabase as any)
    .from('orders')
    .insert({
      user_id: user.id,
      status: 'confirmed',
      total_cents: totalCents,
      currency: currency ?? 'PKR',
      shipping_address: shippingAddress,
    })
    .select('id')
    .single();

  const order = rawOrder as unknown as Pick<Order, 'id'> | null;

  if (orderError || !order) {
    console.error('Order insert error:', orderError);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }

  // 6. Insert order items
  const orderItems = items.map((item) => ({
    order_id: order.id,
    product_id: item.productId,
    quantity: item.quantity,
    unit_price_cents: productMap.get(item.productId)!.price_cents,
    variant: item.variant,
  }));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error: itemsError } = await (supabase as any)
    .from('order_items')
    .insert(orderItems);

  if (itemsError) {
    console.error('Order items insert error:', itemsError);
  }

  return NextResponse.json({ orderId: order.id }, { status: 201 });
}
