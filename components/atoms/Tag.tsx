import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface TagProps {
  children: ReactNode;
  className?: string;
}

/**
 * A small uppercase label pill — used for material callouts,
 * category labels, and status indicators.
 * Gold border, muted ink text.
 */
export default function Tag({ children, className }: TagProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 text-2xs font-body font-normal',
        'tracking-[0.15em] uppercase',
        'border border-[var(--color-gold-dim)]',
        'text-[var(--color-ink-muted)]',
        className
      )}
    >
      {children}
    </span>
  );
}
