'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface Variant {
  label: string;
  value: string;
  available?: boolean;
}

interface VariantSelectorProps {
  label: string;
  variants: Variant[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

/**
 * VariantSelector — single-select pill group for leather finish / color variants.
 * Keyboard navigable, ARIA-selected state, gold active ring.
 */
export default function VariantSelector({
  label,
  variants,
  value,
  onChange,
  className,
}: VariantSelectorProps) {
  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between">
        <p className="font-body text-2xs tracking-[0.15em] uppercase text-[var(--color-ink-muted)]">
          {label}
        </p>
        <p className="font-body text-2xs text-[var(--color-ink)] tracking-[0.05em]">
          {variants.find((v) => v.value === value)?.label ?? ''}
        </p>
      </div>

      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={label}>
        {variants.map((variant) => {
          const isSelected = variant.value === value;
          const isUnavailable = variant.available === false;

          return (
            <button
              key={variant.value}
              role="radio"
              aria-checked={isSelected}
              aria-disabled={isUnavailable}
              disabled={isUnavailable}
              onClick={() => !isUnavailable && onChange(variant.value)}
              className={cn(
                'px-4 py-2 font-body text-xs tracking-[0.1em] uppercase',
                'border transition-all duration-[500ms]',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-ground)]',
                isSelected
                  ? 'border-[var(--color-gold)] text-[var(--color-gold)] bg-gold/5'
                  : 'border-gold-dim/50 text-[var(--color-ink-muted)] hover:border-[var(--color-gold-dim)] hover:text-[var(--color-ink)]',
                isUnavailable && 'opacity-30 cursor-not-allowed line-through'
              )}
              style={{ transitionTimingFunction: 'var(--ease-luxury)' }}
            >
              {variant.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
