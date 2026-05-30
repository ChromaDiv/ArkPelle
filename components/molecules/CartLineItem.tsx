'use client';

import Image from 'next/image';
import type { CartItem } from '@/lib/cart';
import { formatPrice, cn } from '@/lib/utils';
import { useCart } from '@/hooks/useCart';

interface CartLineItemProps {
  item: CartItem;
  className?: string;
}

/**
 * Cart line item — displays product image, name, variant, quantity controls, line total.
 * Reads from CartContext; emits updateQuantity and removeItem.
 */
export default function CartLineItem({ item, className }: CartLineItemProps) {
  const { updateQuantity, removeItem } = useCart();
  const lineTotal = formatPrice(item.price_cents * item.quantity, item.currency);

  return (
    <div className={cn('flex gap-5 py-6 border-b border-gold-dim/30', className)}>
      {/* Thumbnail */}
      <div className="relative w-20 h-24 shrink-0 bg-[var(--color-surface)] overflow-hidden">
        {item.image && (
          <Image
            src={item.image.url}
            alt={item.image.alt}
            fill
            sizes="80px"
            className="object-cover"
          />
        )}
      </div>

      {/* Details */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          <p className="font-display text-base font-light text-[var(--color-ink)]">
            {item.name}
          </p>
          {item.variant && (
            <p className="font-body text-xs text-[var(--color-ink-muted)] mt-1 tracking-[0.08em] uppercase">
              {Object.values(item.variant).filter(Boolean).join(' · ')}
            </p>
          )}
        </div>

        {/* Quantity controls */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center border border-gold-dim/50">
            <button
              aria-label="Decrease quantity"
              onClick={() =>
                item.quantity > 1
                  ? updateQuantity(item.id, item.quantity - 1)
                  : removeItem(item.id)
              }
              className={cn(
                'w-8 h-8 flex items-center justify-center',
                'text-[var(--color-ink-muted)] hover:text-[var(--color-gold)]',
                'transition-colors duration-300',
                'focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-gold)]'
              )}
            >
              –
            </button>
            <span className="w-8 text-center font-body text-sm text-[var(--color-ink)]">
              {item.quantity}
            </span>
            <button
              aria-label="Increase quantity"
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className={cn(
                'w-8 h-8 flex items-center justify-center',
                'text-[var(--color-ink-muted)] hover:text-[var(--color-gold)]',
                'transition-colors duration-300',
                'focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-gold)]'
              )}
            >
              +
            </button>
          </div>

          <div className="flex items-center gap-4">
            <span className="font-body text-sm text-[var(--color-gold)]">{lineTotal}</span>
            <button
              aria-label={`Remove ${item.name}`}
              onClick={() => removeItem(item.id)}
              className={cn(
                'font-body text-2xs tracking-[0.1em] uppercase',
                'text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]',
                'transition-colors duration-300',
                'focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-gold)]'
              )}
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
