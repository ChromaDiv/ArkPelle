'use client';

import { useState } from 'react';
import type { Product, OrderItemVariant } from '@/lib/supabase/types';
import ImageGallery from '@/components/shop/ImageGallery';
import VariantSelector from '@/components/shop/VariantSelector';
import StickyPurchaseBar from '@/components/shop/StickyPurchaseBar';
import AccordionItem from '@/components/molecules/AccordionItem';
import Button from '@/components/atoms/Button';
import GoldRule from '@/components/atoms/GoldRule';
import Tag from '@/components/atoms/Tag';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/hooks/useCart';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

const PRODUCT_FINISHES: Record<string, { label: string; value: string; available: boolean }[]> = {
  'no-1-slim-wallet': [
    { label: 'Dark Espresso', value: 'dark-espresso', available: true },
    { label: 'Cognac Tan', value: 'cognac-tan', available: true },
    { label: 'Jet Black', value: 'jet-black', available: true },
  ],
  'pluto': [
    { label: 'Geneva Brown', value: 'geneva-brown', available: true },
    { label: 'Cognac Tan', value: 'cognac-tan', available: true },
    { label: 'Jet Black', value: 'jet-black', available: true },
  ],
  'holly': [
    { label: 'Geneva Brown', value: 'geneva-brown', available: true },
    { label: 'Cognac Tan', value: 'cognac-tan', available: true },
    { label: 'Jet Black', value: 'jet-black', available: true },
  ],
  'rio': [
    { label: 'Geneva Brown', value: 'geneva-brown', available: true },
    { label: 'Cognac Tan', value: 'cognac-tan', available: true },
    { label: 'Jet Black', value: 'jet-black', available: true },
  ],
  'magic': [
    { label: 'Midnight Black', value: 'midnight-black', available: true },
  ],
  'wax': [], // No finishes/variants for wax
};

interface ProductDetailClientProps {
  product: Product;
}

/**
 * ProductDetailClient — manages variant selection state and purchase UX.
 * Separated from the server page to minimise client bundle size.
 */
