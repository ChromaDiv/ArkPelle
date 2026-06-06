'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { ProductImage } from '@/lib/supabase/types';

interface ImageGalleryProps {
  images: ProductImage[];
  productName: string;
  className?: string;
}

/**
 * ImageGallery — full-bleed image gallery with keyboard + swipe navigation.
 * Arrows, dot indicators, keyboard left/right/escape support.
 * Reduced-motion: disables slide transitions.
 */
export default function ImageGallery({ images, productName, className }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(() => {
    const mainIdx = images.findIndex(img => img.isMain);
    return mainIdx !== -1 ? mainIdx : 0;
  });
  const [direction, setDirection] = useState<1 | -1>(1);
  const shouldReduce = useReducedMotion();

  const goTo = useCallback(
    (index: number) => {
      setDirection(index > activeIndex ? 1 : -1);
      setActiveIndex(index);
    },
    [activeIndex]
  );

  const goPrev = useCallback(() => {
    goTo(activeIndex === 0 ? images.length - 1 : activeIndex - 1);
  }, [activeIndex, goTo, images.length]);

  const goNext = useCallback(() => {
    goTo(activeIndex === images.length - 1 ? 0 : activeIndex + 1);
  }, [activeIndex, goTo, images.length]);

  // Keyboard navigation
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [goPrev, goNext]);

  // Touch/swipe support
  let touchStartX = 0;
  function handleTouchStart(e: React.TouchEvent) {
    touchStartX = e.touches[0]?.clientX ?? 0;
  }
  function handleTouchEnd(e: React.TouchEvent) {
    const diff = touchStartX - (e.changedTouches[0]?.clientX ?? 0);
    if (Math.abs(diff) > 40) {
      diff > 0 ? goNext() : goPrev();
    }
  }

  const slideVariants = {
    enter: (dir: number) => ({ x: shouldReduce ? 0 : dir * 60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: shouldReduce ? 0 : dir * -60, opacity: 0 }),
  };

  if (images.length === 0) return null;

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {/* Main image */}
      <div
        className="relative aspect-[4/5] overflow-hidden bg-[var(--color-surface)] cursor-grab active:cursor-grabbing"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        role="region"
        aria-label={`Product images for ${productName}`}
        aria-live="polite"
      >
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={activeIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={images[activeIndex]!.url}
              alt={images[activeIndex]!.alt}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority={activeIndex === 0}
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={goPrev}
              aria-label="Previous image"
              className={cn(
                'absolute left-4 top-1/2 -translate-y-1/2 z-10',
                'w-10 h-10 flex items-center justify-center',
                'bg-[var(--color-ground)]/60 backdrop-blur-sm border border-[var(--color-gold-dim)]/40',
                'text-[var(--color-ink)] hover:text-[var(--color-gold)] hover:border-[var(--color-gold-dim)]',
                'transition-all duration-300',
                'focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] focus-visible:outline-none'
              )}
            >
              <ChevronLeft />
            </button>
            <button
              onClick={goNext}
              aria-label="Next image"
              className={cn(
                'absolute right-4 top-1/2 -translate-y-1/2 z-10',
                'w-10 h-10 flex items-center justify-center',
                'bg-[var(--color-ground)]/60 backdrop-blur-sm border border-[var(--color-gold-dim)]/40',
                'text-[var(--color-ink)] hover:text-[var(--color-gold)] hover:border-[var(--color-gold-dim)]',
                'transition-all duration-300',
                'focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] focus-visible:outline-none'
              )}
            >
              <ChevronRight />
            </button>
          </>
        )}

        {/* Counter */}
        <div className="absolute bottom-4 right-4 bg-[var(--color-ground)]/70 backdrop-blur-sm px-3 py-1">
          <p className="font-body text-2xs tracking-[0.1em] text-[var(--color-ink-muted)]">
            {activeIndex + 1} / {images.length}
          </p>
        </div>
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto" role="tablist" aria-label="Image thumbnails">
          {images.map((img, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === activeIndex}
              aria-label={`View image ${i + 1}: ${img.alt}`}
              onClick={() => goTo(i)}
              className={cn(
                'relative w-16 h-20 shrink-0 overflow-hidden transition-all duration-300',
                'focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] focus-visible:outline-none',
                i === activeIndex
                  ? 'ring-1 ring-[var(--color-gold)]'
                  : 'opacity-50 hover:opacity-80'
              )}
            >
              <Image src={img.url} alt={img.alt} fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ChevronLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
