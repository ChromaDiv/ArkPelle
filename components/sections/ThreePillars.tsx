import GrainOverlay from '@/components/atoms/GrainOverlay';
import StaggerContainer from '@/components/motion/StaggerContainer';
import FadeInView from '@/components/motion/FadeInView';
import GoldRule from '@/components/atoms/GoldRule';

const pillars = [
  {
    id: 'material',
    label: 'Material',
    body:
      'Full-grain vegetable-tanned leather from a tannery operating since 1870. The top layer only — where the grain is intact, the fiber density highest, the patina most luminous.',
  },
  {
    id: 'craft',
    label: 'Craft',
    body:
      'Every edge is hand-stitched with waxed linen thread and burnished smooth. No adhesives. No shortcuts. The construction is visible because it is something to be proud of.',
  },
  {
    id: 'modernity',
    label: 'Modernity',
    body:
      'A 6.2mm profile. Engineered to disappear in a jacket pocket while holding everything you actually carry. Restraint is not minimalism — it is precision.',
  },
] as const;

/**
 * ThreePillars section — Material / Craft / Modernity.
 * Horizontal desktop, stacked mobile.
 * Server component — StaggerContainer handles client-side animations.
 */
export default function ThreePillars() {
  return (
    <section
      id="pillars"
      className="relative section-pad bg-[var(--color-surface)] overflow-hidden"
      aria-label="Brand pillars"
    >
      <GrainOverlay opacity={0.035} />

      <div className="container-brand relative z-10">
        {/* Section label */}
        <FadeInView>
          <p className="font-body text-2xs tracking-[0.3em] uppercase text-[var(--color-gold)] mb-16">
            The Foundation
          </p>
        </FadeInView>

        {/* Pillar grid */}
        <StaggerContainer
          className="grid grid-cols-1 md:grid-cols-3 gap-0 md:divide-x md:divide-[var(--color-gold-dim)]/30"
          staggerDelay={0.15}
          initialDelay={0.1}
        >
          {pillars.map((pillar) => (
            <div
              key={pillar.id}
              className="px-0 md:px-10 py-10 md:py-0 first:pl-0 last:pr-0 border-b md:border-b-0 border-[var(--color-gold-dim)]/30 last:border-b-0"
            >
              {/* Label */}
              <p className="font-body text-2xs tracking-[0.25em] uppercase text-[var(--color-gold-dim)] mb-5">
                {pillar.label}
              </p>

              {/* Gold rule */}
              <GoldRule className="mb-6 max-w-[3rem]" />

              {/* Body */}
              <p className="font-body text-sm font-light text-[var(--color-ink-muted)] leading-[1.9]">
                {pillar.body}
              </p>
            </div>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
