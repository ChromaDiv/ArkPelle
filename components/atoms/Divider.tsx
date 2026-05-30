import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface DividerProps {
  className?: string;
  /** Optional centered label slot */
  label?: ReactNode;
}

/**
 * Section divider — a gold rule with an optional centered label.
 * When no label, renders a plain gold hairline.
 */
export default function Divider({ className, label }: DividerProps) {
  if (!label) {
    return (
      <div className={cn('w-full', className)}>
        <hr className="gold-rule border-none" />
      </div>
    );
  }

  return (
    <div className={cn('flex items-center gap-6 w-full', className)}>
      <hr className="gold-rule flex-1 border-none" />
      <span
        className="text-2xs font-body tracking-[0.2em] uppercase text-[var(--color-ink-muted)] shrink-0"
      >
        {label}
      </span>
      <hr className="gold-rule flex-1 border-none" />
    </div>
  );
}
