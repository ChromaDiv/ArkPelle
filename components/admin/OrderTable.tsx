'use client';

import { useState, useTransition } from 'react';
import { updateOrderStatus } from '@/app/actions/orders';
import type { AdminOrder, OrderStatus } from '@/lib/orders/types';
import { ORDER_STATUS_OPTIONS } from '@/lib/orders/types';
import { formatPrice } from '@/lib/utils';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-PK', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function getStatusConfig(status: OrderStatus) {
  return (
    ORDER_STATUS_OPTIONS.find(o => o.value === status) ??
    ORDER_STATUS_OPTIONS[0]
  );
}

// ─── Status Dropdown ──────────────────────────────────────────────────────────

function StatusDropdown({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: OrderStatus;
}) {
  const [status, setStatus] = useState<OrderStatus>(currentStatus);
  const [isPending, startTransition] = useTransition();

  const config = getStatusConfig(status);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value as OrderStatus;
    setStatus(next);
    startTransition(async () => {
      await updateOrderStatus(orderId, next);
    });
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <span
        style={{
          position: 'absolute',
          left: '0.6rem',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: config.color,
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />
      <select
        value={status}
        onChange={handleChange}
        disabled={isPending}
        aria-label="Order status"
        style={{
          appearance: 'none',
          background: 'rgba(26, 20, 16, 0.8)',
          border: `1px solid ${config.color}40`,
          borderRadius: '3px',
          color: config.color,
          fontSize: '0.68rem',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          padding: '0.35rem 1.6rem 0.35rem 1.4rem',
          cursor: isPending ? 'wait' : 'pointer',
          opacity: isPending ? 0.6 : 1,
          transition: 'border-color 0.2s, opacity 0.2s',
          outline: 'none',
          minWidth: '130px',
        }}
      >
        {ORDER_STATUS_OPTIONS.map(opt => (
          <option key={opt.value} value={opt.value} style={{ background: '#0E0A07', color: opt.color }}>
            {opt.label}
          </option>
        ))}
      </select>
      {/* Chevron */}
      <svg
        width="10"
        height="10"
        viewBox="0 0 24 24"
        fill="none"
        stroke={config.color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          position: 'absolute',
          right: '0.5rem',
          top: '50%',
          transform: 'translateY(-50%)',
          pointerEvents: 'none',
          opacity: 0.7,
        }}
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    </div>
  );
}

// ─── Order Row (expandable) ───────────────────────────────────────────────────

