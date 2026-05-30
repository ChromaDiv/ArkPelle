import GrainOverlay from '@/components/atoms/GrainOverlay';
import FadeInView from '@/components/motion/FadeInView';
import GoldRule from '@/components/atoms/GoldRule';

/**
 * Manifesto section — brand voice, ~120 words copy, large pull quote.
 * Server component; FadeInView client wrappers for scroll animations.
 */
export default function Manifesto() {
  return (
    <section
      id="manifesto"
      className="relative section-pad bg-[var(--color-ground)] overflow-hidden"
      aria-label="Brand manifesto"
    >
      <GrainOverlay />

      <div className="container-brand relative z-10">
        {/* Section label */}
        <FadeInView delay={0}>
          <p className="font-body text-2xs tracking-[0.3em] uppercase text-[var(--color-gold)] mb-12">
            On Craft
          </p>
        </FadeInView>

        <div className="max-w-2xl mx-auto">
          {/* Pull quote */}
          <FadeInView delay={0.1}>
            <blockquote className="mb-14">
              <p
                className="font-display italic font-light text-[clamp(1.75rem,4vw,3.5rem)] text-[var(--color-ink)] leading-[1.2] tracking-[0.02em]"
                style={{ fontOpticalSizing: 'auto' } as React.CSSProperties}
              >
                &ldquo;We make one thing, and we make it as well as it can be made.&rdquo;
              </p>
            </blockquote>
          </FadeInView>

          <FadeInView delay={0.2}>
            <GoldRule className="mb-14 max-w-xs" />
          </FadeInView>

          {/* Body copy — ~120 words */}
          <FadeInView delay={0.3}>
            <div className="space-y-6 font-body text-base font-light text-[var(--color-ink-muted)] leading-[1.9]">
              <p>
                There is a particular satisfaction in an object that has been reduced to its essence
                — every element considered, every excess removed. The No. 1 began with a single
                question: what is the least a wallet can be while remaining everything it must be?
              </p>
              <p>
                Full-grain leather, selected from the top layer of the hide where the grain is
                tightest and most durable. Linen thread, waxed and hand-stitched at the edges
                because it is stronger than any machine stitch and because it shows. Six cards,
                two pockets, 6.2mm at its thickest point. Nothing else.
              </p>
              <p>
                It will age with you. That is the point.
              </p>
            </div>
          </FadeInView>
        </div>
      </div>
    </section>
  );
}
