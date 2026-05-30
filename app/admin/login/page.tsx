'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function AdminLoginPage() {
  const [email, setEmail] = useState(process.env.NEXT_PUBLIC_ADMIN_EMAIL_HINT ?? '');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false, // Admin must already exist in Supabase Auth
        emailRedirectTo: `${window.location.origin}/api/auth/callback?next=/admin/dashboard`,
      },
    });

    setLoading(false);

    if (authError) {
      setError(authError.message);
    } else {
      setSent(true);
    }
  }

  return (
    <div style={styles.page}>
      {/* Grain overlay */}
      <div style={styles.grain} aria-hidden="true" />

      <div className="admin-login-card" style={styles.card}>
        {/* Logo mark */}
        <div style={styles.logoWrap}>
          <svg width="36" height="36" viewBox="0 0 100 100" fill="none" aria-hidden="true">
            <polygon points="23,28 37,15 37,85 23,72" fill="#B8934A" />
            <polygon points="43,28 57,15 57,85 43,72" fill="#B8934A" />
            <polygon points="63,28 77,15 77,85 63,72" fill="#B8934A" />
          </svg>
        </div>

        <h1 style={styles.title}>Ark Pelle</h1>
        <p style={styles.subtitle}>Admin Access</p>

        {!sent ? (
          <form onSubmit={handleSubmit} style={styles.form}>
            <label htmlFor="admin-email" style={styles.label}>
              Email Address
            </label>
            <input
              id="admin-email"
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@arkpelle.com"
              style={styles.input}
              className="admin-login-input"
              disabled={loading}
            />
            {error && <p style={styles.error}>{error}</p>}
            <button
              id="admin-login-btn"
              type="submit"
              disabled={loading || !email}
              style={{
                ...styles.btn,
                opacity: loading || !email ? 0.5 : 1,
                cursor: loading || !email ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? (
                <span style={styles.spinner} aria-hidden="true" />
              ) : (
                'Send Magic Link'
              )}
            </button>
          </form>
        ) : (
          <div style={styles.sentBox}>
            <div style={styles.checkIcon}>✓</div>
            <p style={styles.sentText}>
              Magic link sent to <strong>{email}</strong>.<br />
              Check your inbox and click the link to access the dashboard.
            </p>
          </div>
        )}

        <a href="/" style={styles.backLink}>← Back to site</a>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 480px) {
          .admin-login-card {
            padding: 2.25rem 1.5rem !important;
            margin: 1rem !important;
            gap: 0.15rem !important;
          }
          .admin-login-input {
            font-size: 16px !important; /* Prevents auto-zoom on iOS */
            padding: 0.85rem 1rem !important; /* Larger touch area */
          }
        }
      `}</style>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#0E0A07',
    position: 'relative',
    padding: '2rem',
  },
  grain: {
    position: 'fixed',
    inset: '-50%',
    width: '200%',
    height: '200%',
    backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.04\'/%3E%3C/svg%3E")',
    opacity: 0.5,
    pointerEvents: 'none',
    zIndex: 0,
  },
  card: {
    position: 'relative',
    zIndex: 1,
    width: '100%',
    maxWidth: '400px',
    background: 'rgba(26, 20, 16, 0.92)',
    border: '1px solid rgba(184, 147, 74, 0.2)',
    borderRadius: '4px',
    padding: '3rem 2.5rem',
    backdropFilter: 'blur(12px)',
    animation: 'fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.25rem',
  },
  logoWrap: {
    marginBottom: '1rem',
  },
  title: {
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: '1.75rem',
    fontWeight: 300,
    letterSpacing: '0.15em',
    color: '#EDE8E0',
    margin: 0,
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: '0.7rem',
    letterSpacing: '0.25em',
    color: '#B8934A',
    textTransform: 'uppercase',
    marginBottom: '2rem',
  },
  form: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  label: {
    fontSize: '0.7rem',
    letterSpacing: '0.15em',
    color: '#8A8078',
    textTransform: 'uppercase',
  },
  input: {
    width: '100%',
    background: 'rgba(14, 10, 7, 0.6)',
    border: '1px solid rgba(184, 147, 74, 0.25)',
    borderRadius: '2px',
    color: '#EDE8E0',
    fontSize: '0.9rem',
    padding: '0.75rem 1rem',
    outline: 'none',
    transition: 'border-color 0.3s',
    boxSizing: 'border-box',
  },
  btn: {
    marginTop: '0.5rem',
    width: '100%',
    padding: '0.875rem',
    background: '#B8934A',
    color: '#0E0A07',
    border: 'none',
    borderRadius: '2px',
    fontSize: '0.7rem',
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.4s',
  },
  spinner: {
    width: '16px',
    height: '16px',
    border: '2px solid rgba(14,10,7,0.3)',
    borderTopColor: '#0E0A07',
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
    display: 'inline-block',
  },
  error: {
    color: '#E57373',
    fontSize: '0.8rem',
    margin: 0,
  },
  sentBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem 0',
    width: '100%',
  },
  checkIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    border: '1.5px solid #B8934A',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#B8934A',
    fontSize: '1.25rem',
  },
  sentText: {
    color: '#8A8078',
    fontSize: '0.875rem',
    textAlign: 'center',
    lineHeight: 1.6,
  },
  backLink: {
    marginTop: '1.5rem',
    fontSize: '0.7rem',
    letterSpacing: '0.12em',
    color: '#8A8078',
    textDecoration: 'none',
    textTransform: 'uppercase',
    transition: 'color 0.3s',
  },
};
