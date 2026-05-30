import type { Metadata } from 'next';
import { createStaticClient, isSupabaseConfigured } from '@/lib/supabase/server';
import type { Product } from '@/lib/supabase/types';
import ProductGrid from '@/components/shop/ProductGrid';
import Footer from '@/components/sections/Footer';
import GrainOverlay from '@/components/atoms/GrainOverlay';
import GoldRule from '@/components/atoms/GoldRule';
import FadeInView from '@/components/motion/FadeInView';
import Link from 'next/link';

import { MOCK_PRODUCTS } from '@/lib/supabase/products-mock';

export const metadata: Metadata = {
  title: 'Shop',
  description:
    'The No. 1 Slim Wallet — full-grain vegetable-tanned leather, 6-card capacity, 6.2mm profile. Crafted without compromise.',
};

export const revalidate = 60;

/**
 * Shop page — SSR with 60s ISR.
 * Fetches active products via server Supabase client (RLS: public read), falling back to high-fidelity mocks if empty.
 */
export default async function ShopPage() {
  let safeProducts: Product[] = MOCK_PRODUCTS;

  if (isSupabaseConfigured()) {
    try {
      const supabase = createStaticClient();
      const { data: products } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (products && products.length > 0) {
        safeProducts = products as unknown as Product[];
      }
    } catch (e) {
      console.warn('Supabase not fully reachable, falling back to local mocks.', e);
    }
  }

  return (
    <>
      <main className="min-h-screen bg-[var(--color-ground)]">
        {/* Nav */}
        <nav className="container-brand py-8 flex items-center justify-between border-b border-[var(--color-gold-dim)]/20">
          <Link href="/" aria-label="Ark Pelle — Home">
            <img src="/logo.svg" alt="Ark Pelle" width={140} height={28} className="h-7 w-auto" />
          </Link>
          <Link
            href="/checkout"
            className="font-body text-xs tracking-[0.2em] uppercase text-[var(--color-ink-muted)] hover:text-[var(--color-gold)] transition-colors duration-500"
          >
            Bag
          </Link>
        </nav>

        <div className="relative overflow-hidden">
          <GrainOverlay />

          <div className="container-brand py-16 relative z-10">
            {/* Page header */}
            <FadeInView>
              <div className="mb-16 max-w-xl">
                <p className="font-body text-2xs tracking-[0.3em] uppercase text-[var(--color-gold)] mb-4">
                  The Collection
                </p>
                <h1
                  className="font-display font-light text-[clamp(2.5rem,5vw,4.5rem)] text-[var(--color-ink)] leading-tight tracking-[0.02em] mb-6"
                  style={{ fontOpticalSizing: 'auto' } as React.CSSProperties}
                >
                  Fine Leather Goods
                </h1>
                <GoldRule className="max-w-[5rem]" />
              </div>
            </FadeInView>

            {/* Product grid */}
            <ProductGrid products={safeProducts} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
