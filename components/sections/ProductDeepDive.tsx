'use client';

import { useRef } from 'react';
import { useScroll, useTransform, motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import GrainOverlay from '@/components/atoms/GrainOverlay';
import GoldRule from '@/components/atoms/GoldRule';
import Tag from '@/components/atoms/Tag';

const features = [
  {
    id: 'leather',
    tag: 'Material',
    title: 'Full-Grain Leather',
    body: 'From the top layer of a single hide. The grain is intact — unaltered, unsanded. It absorbs oils, develops patina, and becomes more beautiful with time. No other grade of leather can claim this.',
    image: '/feature_material.jpg',
    imageAlt: 'Rich macro texture close-up of premium full-grain brown leather grain showing creases',
  },
  {
    id: 'stitch',
    tag: 'Construction',
    title: 'Hand-Stitched Edges',
    body: 'Waxed linen thread, pulled through pre-punched holes by hand. A saddle-stitch that locks at every point — if one thread breaks, the others hold. The stitch is visible because it is the signature of the maker.',
    image: '/feature_construction.jpg',
    imageAlt: 'Handmade black leather bifold wallet detail showing hand-stitched waxed linen thread',
  },
  {
    id: 'capacity',
    tag: 'Function',
    title: '6-Card Capacity',
    body: 'Two card slots, one per side. Three cards each. An additional slip pocket on each face for cash, receipts, or the card you reach for most. Engineered through iteration, not assumption.',
    image: '/feature_function.jpg',
    imageAlt: 'Three premium black and dark brown wallets sitting on a wooden table, showing beautiful design variety',
  },
  {
    id: 'profile',
    tag: 'Geometry',
    title: '6.2mm Profile',
    body: 'At its fullest — six cards loaded — the No. 1 measures 6.2mm across. Thinner than a pencil. Disappears in a jacket pocket, barely registers in a trouser. This is engineering expressed as restraint.',
    image: '/feature_geometry.jpg',
    imageAlt: 'Person holding a slim brown leather cardholder wallet showing its thin profile in hand',
  },
] as const;

/**
 * ProductDeepDive — sticky-scroll feature walkthrough.
 * Client component — requires useScroll for scroll-driven transitions.
 */
export default function ProductDeepDive() {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  return (
    <section
      id="deep-dive"
      ref={containerRef}
      className="relative bg-[var(--color-ground)]"
      aria-label="Product features"
      style={{ height: `${features.length * 100}vh` }}
    >
      <GrainOverlay />

      {/* Sticky panel */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Immersive Background Images Layer */}
        <div className="absolute inset-0 pointer-events-none z-0">
          {features.map((feature, index) => {
            const start = index / features.length;
            const end = (index + 1) / features.length;

            return (
              <BackgroundImage
                key={feature.id}
                image={feature.image}
                imageAlt={feature.imageAlt}
                scrollYProgress={scrollYProgress}
                start={start}
                end={end}
                shouldReduce={shouldReduce ?? false}
              />
            );
          })}
        </div>

        <div className="container-brand h-full flex flex-col justify-center py-16 relative z-10">
          {/* Section label */}
          <div className="absolute top-12 left-[clamp(1.5rem,5vw,6rem)]">
            <p className="font-body text-2xs tracking-[0.3em] uppercase text-[var(--color-gold)]">
              The Object
            </p>
          </div>

          {/* Feature panels */}
          <div className="relative w-full h-[600px] md:h-[500px]">
            {features.map((feature, index) => {
              const start = index / features.length;
              const end = (index + 1) / features.length;

              return (
                <FeaturePanel
                  key={feature.id}
                  feature={feature}
                  scrollYProgress={scrollYProgress}
                  start={start}
                  end={end}
                  shouldReduce={shouldReduce ?? false}
                />
              );
            })}
          </div>

          {/* Progress dots */}
          <div
            className="absolute bottom-12 right-[clamp(1.5rem,5vw,6rem)] flex flex-col gap-2"
            aria-hidden="true"
          >
            {features.map((_, index) => {
              return (
                <ProgressDot
                  key={index}
                  scrollYProgress={scrollYProgress}
                  start={index / features.length}
                  end={(index + 1) / features.length}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function BackgroundImage({
  image,
  imageAlt,
  scrollYProgress,
  start,
  end,
  shouldReduce,
}: {
  image: string;
  imageAlt: string;
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress'];
  start: number;
  end: number;
  shouldReduce: boolean;
}) {
  const opacity = useTransform(
    scrollYProgress,
    [start, start + 0.05, end - 0.05, end],
    shouldReduce ? [0.35, 0.35, 0.35, 0.35] : [0, 0.35, 0.35, 0]
  );
  const scale = useTransform(
    scrollYProgress,
    [start, end],
    shouldReduce ? [1, 1] : [1.05, 1.0]
  );

  return (
    <motion.div
      className="absolute inset-0 w-full h-full"
      style={{ opacity }}
    >
      <motion.div className="relative w-full h-full" style={{ scale }}>
        <Image
          src={image}
          alt={imageAlt}
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority
        />
        {/* Light elegant Vignette Overlay for crisp background details */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-ground)]/85 via-[var(--color-ground)]/30 to-[var(--color-ground)]/75" />
      </motion.div>
    </motion.div>
  );
}

function FeaturePanel({
  feature,
  scrollYProgress,
  start,
  end,
  shouldReduce,
}: {
  feature: typeof features[number];
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress'];
  start: number;
  end: number;
  shouldReduce: boolean;
}) {
  const opacity = useTransform(
    scrollYProgress,
    [start, start + 0.05, end - 0.05, end],
    shouldReduce ? [1, 1, 1, 1] : [0, 1, 1, 0]
  );
  const y = useTransform(
    scrollYProgress,
    [start, start + 0.1, end - 0.1, end],
    shouldReduce ? [0, 0, 0, 0] : [40, 0, 0, -40]
  );

  return (
    <motion.div
      className="absolute inset-0 flex flex-col md:flex-row items-center gap-12 md:gap-20"
      style={{ opacity, y }}
      aria-hidden={undefined}
    >
      {/* Text side */}
      <div className="flex-1 max-w-lg">
        <Tag className="mb-6">{feature.tag}</Tag>
        <h2
          className="font-display font-light text-[clamp(2rem,5vw,4rem)] text-[var(--color-ink)] leading-tight mb-6 tracking-[0.02em]"
          style={{ fontOpticalSizing: 'auto' } as React.CSSProperties}
        >
          {feature.title}
        </h2>
        <GoldRule className="mb-6 max-w-[4rem]" />
        <p className="font-body text-base font-light text-[var(--color-ink-muted)] leading-[1.9]">
          {feature.body}
        </p>
      </div>

      {/* Image side */}
      <div className="relative flex-1 aspect-square max-w-md w-full rounded-2xl overflow-hidden bg-[var(--color-surface)] shadow-2xl">
        <Image
          src={feature.image}
          alt={feature.imageAlt}
          fill
          sizes="(max-width: 768px) 90vw, 40vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[var(--color-ground)]/40" />
      </div>
    </motion.div>
  );
}

function ProgressDot({
  scrollYProgress,
  start,
  end,
}: {
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress'];
  start: number;
  end: number;
}) {
  const opacity = useTransform(scrollYProgress, [start, start + 0.05, end - 0.05, end], [0.3, 1, 1, 0.3]);
  const scale = useTransform(scrollYProgress, [start, start + 0.05, end - 0.05, end], [1, 1.5, 1.5, 1]);

  return (
    <motion.div
      className="w-1 h-1 rounded-full bg-[var(--color-gold)]"
      style={{ opacity, scale }}
    />
  );
}
