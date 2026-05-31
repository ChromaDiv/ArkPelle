import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/supabase/types';
import { formatPrice, cn } from '@/lib/utils';
import HoverLift from '@/components/motion/HoverLift';
import Tag from '@/components/atoms/Tag';
import GoldRule from '@/components/atoms/GoldRule';

interface ProductCardProps {
  product: Product;
  className?: string;
  priority?: boolean;
}

/**
 * Product card — server component shell with HoverLift client child.
 * Used in the shop grid. Full-bleed image, name, material tag, price.
 */
export default function ProductCard({ product, className, priority = false }: ProductCardProps) {
  const firstImage = product.images[0];
  const displayPrice = formatPrice(product.price_cents, product.currency);

  return (
    <Link
      href={`/shop/${product.slug}`}
      className={cn('block group outline-none', className)}
      aria-label={`${product.name} — ${displayPrice}`}
    >
      <HoverLift>
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-[var(--color-surface)]">
          {firstImage && (
            <Image
              src={firstImage.url}
              alt={firstImage.alt}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
              className={cn(
                "object-cover transition-transform duration-[1000ms] ease-[var(--ease-luxury)] group-hover:scale-105",
                product.is_sold_out && "filter grayscale-[30%] opacity-85"
              )}
              priority={priority}
            />
          )}
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-ground)]/60 via-transparent to-transparent" />

          {/* Luxury Sold Out overlay */}
          {product.is_sold_out && (
            <div className="absolute inset-0 bg-[var(--color-ground)]/40 backdrop-blur-[1px] flex items-center justify-center z-10">
              <span className="font-display text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] border border-[var(--color-gold)]/30 px-5 py-2.5 bg-[var(--color-surface)]/90 backdrop-blur-md">
                Sold Out
              </span>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="pt-5 space-y-3">
          <div className="flex items-start justify-between gap-4">
            <h2 className="font-display text-xl font-light text-[var(--color-ink)] leading-tight">
              {product.name}
            </h2>
            <span className="font-body text-sm font-light text-[var(--color-gold)] shrink-0 pt-1">
              {displayPrice}
            </span>
          </div>

          <Tag>{product.material.split(',')[0]}</Tag>

          <GoldRule className="mt-4" />

          <p className="font-body text-sm font-light text-[var(--color-ink-muted)] leading-relaxed line-clamp-2">
            {product.description}
          </p>
        </div>
      </HoverLift>
    </Link>
  );
}
