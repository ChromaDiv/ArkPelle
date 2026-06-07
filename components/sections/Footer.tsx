import Link from 'next/link';
import GoldRule from '@/components/atoms/GoldRule';

const navLinks = [
  { href: '/shop', label: 'Shop' },
  { href: '/#manifesto', label: 'Our Story' },
  { href: '/#horizon', label: 'Horizon' },
  { href: '/#pillars', label: 'Craft' },
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
          <div className="flex flex-col gap-4">
            <Link href="/" aria-label="Ark Pelle — Home">
              <img
                src="/logo.svg"
                alt="Ark Pelle"
                width={140}
                height={28}
                className="h-7 w-auto transition-opacity duration-300 hover:opacity-80"
              />
            </Link>
            <p className="font-body text-xs font-light text-[var(--color-ink-muted)] tracking-[0.08em] max-w-xs leading-relaxed">
              The Architecture of Leather. Post-luxury leather goods, made without compromise.
            </p>
            {/* Social Media Icons */}
            <div className="flex items-center gap-4 mt-2">
              <a
                href="https://www.instagram.com/arkpelle?igsh=NjJ0ZzN0djhhZ2M4&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Ark Pelle on Instagram"
                className="text-[var(--color-ink-muted)] hover:text-[var(--color-gold)] transition-colors duration-300"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a
                href="https://facebook.com/arkpelle"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Ark Pelle on Facebook"
                className="text-[var(--color-ink-muted)] hover:text-[var(--color-gold)] transition-colors duration-300"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a
                href="https://tiktok.com/@arkpelle"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Ark Pelle on TikTok"
                className="text-[var(--color-ink-muted)] hover:text-[var(--color-gold)] transition-colors duration-300"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
                </svg>
              </a>
            </div>
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
