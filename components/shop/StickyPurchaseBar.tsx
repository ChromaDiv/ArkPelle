'use client';

import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { cn, formatPrice } from '@/lib/utils';
import { useCart } from '@/hooks/useCart';
import type { Product, OrderItemVariant } from '@/lib/supabase/types';
import Button from '@/components/atoms/Button';

interface StickyPurchaseBarProps {
  product: Product;
  selectedVariant: OrderItemVariant | null | undefined;
  className?: string;
}

/**
 * StickyPurchaseBar — appears after scrolling past the hero image.
 * Fixed to bottom of viewport on mobile, slides in from bottom.
 * Optimistic add-to-cart with brief confirmation state.
 */
export default function StickyPurchaseBar({
  product,
  selectedVariant,
  className,
}: StickyPurchaseBarProps) {
  const { addItem, itemCount } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const shouldReduce = useReducedMotion();

  function handleAddToCart() {
    addItem(product, 1, selectedVariant ?? null);
    // Optimistic UI — brief confirmation
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  }

  const hasDiscount = product.discount_percent > 0;
  const discountedPriceCents = hasDiscount
    ? Math.round(product.price_cents * (1 - product.discount_percent / 100))
    : product.price_cents;
  const displayPrice = formatPrice(discountedPriceCents, product.currency);

  const colorKey = selectedVariant?.finish?.toLowerCase();
  const isColorSoldOut = colorKey && product.color_quantities
    ? (product.color_quantities[colorKey] ?? 0) <= 0
    : false;
  const isSoldOutUI = product.is_sold_out || isColorSoldOut;

  return (
    <motion.div
      className={cn(
        'fixed bottom-0 inset-x-0 z-50',
        'bg-[var(--color-surface)]/95 backdrop-blur-md',
        'border-t border-[var(--color-gold-dim)]/30',
        'safe-area-padding-bottom',
        className
      )}
      initial={{ y: shouldReduce ? 0 : 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="container-brand py-4 flex items-center justify-between gap-6">
        {/* Product info */}
        <div className="hidden sm:block">
          <p className="font-display text-base font-light text-[var(--color-ink)]">
            {product.name}
          </p>
          {hasDiscount ? (
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="font-body text-sm text-[var(--color-gold)]">{displayPrice}</span>
              <span className="font-body text-xs line-through text-[var(--color-ink-muted)]">
                {formatPrice(product.price_cents, product.currency)}
              </span>
            </div>
          ) : (
            <p className="font-body text-sm text-[var(--color-gold)] mt-0.5">{displayPrice}</p>
          )}
        </div>

        {/* Price — mobile only */}
        <p className="sm:hidden font-body text-sm text-[var(--color-gold)] shrink-0">{displayPrice}</p>

        {/* Add to cart */}
        <div className="flex items-center gap-4 ml-auto">
          {itemCount > 0 && (
            <span className="font-body text-xs text-[var(--color-ink-muted)] tracking-[0.08em]">
              {itemCount} in bag
            </span>
          )}
          {isSoldOutUI ? (
            <Button
              id="add-to-cart-btn"
              variant="primary"
              size="md"
              className="opacity-40 cursor-not-allowed pointer-events-none"
              disabled
              aria-label={`${product.name} is Sold Out`}
            >
              Sold Out
            </Button>
          ) : (
            <AnimatePresence mode="wait">
              {isAdded ? (
                <motion.div
                  key="added"
                  initial={{ opacity: 0, scale: shouldReduce ? 1 : 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: shouldReduce ? 1 : 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-2 px-8 py-3 border border-[var(--color-gold-dim)] text-[var(--color-gold)]"
                  role="status"
                  aria-live="polite"
                >
                  <svg width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden="true">
                    <path d="M1 5L5.5 9.5L13 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="font-body text-xs tracking-[0.15em] uppercase">Added</span>
                </motion.div>
              ) : (
                <motion.div
                  key="add"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button
                    id="add-to-cart-btn"
                    variant="primary"
                    size="md"
                    onClick={handleAddToCart}
                    aria-label={`Add ${product.name} to cart`}
                  >
                    Add to Bag
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </motion.div>
  );
}
