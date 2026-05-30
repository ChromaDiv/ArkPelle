import type { Product } from '@/lib/supabase/types';
import ProductCard from '@/components/molecules/ProductCard';
import { cn } from '@/lib/utils';

interface ProductGridProps {
  products: Product[];
  className?: string;
}

/**
 * ProductGrid — sparse grid of product cards.
 * 1-column mobile, 2-column tablet, 3-column desktop.
 * Server component.
 */
export default function ProductGrid({ products, className }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="py-24 text-center">
        <p className="font-body text-sm text-[var(--color-ink-muted)] tracking-[0.1em]">
          No products available at this time.
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16',
        className
      )}
    >
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          priority={index === 0}
        />
      ))}
    </div>
  );
}
