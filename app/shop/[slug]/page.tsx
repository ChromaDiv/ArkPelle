import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createStaticClient, isSupabaseConfigured } from '@/lib/supabase/server';
import type { Product } from '@/lib/supabase/types';
import ProductDetailClient from '@/components/shop/ProductDetailClient';
import Footer from '@/components/sections/Footer';
import GrainOverlay from '@/components/atoms/GrainOverlay';
import Link from 'next/link';
import FadeInView from '@/components/motion/FadeInView';
import { MOCK_PRODUCTS } from '@/lib/supabase/products-mock';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  let product: Pick<Product, 'name' | 'description'> | null = null;

  if (isSupabaseConfigured()) {
    try {
      const supabase = createStaticClient();
      const { data: rawProduct } = await supabase
        .from('products')
        .select('name, description')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();
      if (rawProduct) {
        product = rawProduct as unknown as Pick<Product, 'name' | 'description'>;
      }
    } catch {
      // safe fallback
    }
  }

  if (!product) {
    const mockProduct = MOCK_PRODUCTS.find((p) => p.slug === slug);
    if (mockProduct) {
      product = { name: mockProduct.name, description: mockProduct.description };
    }
  }

  if (!product) {
    return { title: 'Product Not Found' };
  }

  return {
    title: product.name,
    description: product.description,
  };
}

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  const allSlugs = new Set<string>();

  if (isSupabaseConfigured()) {
    try {
      const supabase = createStaticClient();
      const { data: rawProducts } = await supabase
        .from('products')
        .select('slug')
        .eq('is_active', true);
      if (rawProducts) {
        (rawProducts as Array<{ slug: string }>).forEach((p) => allSlugs.add(p.slug));
      }
    } catch {
      // safe fallback
    }
  }

  // Combine with mock slugs to ensure build-time static generation
  MOCK_PRODUCTS.forEach((p) => allSlugs.add(p.slug));

  return Array.from(allSlugs).map((slug) => ({ slug }));
}

export const revalidate = 300;

/**
 * Product detail page — static generation + 5-minute ISR.
 * Server component shell; ProductDetailClient handles interactive state.
 */
export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  let product: Product | null = null;

  if (isSupabaseConfigured()) {
    try {
      const supabase = createStaticClient();
      const { data: rawProduct } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();
      if (rawProduct) {
        product = rawProduct as unknown as Product;
      }
    } catch {
      // safe fallback
    }
  }

  if (!product) {
    product = MOCK_PRODUCTS.find((p) => p.slug === slug) ?? null;
  }

  if (!product) notFound();

  return (
    <>
      <main className="min-h-screen bg-[var(--color-ground)]">
        {/* Nav */}
        <nav className="container-brand py-8 flex items-center justify-between border-b border-[var(--color-gold-dim)]/20">
          <Link href="/" aria-label="Ark Pelle — Home">
            <img src="/logo.svg" alt="Ark Pelle" width={140} height={28} className="h-7 w-auto" />
          </Link>
          <div className="flex items-center gap-8">
            <Link
              href="/shop"
              className="font-body text-xs tracking-[0.2em] uppercase text-[var(--color-ink-muted)] hover:text-[var(--color-gold)] transition-colors duration-500"
            >
              ← Shop
            </Link>
            <Link
              href="/checkout"
              className="font-body text-xs tracking-[0.2em] uppercase text-[var(--color-ink-muted)] hover:text-[var(--color-gold)] transition-colors duration-500"
            >
              Bag
            </Link>
          </div>
        </nav>

        <div className="relative overflow-hidden">
          <GrainOverlay />
          <div className="container-brand py-16 relative z-10">
            <FadeInView>
              <ProductDetailClient product={product} />
            </FadeInView>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
