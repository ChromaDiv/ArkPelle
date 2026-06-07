'use client';

import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface CartLinkProps {
  className?: string;
}

export default function CartLink({ className }: CartLinkProps) {
  const { itemCount } = useCart();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by rendering item count only after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const countDisplay = mounted && itemCount > 0 ? ` (${itemCount})` : '';

  return (
    <Link
      href="/checkout"
      id="nav-cart-link"
      aria-label={`View bag, ${mounted ? itemCount : 0} items`}
      className={cn(
        "font-body text-xs tracking-[0.2em] uppercase transition-colors duration-500",
        mounted && itemCount > 0
          ? "text-[var(--color-gold)] font-semibold"
          : "text-[var(--color-ink-muted)] hover:text-[var(--color-gold)]",
        className
      )}
    >
      Bag{countDisplay}
    </Link>
  );
}