function OrderRow({ order }: { order: AdminOrder }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <tr
        style={{ borderBottom: '1px solid rgba(184,147,74,0.06)', cursor: 'pointer' }}
        onClick={() => setExpanded(e => !e)}
        aria-expanded={expanded}
      >
        {/* Expand toggle */}
        <td style={tdStyle}>
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#8A8078"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              transition: 'transform 0.2s',
              transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
            }}
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </td>
        {/* Order ID */}
        <td style={{ ...tdStyle, fontFamily: 'monospace', fontSize: '0.7rem', color: '#B8934A' }}>
          #{order.id.slice(0, 8).toUpperCase()}
        </td>
        {/* Customer name */}
        <td style={{ ...tdStyle, color: '#EDE8E0' }}>
          {order.shipping_address.full_name}
        </td>
        {/* City */}
        <td style={{ ...tdStyle, color: '#8A8078' }}>
          {order.shipping_address.city}
        </td>
        {/* Items count */}
        <td style={{ ...tdStyle, color: '#8A8078', textAlign: 'center' }}>
          {order.items.length}
        </td>
        {/* Total */}
        <td style={{ ...tdStyle, color: '#EDE8E0', fontVariantNumeric: 'tabular-nums' }}>
          {formatPrice(order.total_cents, order.currency)}
        </td>
        {/* Date */}
        <td style={{ ...tdStyle, color: '#5A5048', fontSize: '0.7rem' }}>
          {formatDate(order.created_at)}
        </td>
        {/* Status */}
        <td style={{ ...tdStyle }} onClick={e => e.stopPropagation()}>
          <StatusDropdown orderId={order.id} currentStatus={order.status} />
        </td>
      </tr>

      {/* Expanded details */}
      {expanded && (
        <tr>
          <td colSpan={8} style={{ padding: 0, background: 'rgba(14,10,7,0.6)' }}>
            <div style={expandedStyle}>
              {/* Shipping info */}
              <div style={expandSection}>
                <p style={expandLabel}>Shipping Address</p>
                <p style={expandText}>{order.shipping_address.full_name}</p>
                <p style={expandText}>{order.shipping_address.line1}</p>
                {order.shipping_address.line2 && (
                  <p style={expandText}>{order.shipping_address.line2}</p>
                )}
                <p style={expandText}>
                  {order.shipping_address.city}, {order.shipping_address.state}
                  {order.shipping_address.postal_code ? ` ${order.shipping_address.postal_code}` : ''}
                </p>
                <p style={expandText}>{order.shipping_address.country}</p>
              </div>

              {/* Items */}
              <div style={{ ...expandSection, flex: 2 }}>
                <p style={expandLabel}>Order Items</p>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={subThStyle}>Product</th>
                      <th style={{ ...subThStyle, textAlign: 'center' }}>Qty</th>
                      <th style={{ ...subThStyle, textAlign: 'right' }}>Unit Price</th>
                      <th style={{ ...subThStyle, textAlign: 'right' }}>Subtotal</th>
                      <th style={subThStyle}>Variant</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map(item => (
                      <tr key={item.id} style={{ borderTop: '1px solid rgba(184,147,74,0.05)' }}>
                        <td style={{ ...subTdStyle, color: '#EDE8E0' }}>
                          {item.product_name}
                        </td>
                        <td style={{ ...subTdStyle, textAlign: 'center', color: '#8A8078' }}>
                          {item.quantity}
                        </td>
                        <td style={{ ...subTdStyle, textAlign: 'right', color: '#8A8078' }}>
                          {formatPrice(item.unit_price_cents, order.currency)}
                        </td>
                        <td style={{ ...subTdStyle, textAlign: 'right', color: '#EDE8E0' }}>
                          {formatPrice(item.unit_price_cents * item.quantity, order.currency)}
                        </td>
                        <td style={{ ...subTdStyle, color: '#5A5048', fontSize: '0.65rem' }}>
                          {item.variant
                            ? Object.entries(item.variant)
                                .map(([k, v]) => `${k}: ${v}`)
                                .join(', ')
                            : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// ─── Mobile card view ─────────────────────────────────────────────────────────

function OrderCard({ order }: { order: AdminOrder }) {
  const [expanded, setExpanded] = useState(false);
  const config = getStatusConfig(order.status);

  return (
    <div style={cardStyle}>
      {/* Card header */}
      <div
        style={cardHeader}
        onClick={() => setExpanded(e => !e)}
        role="button"
        tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && setExpanded(x => !x)}
        aria-expanded={expanded}
      >
        <div>
          <span style={cardOrderId}>#{order.id.slice(0, 8).toUpperCase()}</span>
          <span style={cardName}>{order.shipping_address.full_name}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ ...cardBadge, background: `${config.color}18`, color: config.color }}>
            {config.label}
          </span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#5A5048"
            strokeWidth="2"
            style={{ transition: 'transform 0.2s', transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0 }}
          >
            <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Card meta */}
      <div style={cardMeta}>
        <span style={cardMetaItem}>
          {order.items.length} item{order.items.length !== 1 ? 's' : ''}
        </span>
        <span style={{ ...cardMetaItem, color: '#EDE8E0' }}>
          {formatPrice(order.total_cents, order.currency)}
        </span>
        <span style={cardMetaItem}>{formatDate(order.created_at)}</span>
      </div>

      {/* Status selector */}
      <div style={{ padding: '0 1rem 0.75rem' }} onClick={e => e.stopPropagation()}>
        <StatusDropdown orderId={order.id} currentStatus={order.status} />
      </div>

      {/* Expanded details */}
      {expanded && (
        <div style={cardExpanded}>
          <p style={expandLabel}>Shipping Address</p>
          <p style={{ ...expandText, marginBottom: '0.25rem' }}>
            {order.shipping_address.line1}
            {order.shipping_address.line2 ? `, ${order.shipping_address.line2}` : ''}
          </p>
          <p style={{ ...expandText, marginBottom: '0.75rem' }}>
            {order.shipping_address.city}, {order.shipping_address.state} · {order.shipping_address.country}
          </p>

          <p style={{ ...expandLabel, marginTop: '0.5rem' }}>Items</p>
          {order.items.map(item => (
            <div key={item.id} style={cardItem}>
              <span style={{ color: '#EDE8E0', fontSize: '0.78rem' }}>{item.product_name}</span>
              <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.7rem', color: '#8A8078', marginTop: '0.15rem' }}>
                <span>Qty: {item.quantity}</span>
                <span>{formatPrice(item.unit_price_cents * item.quantity, order.currency)}</span>
                {item.variant && (
                  <span style={{ color: '#5A5048' }}>
                    {Object.entries(item.variant).map(([k, v]) => `${k}: ${v}`).join(', ')}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main OrderTable ──────────────────────────────────────────────────────────

interface OrderTableProps {
  orders: AdminOrder[];
}

export default function OrderTable({ orders }: OrderTableProps) {
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'all'>('all');
  const [search, setSearch] = useState('');

  const filtered = orders.filter(o => {
    const matchStatus = filterStatus === 'all' || o.status === filterStatus;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      o.id.toLowerCase().includes(q) ||
      o.shipping_address.full_name.toLowerCase().includes(q) ||
      o.shipping_address.city.toLowerCase().includes(q) ||
      o.items.some(i => i.product_name.toLowerCase().includes(q));
    return matchStatus && matchSearch;
  });

  // Stats
  const totalRevenue = orders.reduce((s, o) => s + o.total_cents, 0);
  const pendingCount = orders.filter(o => o.status === 'pending' || o.status === 'confirmed').length;
  const deliveredCount = orders.filter(o => o.status === 'delivered').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Stats row */}
      <div className="orders-stats-grid" style={statsGrid}>
        <StatPill label="Total Orders" value={orders.length} />
        <StatPill label="Total Revenue" value={formatPrice(totalRevenue, 'PKR')} accent />
        <StatPill label="Awaiting Dispatch" value={pendingCount} />
        <StatPill label="Delivered" value={deliveredCount} />
      </div>

      {/* Filters */}
      <div className="orders-filters" style={filtersRow}>
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: '180px' }}>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#5A5048"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }}
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search orders, customers, products…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={searchInput}
          />
        </div>

        {/* Status filter */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          <FilterChip
            label="All"
            active={filterStatus === 'all'}
            onClick={() => setFilterStatus('all')}
          />
          {ORDER_STATUS_OPTIONS.map(opt => (
            <FilterChip
              key={opt.value}
              label={opt.label}
              color={opt.color}
              active={filterStatus === opt.value}
              onClick={() => setFilterStatus(opt.value)}
            />
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div style={emptyState}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#3A3028" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
          <p style={{ color: '#5A5048', fontSize: '0.85rem', letterSpacing: '0.08em', marginTop: '1rem' }}>
            No orders found
          </p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="orders-table-wrap" style={tableWrap}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(184,147,74,0.15)' }}>
                  <th style={thStyle} />
                  <th style={thStyle}>Order</th>
                  <th style={thStyle}>Customer</th>
                  <th style={thStyle}>City</th>
                  <th style={{ ...thStyle, textAlign: 'center' }}>Items</th>
                  <th style={thStyle}>Total</th>
                  <th style={thStyle}>Date</th>
                  <th style={thStyle}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(order => (
                  <OrderRow key={order.id} order={order} />
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="orders-cards-wrap" style={{ display: 'none', flexDirection: 'column', gap: '0.75rem' }}>
            {filtered.map(order => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        </>
      )}

      <style>{`
        @media (max-width: 768px) {
          .orders-table-wrap { display: none !important; }
          .orders-cards-wrap { display: flex !important; }
          .orders-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .orders-filters { flex-direction: column !important; }
        }
        @media (max-width: 480px) {
          .orders-stats-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatPill({ label, value, accent }: { label: string; value: string | number; accent?: boolean }) {
  return (
    <div style={statPillStyle}>
      <span style={{ fontSize: '0.6rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#5A5048' }}>
        {label}
      </span>
      <span style={{
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        fontSize: '1.6rem',
        fontWeight: 300,
        color: accent ? '#B8934A' : '#EDE8E0',
        lineHeight: 1,
      }}>
        {value}
      </span>
    </div>
  );
}

function FilterChip({
  label,
  active,
  color,
  onClick,
}: {
  label: string;
  active: boolean;
  color?: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.3rem',
        padding: '0.3rem 0.75rem',
        borderRadius: '2px',
        border: `1px solid ${active ? (color ?? '#B8934A') : 'rgba(184,147,74,0.12)'}`,
        background: active ? `${color ?? '#B8934A'}18` : 'transparent',
        color: active ? (color ?? '#B8934A') : '#5A5048',
        fontSize: '0.65rem',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        cursor: 'pointer',
        transition: 'all 0.2s',
        whiteSpace: 'nowrap',
      }}
    >
      {color && (
        <span
          style={{
            width: '5px',
            height: '5px',
            borderRadius: '50%',
            background: color,
            opacity: active ? 1 : 0.4,
          }}
        />
      )}
      {label}
    </button>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const tdStyle: React.CSSProperties = {
  padding: '0.85rem 0.75rem',
  fontSize: '0.78rem',
  letterSpacing: '0.04em',
  verticalAlign: 'middle',
};

const thStyle: React.CSSProperties = {
  padding: '0.6rem 0.75rem',
  fontSize: '0.6rem',
  letterSpacing: '0.15em',
  textTransform: 'uppercase',
  color: '#5A5048',
  fontWeight: 400,
  textAlign: 'left',
  whiteSpace: 'nowrap',
};

const subThStyle: React.CSSProperties = {
  padding: '0.4rem 0.5rem',
  fontSize: '0.58rem',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: '#3A3028',
  fontWeight: 400,
  textAlign: 'left',
};

const subTdStyle: React.CSSProperties = {
  padding: '0.5rem 0.5rem',
  fontSize: '0.75rem',
  verticalAlign: 'middle',
};

const expandedStyle: React.CSSProperties = {
  display: 'flex',
  gap: '2rem',
  padding: '1.25rem 1.5rem',
  flexWrap: 'wrap',
};

const expandSection: React.CSSProperties = {
  flex: 1,
  minWidth: '180px',
};

const expandLabel: React.CSSProperties = {
  fontSize: '0.58rem',
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  color: '#5A5048',
  marginBottom: '0.5rem',
};

const expandText: React.CSSProperties = {
  fontSize: '0.78rem',
  color: '#8A8078',
  lineHeight: 1.6,
  margin: 0,
};

const statsGrid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: '1rem',
};

const statPillStyle: React.CSSProperties = {
  background: 'rgba(26, 20, 16, 0.6)',
  border: '1px solid rgba(184, 147, 74, 0.1)',
  borderRadius: '4px',
  padding: '1rem 1.25rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.35rem',
};

const filtersRow: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  flexWrap: 'wrap',
};

const searchInput: React.CSSProperties = {
  width: '100%',
  background: 'rgba(26,20,16,0.6)',
  border: '1px solid rgba(184,147,74,0.12)',
  borderRadius: '3px',
  color: '#EDE8E0',
  fontSize: '0.78rem',
  padding: '0.55rem 0.75rem 0.55rem 2.25rem',
  outline: 'none',
  letterSpacing: '0.04em',
  boxSizing: 'border-box',
};

const tableWrap: React.CSSProperties = {
  background: 'rgba(26, 20, 16, 0.4)',
  border: '1px solid rgba(184, 147, 74, 0.08)',
  borderRadius: '4px',
  overflow: 'hidden',
  overflowX: 'auto',
};

const emptyState: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '4rem 2rem',
  background: 'rgba(26,20,16,0.3)',
  border: '1px solid rgba(184,147,74,0.06)',
  borderRadius: '4px',
};

// Card styles (mobile)
const cardStyle: React.CSSProperties = {
  background: 'rgba(26, 20, 16, 0.6)',
  border: '1px solid rgba(184, 147, 74, 0.1)',
  borderRadius: '4px',
  overflow: 'hidden',
};

const cardHeader: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  padding: '0.85rem 1rem 0.4rem',
  cursor: 'pointer',
  userSelect: 'none',
};

const cardMeta: React.CSSProperties = {
  display: 'flex',
  gap: '1rem',
  padding: '0 1rem 0.75rem',
};

const cardMetaItem: React.CSSProperties = {
  fontSize: '0.72rem',
  letterSpacing: '0.06em',
  color: '#5A5048',
};

const cardOrderId: React.CSSProperties = {
  display: 'block',
  fontFamily: 'monospace',
  fontSize: '0.68rem',
  color: '#B8934A',
  marginBottom: '0.2rem',
};

const cardName: React.CSSProperties = {
  display: 'block',
  fontSize: '0.85rem',
  color: '#EDE8E0',
  letterSpacing: '0.04em',
};

const cardBadge: React.CSSProperties = {
  display: 'inline-block',
  padding: '0.2rem 0.5rem',
  borderRadius: '2px',
  fontSize: '0.6rem',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  whiteSpace: 'nowrap',
};

const cardExpanded: React.CSSProperties = {
  padding: '0.75rem 1rem 1rem',
  borderTop: '1px solid rgba(184,147,74,0.08)',
  background: 'rgba(14,10,7,0.4)',
};

const cardItem: React.CSSProperties = {
  padding: '0.4rem 0',
  borderBottom: '1px solid rgba(184,147,74,0.05)',
};
