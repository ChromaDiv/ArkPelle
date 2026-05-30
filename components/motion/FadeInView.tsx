'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface FadeInViewProps {
  children: ReactNode;
  className?: string;
  /** Delay before animation starts (seconds). Default: 0 */
  delay?: number;
  /** Y offset to animate from (px). Default: 24 */
  yOffset?: number;
  /** Duration in seconds. Default: 0.8 */
  duration?: number;
}

/**
 * Scroll-triggered fade-in + subtle upward reveal.
 * Respects prefers-reduced-motion — reduces to instant opacity fade only.
 * Uses luxury easing: cubic-bezier(0.16, 1, 0.3, 1)
 */
export default function FadeInView({
  children,
  className,
  delay = 0,
  yOffset = 24,
  duration = 0.8,
}: FadeInViewProps) {
  const shouldReduce = useReducedMotion();

  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, y: shouldReduce ? 0 : yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{
        duration: shouldReduce ? 0.01 : duration,
        delay: shouldReduce ? 0 : delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
