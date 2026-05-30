import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProductBySlug } from '@/app/actions/products';
import ProductForm from '@/components/admin/ProductForm';
import type { Metadata } from 'next';

interface EditPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: EditPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  return {
    title: product ? `Edit "${product.name}" — Admin` : 'Edit Product — Admin',
  };
}

export const dynamic = 'force-dynamic';

export default async function EditProductPage({ params }: EditPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div style={styles.page}>
      {/* Breadcrumb */}
      <nav style={styles.breadcrumb} aria-label="Breadcrumb">
        <Link href="/admin/dashboard" style={styles.breadcrumbLink}>Products</Link>
        <span style={styles.breadcrumbSep}>›</span>
        <span style={styles.breadcrumbCurrent}>Edit</span>
      </nav>

      {/* Title */}
      <div style={styles.header}>
        <h1 style={styles.title}>Edit Product</h1>
        <p style={styles.subtitle}>{product.name}</p>
      </div>

      {/* Gold hairline */}
      <div style={styles.rule} />

      {/* Form pre-filled with product data */}
      <ProductForm mode="edit" product={product} />
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
