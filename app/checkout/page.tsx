import type { Metadata } from 'next';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import Footer from '@/components/sections/Footer';
import GrainOverlay from '@/components/atoms/GrainOverlay';
import GoldRule from '@/components/atoms/GoldRule';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Checkout',
  description: 'Complete your order.',
  robots: { index: false, follow: false },
};

/**
 * Checkout page — server shell (cart state is client-side).
 * No SSR data fetch needed; all state lives in CartProvider.
 */
export default function CheckoutPage() {
  return (
    <>
      <main className="min-h-screen bg-[var(--color-ground)]">
        {/* Nav */}
        <nav className="container-brand py-8 flex items-center justify-between border-b border-[var(--color-gold-dim)]/20">
          <Link href="/" aria-label="Ark Pelle — Home">
            <img src="/logo.svg" alt="Ark Pelle" width={140} height={28} className="h-7 w-auto" />
          </Link>
          <Link
            href="/shop"
            className="font-body text-xs tracking-[0.2em] uppercase text-[var(--color-ink-muted)] hover:text-[var(--color-gold)] transition-colors duration-500"
          >
            ← Continue Shopping
          </Link>
        </nav>

        <div className="relative overflow-hidden">
          <GrainOverlay />
          <div className="container-brand py-16 relative z-10">
            <CheckoutForm />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
