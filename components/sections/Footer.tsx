import Link from 'next/link';
import GoldRule from '@/components/atoms/GoldRule';

const navLinks = [
  { href: '/shop', label: 'Shop' },
  { href: '#manifesto', label: 'Our Story' },
  { href: '#horizon', label: 'Horizon' },
  { href: '#pillars', label: 'Craft' },
] as const;

const legalLinks = [
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Sale' },
  { href: '/returns', label: 'Returns' },
] as const;

/**
 * Footer — minimal, gold logotype, muted nav links, legal line.
 * Server component.
 */
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="bg-[var(--color-ground)] border-t border-[var(--color-gold-dim)]/20"
      role="contentinfo"
    >
      <div className="container-brand py-16">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-12">
          {/* Logo + tagline */}
          <div>
            <Link href="/" aria-label="Ark Pelle — Home">
              <img
                src="/logo.svg"
                alt="Ark Pelle"
                width={140}
                height={28}
                className="h-7 w-auto mb-4"
              />
            </Link>
            <p className="font-body text-xs font-light text-[var(--color-ink-muted)] tracking-[0.08em] max-w-xs leading-relaxed">
              The Architecture of Leather. Post-luxury leather goods, made without compromise.
            </p>
          </div>

          {/* Navigation */}
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap gap-8">
              {navLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="font-body text-xs tracking-[0.15em] uppercase text-[var(--color-ink-muted)] hover:text-[var(--color-gold)] transition-colors duration-500"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <GoldRule className="my-10" />

        {/* Legal row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="font-body text-2xs text-[var(--color-ink-muted)]/60 tracking-[0.05em]">
            © {year} Ark Pelle. All rights reserved.
          </p>
          <nav aria-label="Legal navigation">
            <ul className="flex gap-6">
              {legalLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="font-body text-2xs tracking-[0.08em] text-[var(--color-ink-muted)]/60 hover:text-[var(--color-ink-muted)] transition-colors duration-300"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
