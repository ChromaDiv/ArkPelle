'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface HoverLiftProps {
  children: ReactNode;
  className?: string;
  /** Y lift amount in px. Default: -4 */
  liftY?: number;
}

/**
 * Wraps children with a subtle hover lift effect.
 * Heavy, deliberate motion — 400ms luxury ease.
 * Disabled when prefers-reduced-motion is set.
 */
export default function HoverLift({ children, className, liftY = -4 }: HoverLiftProps) {
  const shouldReduce = useReducedMotion();

  return (
    <motion.div
      className={cn('cursor-pointer', className)}
      whileHover={shouldReduce ? {} : { y: liftY }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
