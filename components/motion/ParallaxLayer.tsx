'use client';

import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import type { ReactNode, RefObject } from 'react';
import { cn } from '@/lib/utils';

interface ParallaxLayerProps {
  children: ReactNode;
  className?: string;
  /** Target Y offset at bottom of scroll range (px). Default: -60 */
  yRange?: number;
  /** Optional container ref to use as scroll reference */
  containerRef?: RefObject<HTMLElement | null>;
}

/**
 * Scroll-driven parallax Y offset.
 * Disabled when prefers-reduced-motion is set.
 * Uses window scroll by default; pass containerRef for contained scroll.
 */
export default function ParallaxLayer({
  children,
  className,
  yRange = -60,
  containerRef,
}: ParallaxLayerProps) {
  const shouldReduce = useReducedMotion();

  const { scrollYProgress } = useScroll(
    containerRef ? { target: containerRef, offset: ['start end', 'end start'] } : {}
  );

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    shouldReduce ? [0, 0] : [0, yRange]
  );

  return (
    <motion.div className={cn('will-change-transform', className)} style={{ y }}>
      {children}
    </motion.div>
  );
}
