'use client';

import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface AccordionItemProps {
  trigger: string;
  children: ReactNode;
  className?: string;
  defaultOpen?: boolean;
}

/**
 * Accordion item — disclosure pattern with animated height.
 * Uses AnimatePresence for enter/exit, luxury easing.
 * aria-expanded on trigger, aria-hidden on content when closed.
 */
export default function AccordionItem({
  trigger,
  children,
  className,
  defaultOpen = false,
}: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const shouldReduce = useReducedMotion();

  return (
    <div className={cn('border-b border-[var(--color-gold-dim)]/40', className)}>
      <button
        id={`accordion-trigger-${trigger.toLowerCase().replace(/\s+/g, '-')}`}
        aria-expanded={isOpen}
        aria-controls={`accordion-content-${trigger.toLowerCase().replace(/\s+/g, '-')}`}
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          'flex w-full items-center justify-between py-5 text-left',
          'font-body text-sm tracking-[0.1em] uppercase',
          'text-[var(--color-ink)] transition-colors duration-300',
          'hover:text-[var(--color-gold)] focus-visible:text-[var(--color-gold)]',
          'outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--color-ground)]'
        )}
      >
        <span>{trigger}</span>
        {/* Plus/minus icon */}
        <span
          className="relative w-4 h-4 shrink-0 ml-4"
          aria-hidden="true"
        >
          <span className={cn(
            'absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-current',
            'transition-opacity duration-300',
          )} />
          <span className={cn(
            'absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-current',
            'transition-transform duration-500 ease-[var(--ease-luxury)]',
            isOpen ? 'rotate-0 opacity-0' : 'rotate-90 opacity-100'
          )} />
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`accordion-content-${trigger.toLowerCase().replace(/\s+/g, '-')}`}
            role="region"
            aria-labelledby={`accordion-trigger-${trigger.toLowerCase().replace(/\s+/g, '-')}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: 'auto',
              opacity: 1,
              transition: {
                height: { duration: shouldReduce ? 0.01 : 0.5, ease: [0.16, 1, 0.3, 1] },
                opacity: { duration: shouldReduce ? 0.01 : 0.3, delay: shouldReduce ? 0 : 0.1 },
              },
            }}
            exit={{
              height: 0,
              opacity: 0,
              transition: {
                height: { duration: shouldReduce ? 0.01 : 0.4, ease: [0.16, 1, 0.3, 1] },
                opacity: { duration: shouldReduce ? 0.01 : 0.2 },
              },
            }}
            className="overflow-hidden"
          >
            <div className="pb-6 font-body text-sm font-light text-[var(--color-ink-muted)] leading-relaxed">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
