'use client';

import React from 'react';
import Link from 'next/link';
import CartLink from '@/components/cart/CartLink';
import Footer from '@/components/sections/Footer';
import GrainOverlay from '@/components/atoms/GrainOverlay';
import GoldRule from '@/components/atoms/GoldRule';
import FadeInView from '@/components/motion/FadeInView';

interface PolicyLayoutProps {
  title: string;
  subtitle: string;
  lastUpdated: string;
  children: React.ReactNode;
}

export default function PolicyLayout({
  title,
  subtitle,
  lastUpdated,
  children,
}: PolicyLayoutProps) {
  return (
    <>
      <main className="min-h-screen bg-[var(--color-ground)] text-[var(--color-ink)] font-body font-light">
        {/* Navigation */}
        <nav className="container-brand py-8 flex items-center justify-between border-b border-[var(--color-gold-dim)]/20">
          <Link href="/" aria-label="Ark Pelle — Home">
            <img src="/logo.svg" alt="Ark Pelle" width={140} height={28} className="h-7 w-auto transition-opacity duration-300 hover:opacity-80" />
          </Link>
          <div className="flex items-center gap-8">
            <Link
              href="/shop"
              className="font-body text-xs tracking-[0.2em] uppercase text-[var(--color-ink-muted)] hover:text-[var(--color-gold)] transition-colors duration-500"
            >
              ← Shop
            </Link>
            <CartLink />
          </div>
        </nav>

        {/* Cinematic Header Block */}
        <div className="relative overflow-hidden border-b border-[var(--color-gold-dim)]/10 bg-gradient-to-b from-[var(--color-surface)]/20 to-transparent">
          <GrainOverlay opacity={0.03} />
          <div className="container-brand py-20 relative z-10">
            <FadeInView>
              <div className="max-w-2xl">
                <p className="font-body text-2xs tracking-[0.3em] uppercase text-[var(--color-gold)] mb-4">
                  Legal & Policy
                </p>
                <h1
                  className="font-display font-light text-[clamp(2.5rem,6vw,4.5rem)] text-[var(--color-ink)] leading-tight tracking-[0.02em] mb-6"
                  style={{ fontOpticalSizing: 'auto' } as React.CSSProperties}
                >
                  {title}
                </h1>
                <p className="text-sm text-[var(--color-ink-muted)] tracking-[0.08em] mb-4">
                  {subtitle}
                </p>
                <div className="flex items-center gap-4 text-2xs text-[var(--color-ink-muted)]/60 tracking-[0.05em]">
                  <span>Last updated: {lastUpdated}</span>
                </div>
                <GoldRule className="max-w-[8rem] mt-8" />
              </div>
            </FadeInView>
          </div>
        </div>

        {/* Content Section */}
        <div className="relative overflow-hidden py-16 md:py-24">
          <GrainOverlay opacity={0.02} />
          <div className="container-brand relative z-10">
            <FadeInView delay={0.1}>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                {/* Sidebar Navigation indicator / decorative element */}
                <div className="hidden lg:block lg:col-span-1">
                  <div className="sticky top-24 space-y-4 border-l border-[var(--color-gold-dim)]/20 pl-6">
                    <p className="font-display text-lg font-light text-[var(--color-ink)] tracking-wide">
                      Ark Pelle
                    </p>
                    <p className="font-body text-2xs text-[var(--color-gold)] tracking-[0.2em] uppercase">
                      Post-Luxury Standard
                    </p>
                    <div className="pt-4">
                      <div className="w-12 h-px bg-[var(--color-gold-dim)]/40" />
                    </div>
                    <p className="text-2xs text-[var(--color-ink-muted)] max-w-[180px] leading-relaxed">
                      All products are meticulously designed, numbered, and handcrafted using ethical, certified vegetable-tanned leather.
                    </p>
                  </div>
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-3 max-w-3xl">
                  <div className="bg-[var(--color-surface)]/30 backdrop-blur-md border border-[var(--color-gold-dim)]/10 rounded-lg p-6 md:p-12 shadow-2xl shadow-black/40">
                    <div className="prose prose-invert max-w-none space-y-10">
                      {children}
                    </div>
                  </div>
                </div>
              </div>
            </FadeInView>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
