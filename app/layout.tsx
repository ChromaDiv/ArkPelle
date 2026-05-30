import type { Metadata } from 'next';
import { Cormorant_Garamond, DM_Sans } from 'next/font/google';
import './globals.css';
import { SupabaseProvider } from '@/components/providers/SupabaseProvider';
import { CartProvider } from '@/components/cart/CartProvider';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Ark Pelle — The Architecture of Leather',
    template: '%s | Ark Pelle',
  },
  description:
    'The Architecture of Leather. Post-luxury leather goods, crafted without compromise. The No. 1 Slim Wallet — full-grain vegetable-tanned leather, hand-stitched edges, 6.2mm profile.',
  keywords: ['leather wallet', 'slim wallet', 'full-grain leather', 'luxury wallet', 'minimalist wallet'],
  openGraph: {
    title: 'Ark Pelle — The Architecture of Leather',
    description: 'The Architecture of Leather. Post-luxury leather goods, crafted without compromise.',
    type: 'website',
    locale: 'en_US',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body>
        <SupabaseProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}
