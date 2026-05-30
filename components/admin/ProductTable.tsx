'use client';

import { useOptimistic, useTransition } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { deleteProduct, restoreProduct } from '@/app/actions/products';
import type { Product } from '@/lib/supabase/types';
import StatusBadge from './StatusBadge';

interface ProductTableProps {
  products: Product[];
}

type OptimisticAction =
  | { type: 'delete'; id: string }
  | { type: 'restore'; id: string };

function applyOptimistic(products: Product[], action: OptimisticAction): Product[] {
  if (action.type === 'delete') {
    return products.map(p =>
      p.id === action.id ? { ...p, is_active: false } : p
    );
  }
  if (action.type === 'restore') {
    return products.map(p =>
      p.id === action.id ? { ...p, is_active: true } : p
    );
  }
  return products;
}

export default function ProductTable({ products }: ProductTableProps) {
  const [optimisticProducts, addOptimistic] = useOptimistic(products, applyOptimistic);
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: string) => {
    startTransition(async () => {
      addOptimistic({ type: 'delete', id });
      await deleteProduct(id);
    });
  };

  const handleRestore = (id: string) => {
    startTransition(async () => {
      addOptimistic({ type: 'restore', id });
      await restoreProduct(id);
    });
  };

  return (
    <div style={styles.root}>
      {/* Header row */}
      <div className="admin-table-header" style={styles.tableHeader}>
        <div style={styles.col_thumb} />
        <div style={styles.col_name}>Product</div>
        <div style={styles.col_price}>Price</div>
        <div style={styles.col_status}>Status</div>
        <div style={styles.col_actions} />
      </div>

      {/* Body */}
      <div style={styles.tableBody}>
        {optimisticProducts.length === 0 && (
          <div style={styles.empty}>
            <p style={{ color: '#5A5048', fontSize: '0.875rem' }}>
              No products yet. Add your first one.
            </p>
          </div>
        )}

        {optimisticProducts.map((product) => (
          <div
            key={product.id}
            id={`product-row-${product.id}`}
            className="admin-table-row"
            style={{
              ...styles.row,
              opacity: !product.is_active ? 0.5 : 1,
              transition: 'opacity 0.4s ease',
            }}
          >
            {/* Thumbnail */}
            <div className="admin-col-thumb" style={styles.col_thumb}>
              <div style={styles.thumb}>
                {product.images?.[0] ? (
                  <Image
                    src={product.images[0].url}
                    alt={product.images[0].alt}
                    fill
                    sizes="48px"
                    style={{ objectFit: 'cover', borderRadius: '3px' }}
                  />
                ) : (
                  <span style={styles.thumbPlaceholder}>—</span>
                )}
              </div>
            </div>

            {/* Name + slug */}
            <div className="admin-col-name" style={styles.col_name}>
              <span style={styles.productName}>{product.name}</span>
              <span style={styles.productSlug}>/shop/{product.slug}</span>
            </div>

            {/* Price */}
            <div className="admin-col-price" style={styles.col_price}>
              <span style={styles.price}>
                {formatPrice(product.price_cents, product.currency)}
              </span>
            </div>

            {/* Status */}
            <div className="admin-col-status" style={styles.col_status}>
              <StatusBadge isActive={product.is_active} />
            </div>

            {/* Actions */}
            <div className="admin-col-actions" style={styles.col_actions}>
              <Link
                href={`/admin/dashboard/${product.slug}/edit`}
                id={`edit-product-${product.id}`}
                style={styles.actionBtn}
                title="Edit product"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
                Edit
              </Link>

              {product.is_active ? (
                <button
                  type="button"
                  id={`archive-product-${product.id}`}
                  onClick={() => handleDelete(product.id)}
                  disabled={isPending}
                  style={{ ...styles.actionBtn, ...styles.archiveBtn }}
                  title="Archive product (set inactive)"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="21 8 21 21 3 21 3 8"/>
                    <rect x="1" y="3" width="22" height="5"/>
                    <line x1="10" y1="12" x2="14" y2="12"/>
                  </svg>
                  Archive
                </button>
              ) : (
                <button
                  type="button"
                  id={`restore-product-${product.id}`}
                  onClick={() => handleRestore(product.id)}
                  disabled={isPending}
                  style={{ ...styles.actionBtn, ...styles.restoreBtn }}
                  title="Restore product (set active)"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="1 4 1 10 7 10"/>
                    <path d="M3.51 15a9 9 0 1 0 .49-4.5"/>
                  </svg>
                  Restore
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .admin-table-header {
            display: none !important;
          }
          .admin-table-row {
            grid-template-columns: 56px 1fr !important;
            grid-template-rows: auto auto auto auto !important;
            gap: 0.5rem !important;
            padding: 1.25rem 1rem !important;
            border-bottom: 1px solid rgba(184, 147, 74, 0.1) !important;
            align-items: start !important;
          }
          .admin-col-thumb {
            grid-column: 1 / 2;
            grid-row: 1 / 2;
          }
          .admin-col-name {
            grid-column: 2 / 3;
            grid-row: 1 / 2;
          }
          .admin-col-price {
            grid-column: 2 / 3;
            grid-row: 2 / 3;
            margin-top: 0.15rem;
          }
          .admin-col-status {
            grid-column: 2 / 3;
            grid-row: 3 / 4;
            margin-top: 0.25rem;
          }
          .admin-col-actions {
            grid-column: 1 / 3;
            grid-row: 4 / 5;
            display: flex !important;
            justify-content: flex-start !important;
            width: 100% !important;
            margin-top: 0.75rem;
            gap: 0.5rem !important;
          }
          .admin-col-actions a,
          .admin-col-actions button {
            flex: 1;
            justify-content: center !important;
            padding: 0.75rem 0.5rem !important; /* Premium finger-friendly touch target */
            font-size: 0.7rem !important;
          }
        }
      `}</style>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  root: {
    border: '1px solid rgba(184, 147, 74, 0.12)',
    borderRadius: '4px',
    overflow: 'hidden',
    background: 'rgba(26, 20, 16, 0.5)',
  },
  tableHeader: {
    display: 'grid',
    gridTemplateColumns: '56px 1fr 120px 90px 180px',
    gap: '1rem',
    padding: '0.75rem 1.25rem',
    background: 'rgba(14, 10, 7, 0.4)',
    borderBottom: '1px solid rgba(184, 147, 74, 0.08)',
    alignItems: 'center',
  },
  tableBody: {
    display: 'flex',
    flexDirection: 'column',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '56px 1fr 120px 90px 180px',
    gap: '1rem',
    padding: '0.875rem 1.25rem',
    alignItems: 'center',
    borderBottom: '1px solid rgba(184, 147, 74, 0.07)',
    transition: 'background 0.2s',
  },
  empty: {
    padding: '3rem 1.5rem',
    textAlign: 'center',
  },
  // Column labels
  col_thumb: {
    fontSize: '0.6rem',
    letterSpacing: '0.15em',
    color: '#5A5048',
    textTransform: 'uppercase',
  },
  col_name: {
    fontSize: '0.6rem',
    letterSpacing: '0.15em',
    color: '#5A5048',
    textTransform: 'uppercase',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.15rem',
  },
  col_price: {
    fontSize: '0.6rem',
    letterSpacing: '0.15em',
    color: '#5A5048',
    textTransform: 'uppercase',
  },
  col_status: {
    fontSize: '0.6rem',
    letterSpacing: '0.15em',
    color: '#5A5048',
    textTransform: 'uppercase',
  },
  col_actions: {
    fontSize: '0.6rem',
    letterSpacing: '0.15em',
    color: '#5A5048',
    textTransform: 'uppercase',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '0.5rem',
  },
  // Cell content
  thumb: {
    width: '48px',
    height: '48px',
    borderRadius: '3px',
    background: '#1A1410',
    border: '1px solid rgba(184, 147, 74, 0.12)',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  thumbPlaceholder: {
    color: '#3A3028',
    fontSize: '1.2rem',
  },
  productName: {
    fontSize: '0.875rem',
    color: '#EDE8E0',
    fontWeight: 400,
    lineHeight: 1.3,
  },
  productSlug: {
    fontSize: '0.7rem',
    color: '#5A5048',
  },
  price: {
    fontSize: '0.875rem',
    color: '#B8934A',
    fontVariantNumeric: 'tabular-nums',
  },
  actionBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.3rem',
    padding: '0.4rem 0.75rem',
    borderRadius: '2px',
    fontSize: '0.65rem',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    border: '1px solid rgba(184, 147, 74, 0.2)',
    background: 'transparent',
    color: '#8A8078',
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'border-color 0.2s, color 0.2s',
    fontFamily: 'inherit',
  },
  archiveBtn: {
    borderColor: 'rgba(229, 115, 115, 0.2)',
    color: '#E57373',
  },
  restoreBtn: {
    borderColor: 'rgba(76, 175, 80, 0.2)',
    color: '#81C784',
  },
};