export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const colorMap: Record<string, { label: string; value: string; available: boolean }> = {
    brown: { label: 'Geneva Brown', value: 'brown', available: true },
    black: { label: 'Jet Black', value: 'black', available: true },
    tan: { label: 'Cognac Tan', value: 'tan', available: true },
  };

  const productFinishes = (product.colors && product.colors.length > 0)
    ? product.colors.map(col => colorMap[col.toLowerCase()] || { label: col, value: col, available: true })
    : (PRODUCT_FINISHES[product.slug] || []);

  const [selectedFinish, setSelectedFinish] = useState(
    productFinishes.length > 0 ? productFinishes[0].value : 'default'
  );
  const [isAdded, setIsAdded] = useState(false);
  const { addItem } = useCart();
  const shouldReduce = useReducedMotion();

  const variant: OrderItemVariant = productFinishes.length > 0 ? { finish: selectedFinish } : {};
  const hasDiscount = product.discount_percent > 0;
  const discountedPriceCents = hasDiscount
    ? Math.round(product.price_cents * (1 - product.discount_percent / 100))
    : product.price_cents;
  const displayPrice = formatPrice(discountedPriceCents, product.currency);
  const displayOriginalPrice = formatPrice(product.price_cents, product.currency);

  function handleAddToCart() {
    addItem(product, 1, variant);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2500);
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
        {/* Image gallery */}
        <ImageGallery images={product.images} productName={product.name} />

        {/* Product info */}
        <div className="lg:pt-4 pb-32 lg:pb-0">
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-5">
            <Tag>{product.material.split(',')[0]}</Tag>
            {product.card_capacity > 0 && <Tag>{product.card_capacity} Cards</Tag>}
          </div>

          {/* Name + price */}
          <h1
            className="font-display font-light text-[clamp(2rem,4vw,3.5rem)] text-[var(--color-ink)] leading-tight tracking-[0.02em] mb-3"
            style={{ fontOpticalSizing: 'auto' } as React.CSSProperties}
          >
            {product.name}
          </h1>

          {hasDiscount ? (
            <div className="flex items-baseline gap-4 mb-6">
              <span className="font-body text-2xl font-light text-[var(--color-gold)]">
                {displayPrice}
              </span>
              <span className="font-body text-lg line-through text-[var(--color-ink-muted)]">
                {displayOriginalPrice}
              </span>
              <span className="font-display text-[9px] tracking-[0.15em] uppercase text-[#EDE8E0] bg-[#B8934A] px-2.5 py-0.5 rounded-[2px] font-semibold">
                {product.discount_percent}% OFF
              </span>
            </div>
          ) : (
            <p className="font-body text-2xl font-light text-[var(--color-gold)] mb-6">
              {displayPrice}
            </p>
          )}

          <GoldRule className="mb-8 max-w-[5rem]" />

          {/* Short description */}
          <p className="font-body text-sm font-light text-[var(--color-ink-muted)] leading-[1.9] mb-10">
            {product.description}
          </p>

          {/* Variant selector */}
          {productFinishes.length > 0 && (
            <div className="mb-10">
              <VariantSelector
                label="Leather Finish"
                variants={productFinishes}
                value={selectedFinish}
                onChange={setSelectedFinish}
              />
            </div>
          )}

          {/* Add to cart — desktop */}
          <div className="hidden lg:flex flex-col gap-3 mb-14">
            {product.is_sold_out ? (
              <Button
                id="add-to-cart-desktop"
                variant="primary"
                size="lg"
                className="w-full opacity-40 cursor-not-allowed pointer-events-none"
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
                    initial={{ opacity: 0, y: shouldReduce ? 0 : 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: shouldReduce ? 0 : -8 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-center gap-3 py-4 border border-[var(--color-gold-dim)] text-[var(--color-gold)] justify-center"
                    role="status"
                    aria-live="polite"
                  >
                    <svg width="16" height="12" viewBox="0 0 16 12" fill="none" aria-hidden="true">
                      <path d="M1 6L6 11L15 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="font-body text-xs tracking-[0.2em] uppercase">Added to Bag</span>
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
                      id="add-to-cart-desktop"
                      variant="primary"
                      size="lg"
                      onClick={handleAddToCart}
                      className="w-full"
                      aria-label={`Add ${product.name} to cart`}
                    >
                      Add to Bag — {displayPrice}
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            )}

            <p className="font-body text-xs text-[var(--color-ink-muted)] text-center tracking-[0.08em]">
              Free shipping on all orders. 30-day returns.
            </p>
          </div>

          {/* Accordions */}
          <div>
            <AccordionItem trigger="Description" defaultOpen>
              <p>{product.description}</p>
            </AccordionItem>

            <AccordionItem trigger="Dimensions">
              <dl className="grid grid-cols-2 gap-x-6 gap-y-3">
                <dt className="text-[var(--color-ink-muted)] tracking-[0.08em] uppercase text-2xs">Width</dt>
                <dd>{product.dimensions.width_mm}mm</dd>
                <dt className="text-[var(--color-ink-muted)] tracking-[0.08em] uppercase text-2xs">Height</dt>
                <dd>{product.dimensions.height_mm}mm</dd>
                <dt className="text-[var(--color-ink-muted)] tracking-[0.08em] uppercase text-2xs">Depth</dt>
                <dd>{product.dimensions.depth_mm}mm</dd>
                <dt className="text-[var(--color-ink-muted)] tracking-[0.08em] uppercase text-2xs">Capacity</dt>
                <dd>{product.card_capacity} cards</dd>
              </dl>
            </AccordionItem>

            <AccordionItem trigger="Materials">
              <p>{product.material}</p>
            </AccordionItem>

            <AccordionItem trigger="Care">
              <p>
                Wipe clean with a dry cloth. Condition occasionally with a natural beeswax leather
                balm. Avoid prolonged exposure to water. The leather will darken slightly with use
                — this is patina, not damage.
              </p>
            </AccordionItem>

            <AccordionItem trigger="Shipping & Returns">
              <div className="space-y-3">
                <p>Free shipping on all orders. Dispatched within 2 business days.</p>
                <p>
                  30-day returns on unworn, unaltered goods. To initiate a return,
                  contact us at returns@arkpelle.com.
                </p>
              </div>
            </AccordionItem>
          </div>
        </div>
      </div>

      {/* Sticky purchase bar — mobile only (hidden on lg+) */}
      <div className="lg:hidden">
        <StickyPurchaseBar product={product} selectedVariant={variant} />
      </div>
    </>
  );
}
