import { getAdminOrders } from '@/app/actions/orders';
import OrderTable from '@/components/admin/OrderTable';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Orders — Admin',
};

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
  const orders = await getAdminOrders();

  return (
    <div style={styles.page}>
      {/* Page header */}
      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.pageTitle}>Orders</h1>
          <p style={styles.pageMeta}>
            {orders.length} total order{orders.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Gold hairline */}
      <div style={styles.rule} />

      {/* Table */}
      <OrderTable orders={orders} />
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    maxWidth: '1200px',
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
};
