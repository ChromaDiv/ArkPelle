'use client';

import { useTransition, useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { formatPrice } from '@/lib/utils';
import { deleteProduct, restoreProduct, reorderProducts } from '@/app/actions/products';
import type { Product } from '@/lib/supabase/types';
import StatusBadge from './StatusBadge';

interface ProductTableProps {
  products: Product[];
}

export default function ProductTable({ products }: ProductTableProps) {
  const [localProducts, setLocalProducts] = useState<Product[]>(products);
  const [isSavingOrder, setIsSavingOrder] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Keep local products in sync with server component props (e.g. after adding or archiving)
  useEffect(() => {
    setLocalProducts(products);
  }, [products]);

  // Handle soft delete (archive)
  const handleDelete = (id: string) => {
    startTransition(async () => {
      // Optimistic state update
      setLocalProducts(prev =>
        prev.map(p => p.id === id ? { ...p, is_active: false } : p)
      );
      const res = await deleteProduct(id);
      if (res?.error) {
        // Revert on error
        setLocalProducts(products);
        alert(`Failed to archive product: ${res.error}`);
      }
    });
  };

  // Handle restore (reactivate)
  const handleRestore = (id: string) => {
    startTransition(async () => {
      // Optimistic state update
      setLocalProducts(prev =>
        prev.map(p => p.id === id ? { ...p, is_active: true } : p)
      );
      const res = await restoreProduct(id);
      if (res?.error) {
        // Revert on error
        setLocalProducts(products);
        alert(`Failed to restore product: ${res.error}`);
      }
    });
  };

  // Handle click-to-reorder (up/down arrows)
  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= localProducts.length) return;

    const newProducts = [...localProducts];
    const [movedItem] = newProducts.splice(index, 1);
    newProducts.splice(newIndex, 0, movedItem);

    // Optimistic reorder
    const originalProducts = [...localProducts];
    setLocalProducts(newProducts);
    setIsSavingOrder(true);

    const orderedIds = newProducts.map(p => p.id);
    const result = await reorderProducts(orderedIds);
    setIsSavingOrder(false);

    if (result?.error) {
      // Rollback on server failure
      setLocalProducts(originalProducts);
      alert(`Failed to save new product order: ${result.error}`);
    }
  };

  // HTML5 Drag & Drop state refs
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    dragItem.current = index;
    e.dataTransfer.effectAllowed = 'move';
    // Style the drag ghost a bit if needed
    e.currentTarget.classList.add('dragging');
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    dragOverItem.current = index;
  };

  const handleDragEnd = async (e: React.DragEvent) => {
    e.currentTarget.classList.remove('dragging');

    if (
      dragItem.current === null ||
      dragOverItem.current === null ||
      dragItem.current === dragOverItem.current
    ) {
      dragItem.current = null;
      dragOverItem.current = null;
      return;
    }

    const index = dragItem.current;
    const newIndex = dragOverItem.current;

    const newProducts = [...localProducts];
    const [movedItem] = newProducts.splice(index, 1);
    newProducts.splice(newIndex, 0, movedItem);

    // Optimistic drag reorder
    const originalProducts = [...localProducts];
    setLocalProducts(newProducts);
    setIsSavingOrder(true);

    const orderedIds = newProducts.map(p => p.id);
    const result = await reorderProducts(orderedIds);
    setIsSavingOrder(false);

    if (result?.error) {
      // Rollback
      setLocalProducts(originalProducts);
      alert(`Failed to save new product order: ${result.error}`);
    }

    dragItem.current = null;
    dragOverItem.current = null;
  };

  return (
    <div style={styles.root}>
      {/* Saving banner */}
      {isSavingOrder && (
        <div style={styles.savingBar}>
          <span style={styles.spinnerSm} aria-hidden="true" />
          <span>Arrangement order saving…</span>
        </div>
      )}

      {/* Header row */}
      <div className="admin-table-header" style={styles.tableHeader}>
        <div style={styles.col_drag_hdr} />
        <div style={styles.col_thumb} />
        <div style={styles.col_name}>Product</div>
        <div style={styles.col_price}>Price</div>
        <div style={styles.col_status}>Status</div>
        <div style={styles.col_actions} />
      </div>

      {/* Body */}
      <div style={styles.tableBody}>
        {localProducts.length === 0 && (
          <div style={styles.empty}>
            <p style={{ color: '#5A5048', fontSize: '0.875rem' }}>
              No products yet. Add your first one.
            </p>
          </div>
        )}

        {localProducts.map((product, index) => (
          <motion.div
            key={product.id}
            layout
            draggable
            id={`product-row-${product.id}`}
            className="admin-table-row"
            style={{
              ...styles.row,
              opacity: !product.is_active ? 0.5 : 1,
              transition: 'opacity 0.4s ease, border-color 0.2s',
            }}
            {...{
              onDragStart: (e: React.DragEvent) => handleDragStart(e, index),
              onDragOver: (e: React.DragEvent) => handleDragOver(e, index),
              onDragEnd: handleDragEnd
            } as any}
          >
            {/* Reorder drag handle & arrows */}
            <div className="admin-col-drag" style={styles.col_drag}>
              <div style={styles.dragHandle} title="Drag to rearrange">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="9" cy="5" r="1"/>
                  <circle cx="9" cy="12" r="1"/>
                  <circle cx="9" cy="19" r="1"/>
                  <circle cx="15" cy="5" r="1"/>
                  <circle cx="15" cy="12" r="1"/>
                  <circle cx="15" cy="19" r="1"/>
                </svg>
              </div>
              <div style={styles.quickOrder} className="admin-quick-reorder">
                <button
                  type="button"
                  onClick={() => handleMove(index, 'up')}
                  disabled={index === 0 || isSavingOrder}
                  style={{
                    ...styles.quickBtn,
                    opacity: index === 0 ? 0.25 : 1,
                  }}
                  title="Move Up"
                  aria-label={`Move ${product.name} up`}
                >
                  ▲
                </button>
                <button
                  type="button"
                  onClick={() => handleMove(index, 'down')}
                  disabled={index === localProducts.length - 1 || isSavingOrder}
                  style={{
                    ...styles.quickBtn,
                    opacity: index === localProducts.length - 1 ? 0.25 : 1,
                  }}
                  title="Move Down"
                  aria-label={`Move ${product.name} down`}
                >
                  ▼
                </button>
              </div>
            </div>

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

            {/* Name + Slug + Sold Out label */}
            <div className="admin-col-name" style={styles.col_name}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span style={styles.productName}>{product.name}</span>
                {product.is_sold_out && (
                  <span style={styles.soldOutBadge}>Sold Out</span>
                )}
              </div>
              <span style={styles.productSlug}>/shop/{product.slug}</span>
            </div>

            {/* Price */}
            <div className="admin-col-price" style={styles.col_price}>
              {product.discount_percent > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <span style={{ ...styles.price, fontSize: '0.7rem', textDecoration: 'line-through', color: '#5A5048' }}>
                    {formatPrice(product.price_cents, product.currency)}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span style={styles.price}>
                      {formatPrice(Math.round(product.price_cents * (1 - product.discount_percent / 100)), product.currency)}
                    </span>
                    <span style={{
                      fontSize: '0.55rem',
                      letterSpacing: '0.05em',
                      color: '#B8934A',
                      fontWeight: 500,
                    }}>
                      -{product.discount_percent}%
                    </span>
                  </div>
                </div>
              ) : (
                <span style={styles.price}>
                  {formatPrice(product.price_cents, product.currency)}
                </span>
              )}
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
                  title="Archive product"
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
                  title="Restore product"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="1 4 1 10 7 10"/>
                    <path d="M3.51 15a9 9 0 1 0 .49-4.5"/>
                  </svg>
                  Restore
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <style>{`
        .admin-table-row:hover {
          background: rgba(184, 147, 74, 0.02) !important;
          border-color: rgba(184, 147, 74, 0.15) !important;
        }
        .admin-table-row.dragging {
          opacity: 0.3 !important;
          background: rgba(184, 147, 74, 0.05) !important;
          border-color: rgba(184, 147, 74, 0.3) !important;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 1024px) {
          .admin-table-header {
            display: none !important;
          }
          .admin-table-row {
            grid-template-columns: 40px 56px 1fr !important;
            grid-template-rows: auto auto auto auto !important;
            gap: 0.5rem !important;
            padding: 1.25rem 1rem !important;
            border-bottom: 1px solid rgba(184, 147, 74, 0.1) !important;
            align-items: start !important;
          }
          .admin-col-drag {
            grid-column: 1 / 2;
            grid-row: 1 / 3;
            margin-top: 0.25rem;
            display: flex !important;
          }
          .admin-col-thumb {
            grid-column: 2 / 3;
            grid-row: 1 / 3;
          }
          .admin-col-name {
            grid-column: 3 / 4;
            grid-row: 1 / 2;
          }
          .admin-col-price {
            grid-column: 3 / 4;
            grid-row: 2 / 3;
            margin-top: 0.15rem;
          }
          .admin-col-status {
            grid-column: 3 / 4;
            grid-row: 3 / 4;
            margin-top: 0.25rem;
          }
          .admin-col-actions {
            grid-column: 1 / 4;
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
            padding: 0.75rem 0.5rem !important;
            font-size: 0.7rem !important;
          }
          .admin-quick-reorder {
            flex-direction: row !important;
            gap: 0.35rem !important;
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
  savingBar: {
    background: 'rgba(184, 147, 74, 0.08)',
    borderBottom: '1px solid rgba(184, 147, 74, 0.15)',
    padding: '0.65rem 1.25rem',
    color: '#B8934A',
    fontSize: '0.7rem',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  spinnerSm: {
    width: '12px',
    height: '12px',
    border: '2px solid rgba(184, 147, 74, 0.2)',
    borderTopColor: '#B8934A',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
    display: 'inline-block',
  },
  tableHeader: {
    display: 'grid',
    gridTemplateColumns: '40px 56px 1fr 120px 90px 180px',
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
    gridTemplateColumns: '40px 56px 1fr 120px 90px 180px',
    gap: '1rem',
    padding: '0.875rem 1.25rem',
    alignItems: 'center',
    borderBottom: '1px solid rgba(184, 147, 74, 0.07)',
    background: 'rgba(26, 20, 16, 0.2)',
  },
  empty: {
    padding: '3rem 1.5rem',
    textAlign: 'center',
  },
  col_drag_hdr: {
    width: '40px',
  },
  col_drag: {
    width: '40px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.35rem',
    userSelect: 'none',
  },
  dragHandle: {
    cursor: 'grab',
    color: '#3A3028',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.1rem',
    transition: 'color 0.2s',
  },
  quickOrder: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  quickBtn: {
    background: 'transparent',
    border: 'none',
    color: '#5A5048',
    fontSize: '0.5rem',
    cursor: 'pointer',
    padding: '2px 4px',
    lineHeight: 1,
    transition: 'color 0.2s, background 0.2s',
  },
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
  soldOutBadge: {
    fontSize: '0.55rem',
    letterSpacing: '0.08em',
    color: '#E57373',
    border: '1px solid rgba(229, 115, 115, 0.3)',
    borderRadius: '2px',
    padding: '0.1rem 0.35rem',
    textTransform: 'uppercase',
    fontWeight: 500,
    background: 'rgba(229, 115, 115, 0.03)',
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
