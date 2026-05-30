import { cn } from '@/lib/utils';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'ghost' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children: ReactNode;
  className?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: [
    'bg-[var(--color-gold)] text-[var(--color-ground)]',
    'hover:bg-[var(--color-gold-dim)]',
    'focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-ground)]',
  ].join(' '),
  ghost: [
    'bg-transparent text-[var(--color-ink)]',
    'hover:text-[var(--color-gold)]',
    'focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-ground)]',
  ].join(' '),
  outline: [
    'bg-transparent text-[var(--color-ink)] border border-[var(--color-gold-dim)]',
    'hover:border-[var(--color-gold)] hover:text-[var(--color-gold)]',
    'focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-ground)]',
  ].join(' '),
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-5 py-2 text-xs tracking-[0.12em]',
  md: 'px-8 py-3 text-sm tracking-[0.15em]',
  lg: 'px-12 py-4 text-sm tracking-[0.2em]',
};

/**
 * Brand Button — three variants (primary/ghost/outline), three sizes.
 * Transitions use the luxury easing curve.
 * Respects disabled and loading states.
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      className={cn(
        'relative inline-flex items-center justify-center gap-2',
        'font-body font-normal uppercase',
        'transition-all duration-[600ms]',
        'outline-none',
        variantStyles[variant],
        sizeStyles[size],
        isDisabled && 'opacity-40 cursor-not-allowed pointer-events-none',
        className
      )}
      style={{ transitionTimingFunction: 'var(--ease-luxury)' }}
      disabled={isDisabled}
      aria-busy={loading}
      {...props}
    >
      <span className={cn('inline-flex items-center justify-center gap-2', loading && 'opacity-0')}>
        {children}
      </span>
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <LoadingDots />
          <span className="sr-only">Loading…</span>
        </span>
      )}
    </button>
  );
}

function LoadingDots() {
  return (
    <span className="flex gap-1" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1 h-1 rounded-full bg-current animate-pulse"
          style={{ animationDelay: `${i * 200}ms` }}
        />
      ))}
    </span>
  );
}
