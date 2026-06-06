import Link from 'next/link';
import { getAdminProducts } from '@/app/actions/products';
import ProductTable from '@/components/admin/ProductTable';
import type { Metadata } from 'next';
import { formatPrice } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Products — Admin',
};

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const products = await getAdminProducts();

  const activeCount = products.filter(p => p.is_active).length;
  const draftCount = products.length - activeCount;

  return (
    <div style={styles.page}>
      {/* Page header */}
      <div className="admin-page-header" style={styles.pageHeader}>
        <div>
          <h1 style={styles.pageTitle}>Products</h1>
          <p style={styles.pageMeta}>
            {products.length} total · {activeCount} active · {draftCount} draft
          </p>
        </div>
        <Link href="/admin/dashboard/new" id="add-product-btn" style={styles.addBtn}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Product
        </Link>
      </div>

      {/* Gold hairline */}
      <div style={styles.rule} />

      {/* Stats row */}
      <div className="admin-stats-grid" style={styles.statsRow}>
        <StatCard label="Total Products" value={products.length} />
        <StatCard label="Active" value={activeCount} accent />
        <StatCard label="Draft / Archived" value={draftCount} />
        <StatCard
          label="Avg. Price"
          value={
            products.length
              ? formatPrice(
                  Math.round(products.reduce((s, p) => s + p.price_cents, 0) / products.length)
                )
              : '—'
          }
        />
      </div>

      {/* Table */}
      <ProductTable products={products} />

      <style>{`
        @media (max-width: 1024px) {
          .admin-page-header {
            flex-direction: column;
            align-items: stretch !important;
            gap: 1.25rem !important;
          }
          .admin-page-header a {
            display: inline-flex !important;
            justify-content: center !important;
            width: 100% !important;
            padding: 0.85rem !important; /* Larger touch target */
          }
          .admin-stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 480px) {
          .admin-stats-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent?: boolean;
}) {
  return (
    <div style={styles.statCard}>
      <span style={styles.statLabel}>{label}</span>
      <span
        style={{
          ...styles.statValue,
          color: accent ? '#B8934A' : '#EDE8E0',
        }}
      >
        {value}
      </span>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  page: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    maxWidth: '1100px',
  },
  pageHeader: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: '1rem',
  },
  pageTitle: {
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: '2rem',
    fontWeight: 300,
    letterSpacing: '0.08em',
    color: '#EDE8E0',
    margin: 0,
    textTransform: 'uppercase',
  },
  pageMeta: {
    fontSize: '0.75rem',
    color: '#5A5048',
    letterSpacing: '0.08em',
    marginTop: '0.25rem',
  },
  rule: {
    height: '1px',
    background: 'linear-gradient(90deg, rgba(184,147,74,0.4) 0%, transparent 100%)',
    marginBottom: '0.5rem',
  },
  addBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.65rem 1.5rem',
    background: '#B8934A',
    border: 'none',
    borderRadius: '2px',
    color: '#0E0A07',
    fontSize: '0.7rem',
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    fontWeight: 500,
    textDecoration: 'none',
    transition: 'background 0.3s',
    flexShrink: 0,
  },
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '1rem',
  },
  statCard: {
    background: 'rgba(26, 20, 16, 0.6)',
    border: '1px solid rgba(184, 147, 74, 0.1)',
    borderRadius: '4px',
    padding: '1rem 1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem',
  },
  statLabel: {
    fontSize: '0.6rem',
    letterSpacing: '0.18em',
    color: '#5A5048',
    textTransform: 'uppercase',
  },
  statValue: {
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: '1.75rem',
    fontWeight: 300,
    lineHeight: 1,
  },
};
