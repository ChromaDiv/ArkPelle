import { redirect } from 'next/navigation';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server';
import AdminNav from '@/components/admin/AdminNav';
import type { ReactNode } from 'react';

export default async function AdminDashboardLayout({ children }: { children: ReactNode }) {
  // ── Auth guard ──────────────────────────────────────────────────────────────
  // When Supabase is not configured (local dev with placeholder keys),
  // bypass auth so the UI is still explorable.
  const bypassAuth = process.env.BYPASS_AUTH === 'true';
  if (isSupabaseConfigured() && !bypassAuth) {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      redirect('/admin/login');
    }

    const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@arkpelle.com';
    const adminEmails = adminEmail.split(',').map(e => e.trim().toLowerCase());

    if (!adminEmails.includes((user.email ?? '').toLowerCase())) {
      redirect('/');
    }
  }

  return (
    <div className="admin-shell">
      <AdminNav />
      <main className="admin-main">
        {children}
      </main>

      <style>{`
        .admin-shell {
          display: flex;
          min-height: 100vh;
          background: #0E0A07;
          font-family: var(--font-body, 'DM Sans', system-ui, sans-serif);
        }
        .admin-main {
          flex: 1;
          min-width: 0;
          padding: 2rem 2.5rem;
          overflow-x: auto;
        }
        @media (max-width: 1024px) {
          .admin-shell { flex-direction: column; }
          .admin-main { padding: 1.25rem; }
        }
      `}</style>
    </div>
  );
}
