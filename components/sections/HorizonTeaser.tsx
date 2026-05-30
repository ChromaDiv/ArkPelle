'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import GrainOverlay from '@/components/atoms/GrainOverlay';
import GoldRule from '@/components/atoms/GoldRule';
import Button from '@/components/atoms/Button';
import FadeInView from '@/components/motion/FadeInView';
import StaggerContainer, { itemVariants } from '@/components/motion/StaggerContainer';
import { createClient } from '@/lib/supabase/client';

const comingCollections = [
  { label: 'The Belt', teaser: 'Q3 2026', slug: 'belt' },
  { label: 'The Folio', teaser: 'Q4 2026', slug: 'folio' },
  { label: 'The Card Sleeve', teaser: 'Q3 2026', slug: 'card-sleeve' },
] as const;

type FormState = 'idle' | 'loading' | 'success' | 'error';

/**
 * HorizonTeaser — moody coming-soon section with email capture.
 * Client component — form interaction + Supabase insert.
 */
export default function HorizonTeaser() {
  const [email, setEmail] = useState('');
  const [formState, setFormState] = useState<FormState>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const shouldReduce = useReducedMotion();
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormState('loading');
    setErrorMessage('');

    startTransition(async () => {
      const supabase = createClient();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from('waitlist')
        .insert({ email: email.trim().toLowerCase() });

      if (error) {
        if (error.code === '23505') {
          // Unique constraint — already registered
          setFormState('success');
        } else {
          setFormState('error');
          setErrorMessage('Something went wrong. Please try again.');
        }
      } else {
        setFormState('success');
        setEmail('');
      }
    });
  }

  return (
    <section
      id="horizon"
      className="relative section-pad bg-[var(--color-surface)] overflow-hidden"
      aria-label="Horizon — coming soon"
    >
      {/* Background image — blurred, moody */}
      <div className="absolute inset-0 opacity-25">
        <Image
          src="/horizon_bg.jpg"
          alt="Premium Ark Pelle leather bag with gold slashes on dark surface"
          fill
          sizes="100vw"
          className="object-cover object-center blur-sm scale-105"
          aria-hidden="true"
        />
      </div>
      <GrainOverlay opacity={0.06} />

      <div className="relative z-10 container-brand">
        <div className="max-w-2xl mx-auto text-center">
          {/* Label */}
          <FadeInView>
            <p className="font-body text-2xs tracking-[0.3em] uppercase text-[var(--color-gold)] mb-10">
              What Comes Next
            </p>
          </FadeInView>

          {/* Heading */}
          <FadeInView delay={0.1}>
            <h2
              className="font-display font-light text-[clamp(2.5rem,6vw,5rem)] text-[var(--color-ink)] leading-tight tracking-[0.02em] mb-8"
              style={{ fontOpticalSizing: 'auto' } as React.CSSProperties}
            >
              The Horizon Collection
            </h2>
          </FadeInView>

          <FadeInView delay={0.15}>
            <GoldRule className="max-w-xs mx-auto mb-12" />
          </FadeInView>

          {/* Coming collections */}
          <StaggerContainer
            className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-16"
            staggerDelay={0.12}
          >
            {comingCollections.map((col) => (
              <motion.div
                key={col.slug}
                variants={itemVariants}
                className="text-center"
              >
                <p className="font-display font-light text-xl text-[var(--color-ink)] mb-1">
                  {col.label}
                </p>
                <p className="font-body text-2xs tracking-[0.2em] uppercase text-[var(--color-gold-dim)]">
                  {col.teaser}
                </p>
              </motion.div>
            ))}
          </StaggerContainer>

          {/* Email capture */}
          <FadeInView delay={0.3}>
            <div className="max-w-md mx-auto">
              <p className="font-body text-sm font-light text-[var(--color-ink-muted)] mb-8 leading-relaxed">
                Be the first to know when the next piece is ready.
                No frequency. No noise. One email, when it matters.
              </p>

              <AnimatePresence mode="wait">
                {formState === 'success' ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: shouldReduce ? 0 : 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col items-center gap-3"
                    role="status"
                    aria-live="polite"
                  >
                    {/* Checkmark */}
                    <div className="w-10 h-10 rounded-full border border-[var(--color-gold)] flex items-center justify-center">
                      <svg width="16" height="12" viewBox="0 0 16 12" fill="none" aria-hidden="true">
                        <path d="M1 6L6 11L15 1" stroke="var(--color-gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <p className="font-body text-sm text-[var(--color-ink)] tracking-[0.05em]">
                      You are on the list.
                    </p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    className="flex flex-col sm:flex-row border border-[var(--color-gold-dim)]/60"
                    noValidate
                    aria-label="Join the waitlist"
                  >
                    <label htmlFor="horizon-email" className="sr-only">
                      Email address
                    </label>
                    <input
                      id="horizon-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="your@email.com"
                      disabled={formState === 'loading' || isPending}
                      className="flex-1 bg-transparent px-5 py-4 font-body text-base md:text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] focus-visible:ring-inset"
                      aria-describedby={formState === 'error' ? 'horizon-email-error' : undefined}
                    />
                    <Button
                      type="submit"
                      variant="outline"
                      size="md"
                      loading={formState === 'loading' || isPending}
                      className="border-0 border-t sm:border-t-0 sm:border-l border-[var(--color-gold-dim)]/60 rounded-none shrink-0 w-full sm:w-auto"
                    >
                      Notify Me
                    </Button>
                  </motion.form>
                )}
              </AnimatePresence>

              {formState === 'error' && (
                <p
                  id="horizon-email-error"
                  className="mt-3 font-body text-xs text-red-400 text-center"
                  role="alert"
                >
                  {errorMessage}
                </p>
              )}
            </div>
          </FadeInView>
        </div>
      </div>
    </section>
  );
}
