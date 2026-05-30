import Link from 'next/link';
import ProductForm from '@/components/admin/ProductForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'New Product — Admin',
};

export default function NewProductPage() {
  return (
    <div style={styles.page}>
      {/* Breadcrumb */}
      <nav style={styles.breadcrumb} aria-label="Breadcrumb">
        <Link href="/admin/dashboard" style={styles.breadcrumbLink}>Products</Link>
        <span style={styles.breadcrumbSep}>›</span>
        <span style={styles.breadcrumbCurrent}>New Product</span>
      </nav>

      {/* Title */}
      <div style={styles.header}>
        <h1 style={styles.title}>Create Product</h1>
        <p style={styles.subtitle}>
          Fill in the details below. The product will be published immediately if status is set to Active.
        </p>
      </div>

      {/* Gold hairline */}
      <div style={styles.rule} />

      {/* Form */}
      <ProductForm mode="create" />
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    maxWidth: '1100px',
  },
  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.7rem',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
  },
  breadcrumbLink: {
    color: '#8A8078',
    textDecoration: 'none',
  },
  breadcrumbSep: {
    color: '#3A3028',
  },
  breadcrumbCurrent: {
    color: '#B8934A',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  title: {
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: '2rem',
    fontWeight: 300,
    letterSpacing: '0.08em',
    color: '#EDE8E0',
    margin: 0,
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: '0.8rem',
    color: '#5A5048',
  },
  rule: {
    height: '1px',
    background: 'linear-gradient(90deg, rgba(184,147,74,0.4) 0%, transparent 100%)',
  },
};
