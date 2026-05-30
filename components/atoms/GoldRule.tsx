import { cn } from '@/lib/utils';

interface GoldRuleProps {
  className?: string;
  /** 'horizontal' (default) or 'vertical' */
  orientation?: 'horizontal' | 'vertical';
}

/**
 * A single-pixel gold hairline rule.
 * Uses a gradient from transparent → gold → transparent
 * for a refined, burnished effect.
 */
export default function GoldRule({ className, orientation = 'horizontal' }: GoldRuleProps) {
  if (orientation === 'vertical') {
    return (
      <div
        aria-hidden="true"
        className={cn('w-px self-stretch', className)}
        style={{
          background: 'linear-gradient(180deg, transparent 0%, var(--color-gold-dim) 20%, var(--color-gold) 50%, var(--color-gold-dim) 80%, transparent 100%)',
        }}
      />
    );
  }

  return (
    <hr
      aria-hidden="true"
      className={cn('gold-rule border-none', className)}
    />
  );
}
