'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  /** Delay between each child (seconds). Default: 0.12 */
  staggerDelay?: number;
  /** Initial delay before stagger begins (seconds). Default: 0 */
  initialDelay?: number;
}

const containerVariants = (staggerDelay: number, initialDelay: number) => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: staggerDelay,
      delayChildren: initialDelay,
    },
  },
});

export const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
};

export const itemVariantsReduced = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.01 },
  },
};

/**
 * Stagger container — wraps children with staggered reveal animations.
 * Children must use `itemVariants` (or `itemVariantsReduced`) from this file.
 * Respects prefers-reduced-motion.
 */
export default function StaggerContainer({
  children,
  className,
  staggerDelay = 0.12,
  initialDelay = 0,
}: StaggerContainerProps) {
  const shouldReduce = useReducedMotion();

  return (
    <motion.div
      className={cn(className)}
      variants={containerVariants(
        shouldReduce ? 0 : staggerDelay,
        shouldReduce ? 0 : initialDelay
      )}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
    >
      {children}
    </motion.div>
  );
}
