import { cn } from '@/lib/utils';

interface GrainOverlayProps {
  className?: string;
  /** Opacity as a fraction 0–1. Default: 0.04 */
  opacity?: number;
}

/**
 * SVG feTurbulence grain overlay.
 * Absolutely positioned to fill its nearest relative parent.
 * pointer-events: none so it never blocks interaction.
 */
export default function GrainOverlay({ className, opacity = 0.04 }: GrainOverlayProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-0 overflow-hidden select-none',
        className
      )}
      style={{ opacity }}
    >
      <svg
        className="grain-animate h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        style={{ position: 'absolute', top: '-10%', left: '-10%', width: '120%', height: '120%' }}
      >
        <filter id="grain-filter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain-filter)" />
      </svg>
    </div>
  );
}
