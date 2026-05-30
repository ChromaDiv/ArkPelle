import type { Metadata } from 'next';
import Hero from '@/components/sections/Hero';
import Manifesto from '@/components/sections/Manifesto';
import ThreePillars from '@/components/sections/ThreePillars';
import ProductDeepDive from '@/components/sections/ProductDeepDive';
import HorizonTeaser from '@/components/sections/HorizonTeaser';
import Footer from '@/components/sections/Footer';

export const metadata: Metadata = {
  title: 'Ark Pelle — The Architecture of Leather',
  description:
    'The Architecture of Leather. Post-luxury leather goods, crafted without compromise. The No. 1 Slim Wallet — full-grain vegetable-tanned leather, hand-stitched edges, 6.2mm profile.',
};

/**
 * Homepage — server component.
 * Assembles all homepage sections in order.
 * Interactive/animated sections are client components,
 * but they are imported here and rendered by the server shell.
 */
export default function HomePage() {
  return (
    <main>
      <Hero />
      <Manifesto />
      <ThreePillars />
      <ProductDeepDive />
      <HorizonTeaser />
      <Footer />
    </main>
  );
}
