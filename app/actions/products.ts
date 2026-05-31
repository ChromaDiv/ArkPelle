'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient, createServiceClient, isSupabaseConfigured } from '@/lib/supabase/server';
import { MOCK_PRODUCTS } from '@/lib/supabase/products-mock';
import { generateSlug } from '@/lib/slug';
import type { Product, ProductImage } from '@/lib/supabase/types';

// ─── Admin guard ────────────────────────────────────────────────────────────

async function requireAdmin() {
  if (process.env.BYPASS_AUTH === 'true') {
    const serviceClient = await createServiceClient();
    return { supabase: serviceClient, user: { email: 'arkpelle@gmail.com' } };
  }

  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/');
  }

  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@arkpelle.com';
  const adminEmails = adminEmail.split(',').map(e => e.trim().toLowerCase());

  if (!adminEmails.includes((user.email ?? '').toLowerCase())) {
    redirect('/');
  }

  return { supabase, user };
}

// generateSlug is defined in @/lib/slug — imported above.

// ─── READ: All products (admin sees inactive too) ────────────────────────────

export async function getAdminProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured()) {
    return MOCK_PRODUCTS;
  }

  const { supabase } = await requireAdmin();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('products')
    .select('*')
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error || !data) {
    console.error('getAdminProducts error:', error);
    return MOCK_PRODUCTS;
  }

  return data as Product[];
}

// ─── READ: Single product by slug ────────────────────────────────────────────

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!isSupabaseConfigured()) {
    return MOCK_PRODUCTS.find(p => p.slug === slug) ?? null;
  }

  const { supabase } = await requireAdmin();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('products')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error || !data) return null;
  return data as Product;
}

// ─── Helper: parse FormData into product fields ───────────────────────────────

function parseProductForm(formData: FormData) {
  const name = (formData.get('name') as string).trim();
  const slug = generateSlug(formData.get('slug') as string || name);
  const description = (formData.get('description') as string).trim();
  const priceStr = formData.get('price') as string;
  const price_cents = Math.round(parseFloat(priceStr) * 100);
  const material = (formData.get('material') as string).trim();
  const card_capacity = parseInt(formData.get('card_capacity') as string, 10) || 0;
  const is_active = formData.get('is_active') === 'true';
  const is_sold_out = formData.get('is_sold_out') === 'true';
  const width_mm = parseFloat(formData.get('width_mm') as string) || 0;
  const height_mm = parseFloat(formData.get('height_mm') as string) || 0;
  const depth_mm = parseFloat(formData.get('depth_mm') as string) || 0;
  const imageUrls = (formData.getAll('image_url') as string[]).filter(Boolean);
  const imageAlts = (formData.getAll('image_alt') as string[]).filter(Boolean);

  const images: ProductImage[] = imageUrls.map((url, i) => ({
    url,
    alt: imageAlts[i] ?? name,
  }));

  return {
    name, slug, description, price_cents, material,
    card_capacity, is_active, is_sold_out,
    dimensions: { width_mm, height_mm, depth_mm },
    images,
    currency: 'USD',
  };
}

// ─── CREATE ──────────────────────────────────────────────────────────────────

export async function createProduct(formData: FormData) {
  const { supabase } = await requireAdmin();
  const fields = parseProductForm(formData);

  if (!isSupabaseConfigured()) {
    // In dev without Supabase — just redirect back
    revalidatePath('/admin/dashboard');
    redirect('/admin/dashboard');
  }

  // Fetch the current max display_order to append this product at the end
  let display_order = 0;
  try {
    const { data } = await (supabase as any)
      .from('products')
      .select('display_order')
      .order('display_order', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (data) {
      display_order = (data.display_order ?? 0) + 1;
    }
  } catch (err) {
    console.error('Failed to fetch max display_order:', err);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('products')
    .insert({ ...fields, display_order });

  if (error) {
    // Return error to the form rather than throwing
    return { error: error.message };
  }

  revalidatePath('/admin/dashboard');
  revalidatePath('/shop');
  redirect('/admin/dashboard');
}

// ─── UPDATE ──────────────────────────────────────────────────────────────────

export async function updateProduct(id: string, formData: FormData) {
  const { supabase } = await requireAdmin();
  const fields = parseProductForm(formData);

  if (!isSupabaseConfigured()) {
    revalidatePath('/admin/dashboard');
    redirect('/admin/dashboard');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('products')
    .update(fields)
    .eq('id', id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/admin/dashboard');
  revalidatePath('/shop');
  revalidatePath(`/shop/${fields.slug}`);
  redirect('/admin/dashboard');
}

// ─── DELETE (soft) ───────────────────────────────────────────────────────────

export async function deleteProduct(id: string) {
  if (!isSupabaseConfigured()) {
    revalidatePath('/admin/dashboard');
    return { success: true };
  }

  const { supabase } = await requireAdmin();

  // Soft-delete: set is_active = false
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('products')
    .update({ is_active: false })
    .eq('id', id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/admin/dashboard');
  revalidatePath('/shop');
  return { success: true };
}

// ─── HARD DELETE ─────────────────────────────────────────────────────────────

export async function hardDeleteProduct(id: string) {
  if (!isSupabaseConfigured()) {
    revalidatePath('/admin/dashboard');
    return { success: true };
  }

  const { supabase } = await requireAdmin();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('products')
    .delete()
    .eq('id', id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/admin/dashboard');
  revalidatePath('/shop');
  return { success: true };
}

// ─── RESTORE (reactivate) ────────────────────────────────────────────────────

export async function restoreProduct(id: string) {
  if (!isSupabaseConfigured()) {
    revalidatePath('/admin/dashboard');
    return { success: true };
  }

  const { supabase } = await requireAdmin();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('products')
    .update({ is_active: true })
    .eq('id', id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/admin/dashboard');
  revalidatePath('/shop');
  return { success: true };
}

// ─── IMAGE UPLOAD ─────────────────────────────────────────────────────────────

export async function uploadProductImage(formData: FormData): Promise<{ url?: string; error?: string }> {
  if (!isSupabaseConfigured()) {
    // Return a local placeholder so the form still works in dev
    return { url: '/wallet_main.jpg' };
  }

  const { supabase } = await requireAdmin();
  const file = formData.get('file') as File | null;

  if (!file) {
    return { error: 'No file provided' };
  }

  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any).storage
    .from('product-images')
    .upload(fileName, file, {
      contentType: file.type,
      cacheControl: '31536000',
      upsert: false,
    });

  if (error || !data) {
    return { error: error?.message ?? 'Upload failed' };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: urlData } = (supabase as any).storage
    .from('product-images')
    .getPublicUrl(data.path);

  return { url: urlData.publicUrl };
}

// ─── REORDER ─────────────────────────────────────────────────────────────────

export async function reorderProducts(orderedIds: string[]): Promise<{ success?: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    revalidatePath('/admin/dashboard');
    revalidatePath('/shop');
    return { success: true };
  }

  const { supabase } = await requireAdmin();

  // Perform updates in parallel
  const promises = orderedIds.map((id, index) =>
    (supabase as any)
      .from('products')
      .update({ display_order: index })
      .eq('id', id)
  );

  const results = await Promise.all(promises);
  const firstError = results.find(r => r.error);

  if (firstError) {
    console.error('reorderProducts error:', firstError.error);
    return { error: firstError.error.message };
  }

  revalidatePath('/admin/dashboard');
  revalidatePath('/shop');
  return { success: true };
}
