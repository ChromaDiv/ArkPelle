'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import GrainOverlay from '@/components/atoms/GrainOverlay';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import CartLink from '@/components/cart/CartLink';

/**
 * Hero section — full-viewport cinematic hero.
 * Client component for mobile menu toggle.
 */
export default function Hero() {
  const [menuOpen, setMenuOpen] = useState(false);
  const shouldReduce = useReducedMotion();

  const navLinks = [
    { href: '/shop', label: 'Shop' },
    { href: '#manifesto', label: 'Story' },
    { href: '#horizon', label: 'Horizon' },
  ];

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-stretch overflow-hidden"
      aria-label="Hero"
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/hero.jpg"
          alt="Cinematic close-up of the premium Ark Pelle full-grain leather wallet embossed with the gold brand emblem on a dark marbled surface"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Dark vignette overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-ground)]/70 via-[var(--color-ground)]/30 to-[var(--color-ground)]" />
        {/* Grain texture */}
        <GrainOverlay opacity={0.05} />
      </div>

      {/* Navigation bar */}
      <nav className="relative z-20 flex items-center justify-between container-brand py-6 md:py-8">
        {/* Logo */}
        <Link href="/" aria-label="Ark Pelle — Home">
          <img
            src="/logo.svg"
            alt="Ark Pelle"
            width={160}
            height={32}
            className="h-7 md:h-8 w-auto"
          />
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="font-body text-xs tracking-[0.2em] uppercase text-[var(--color-ink-muted)] hover:text-[var(--color-gold)] transition-colors duration-500"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Right side: Bag + hamburger */}
        <div className="flex items-center gap-6">
          {/* Cart link — always visible */}
          <CartLink />

          {/* Mobile hamburger */}
          <button
            type="button"
            className="md:hidden flex flex-col justify-center items-center gap-[5px] w-8 h-8"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <span
              className={`block w-5 h-px bg-[var(--color-ink)] transition-all duration-300 origin-center ${
                menuOpen ? 'rotate-45 translate-y-[3px]' : ''
              }`}
            />
            <span
              className={`block w-5 h-px bg-[var(--color-ink)] transition-all duration-300 origin-center ${
                menuOpen ? '-rotate-45 -translate-y-[3px]' : ''
              }`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile menu dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{
              duration: shouldReduce ? 0.01 : 0.4,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="relative z-20 md:hidden overflow-hidden"
          >
            <div className="container-brand pb-6 flex flex-col gap-4 border-b border-[var(--color-gold-dim)]/20">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="font-body text-sm tracking-[0.2em] uppercase text-[var(--color-ink-muted)] hover:text-[var(--color-gold)] transition-colors duration-500 py-1"
                >
                  {label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero content */}
      <div className="relative z-10 flex-1 flex flex-col justify-end container-brand pb-24 md:pb-32">
        {/* Eyebrow */}
        <p className="font-body text-2xs tracking-[0.3em] uppercase text-[var(--color-gold)] mb-6">
          No. 1 · Full-Grain Leather
        </p>

        {/* H1 — ≤ 6 words, Cormorant Garamond */}
        <h1
          className="font-display font-light text-[clamp(3rem,8vw,7rem)] text-[var(--color-ink)] leading-[1.0] tracking-[0.02em] max-w-3xl mb-10"
          style={{ fontOpticalSizing: 'auto' } as React.CSSProperties}
        >
          The wallet, reimagined.
        </h1>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <Link
            href="/shop"
            id="hero-cta"
            className="inline-flex items-center gap-3 font-body text-xs tracking-[0.25em] uppercase text-[var(--color-ground)] bg-[var(--color-gold)] px-10 py-4 hover:bg-[var(--color-gold-dim)] transition-colors duration-[600ms] focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-ground)]"
            style={{ transitionTimingFunction: 'var(--ease-luxury)' }}
          >
            Discover the No. 1
          </Link>
          <Link
            href="#manifesto"
            className="font-body text-xs tracking-[0.2em] uppercase text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors duration-500 border-b border-[var(--color-gold-dim)]/50 pb-px"
          >
            Our Story
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="relative z-10 container-brand pb-8 flex items-center gap-4">
        <div className="w-px h-12 bg-gradient-to-b from-transparent to-[var(--color-gold-dim)]" aria-hidden="true" />
        <p className="font-body text-2xs tracking-[0.2em] uppercase text-[var(--color-ink-muted)]">
          Scroll
        </p>
      </div>
    </section>
  );
}
