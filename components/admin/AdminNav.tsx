'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  {
    href: '/admin/dashboard',
    label: 'Products',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
      </svg>
    ),
  },
];

export default function AdminNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile Top Navigation Header */}
      <header className="admin-mobile-header">
        <button 
          onClick={toggleMenu} 
          className="admin-hamburger" 
          aria-label="Toggle Menu"
          aria-expanded={isOpen}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EDE8E0" strokeWidth="1.5">
            {isOpen ? (
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round"/>
            )}
          </svg>
        </button>
        <div className="admin-mobile-brand">
          <svg width="20" height="20" viewBox="0 0 36 36" fill="none" style={{ marginRight: '6px' }}>
            <polygon points="18,2 34,10 34,26 18,34 2,26 2,10" stroke="#B8934A" strokeWidth="1.5" fill="none"/>
            <polygon points="18,9 27,13.5 27,22.5 18,27 9,22.5 9,13.5" fill="#B8934A" opacity="0.22"/>
          </svg>
          <span className="admin-mobile-title">Ark Pelle Admin</span>
        </div>
      </header>

      {/* Sidebar Overlay for Mobile/Tablet drawer */}
      <div 
        className={`admin-sidebar-overlay ${isOpen ? 'open' : ''}`} 
        onClick={closeMenu} 
      />

      {/* Main Administrative Sidebar */}
      <aside className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
        {/* Brand mark */}
        <div style={styles.brand}>
          <div style={styles.hexWrap} aria-hidden="true">
            <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
              <polygon points="18,2 34,10 34,26 18,34 2,26 2,10" stroke="#B8934A" strokeWidth="1.5" fill="none"/>
              <polygon points="18,9 27,13.5 27,22.5 18,27 9,22.5 9,13.5" fill="#B8934A" opacity="0.22"/>
            </svg>
          </div>
          <div>
            <span style={styles.brandName}>Ark Pelle</span>
            <span style={styles.brandRole}>Admin</span>
          </div>
        </div>

        {/* Gold hairline */}
        <div style={styles.rule} />

        {/* Nav links */}
        <nav style={styles.nav} aria-label="Admin navigation">
          {navLinks.map(link => {
            const isActive =
              link.href === '/admin/dashboard'
                ? pathname.startsWith('/admin/dashboard')
                : pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                id={`admin-nav-${link.label.toLowerCase()}`}
                style={{
                  ...styles.navLink,
                  ...(isActive ? styles.navLinkActive : {}),
                }}
              >
                <span style={{ opacity: isActive ? 1 : 0.55 }}>{link.icon}</span>
                <span>{link.label}</span>
                {isActive && <span style={styles.activeIndicator} />}
              </Link>
            );
          })}
        </nav>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Bottom links */}
        <div style={styles.bottom}>
          <div style={styles.rule} />
          <Link href="/" style={styles.bottomLink} id="admin-nav-back-to-site">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}>
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
            Back to Site
          </Link>
        </div>
      </aside>

      <style>{`
        .admin-mobile-header {
          display: none;
          align-items: center;
          height: 60px;
          background: #0B0806;
          border-bottom: 1px solid rgba(184, 147, 74, 0.15);
          padding: 0 1rem;
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .admin-hamburger {
          background: transparent;
          border: none;
          padding: 0.5rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          transition: background 0.2s;
        }
        .admin-hamburger:active {
          background: rgba(184, 147, 74, 0.1);
        }
        .admin-mobile-brand {
          display: flex;
          align-items: center;
          margin-left: 0.5rem;
        }
        .admin-mobile-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 0.95rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #EDE8E0;
        }
        .admin-sidebar {
          width: 220px;
          flex-shrink: 0;
          min-height: 100vh;
          background: #0B0806;
          border-right: 1px solid rgba(184, 147, 74, 0.12);
          display: flex;
          flex-direction: column;
          padding: 1.5rem 0;
          position: sticky;
          top: 0;
          align-self: flex-start;
          height: 100vh;
          overflow-y: auto;
        }

        @media (max-width: 1024px) {
          .admin-mobile-header {
            display: flex;
          }
          .admin-sidebar {
            position: fixed;
            left: 0;
            top: 0;
            height: 100vh;
            z-index: 1001;
            transform: translateX(-100%);
            transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            box-shadow: 10px 0 30px rgba(0,0,0,0.5);
          }
          .admin-sidebar.open {
            transform: translateX(0);
          }
          .admin-sidebar-overlay {
            position: fixed;
            inset: 0;
            background: rgba(14, 10, 7, 0.75);
            backdrop-filter: blur(4px);
            z-index: 1000;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease;
          }
          .admin-sidebar-overlay.open {
            opacity: 1;
            pointer-events: auto;
          }
        }
      `}</style>
    </>
  );
}

const styles: Record<string, React.CSSProperties> = {
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0 1.25rem',
    marginBottom: '1.5rem',
  },
  hexWrap: {
    flexShrink: 0,
  },
  brandName: {
    display: 'block',
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: '1rem',
    fontWeight: 300,
    letterSpacing: '0.12em',
    color: '#EDE8E0',
    textTransform: 'uppercase',
    lineHeight: 1.1,
  },
  brandRole: {
    display: 'block',
    fontSize: '0.6rem',
    letterSpacing: '0.22em',
    color: '#B8934A',
    textTransform: 'uppercase',
  },
  rule: {
    height: '1px',
    margin: '0 1.25rem',
    background: 'linear-gradient(90deg, transparent 0%, rgba(184,147,74,0.3) 50%, transparent 100%)',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
    padding: '1rem 0.75rem',
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem 0.75rem', // Larger touch target
    borderRadius: '3px',
    fontSize: '0.75rem',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: '#8A8078',
    textDecoration: 'none',
    position: 'relative',
    transition: 'color 0.3s, background 0.3s',
  },
  navLinkActive: {
    color: '#EDE8E0',
    background: 'rgba(184, 147, 74, 0.08)',
  },
  activeIndicator: {
    position: 'absolute',
    left: 0,
    top: '50%',
    transform: 'translateY(-50%)',
    width: '2px',
    height: '60%',
    background: '#B8934A',
    borderRadius: '0 2px 2px 0',
  },
  bottom: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  bottomLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.25rem', // Larger touch target
    fontSize: '0.7rem',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: '#8A8078',
    textDecoration: 'none',
    transition: 'color 0.3s',
  },
};
