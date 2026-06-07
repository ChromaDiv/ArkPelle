'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getRecentOrderNotifications } from '@/app/actions/notifications';
import type { OrderNotification } from '@/app/actions/notifications';
import { formatPrice } from '@/lib/utils';

const STORAGE_KEY = 'ark_admin_last_seen_orders';
const POLL_INTERVAL_MS = 60_000; // re-fetch every 60 s

// ─── Helpers ──────────────────────────────────────────────────────────────────

function timeAgo(dateString: string): string {
  const diff = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1)  return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function statusColor(status: string): string {
  const map: Record<string, string> = {
    pending:   '#8A8078',
    confirmed: '#B8934A',
    packed:    '#7B9EA6',
    shipped:   '#5B8C6B',
    delivered: '#4CAF50',
    reviewed:  '#9C7BB5',
    cancelled: '#C0392B',
  };
  return map[status] ?? '#8A8078';
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function NotificationBell({ align = 'left' }: { align?: 'left' | 'right' }) {
  const router = useRouter();
  const [notifications, setNotifications] = useState<OrderNotification[]>([]);
  const [unseenCount, setUnseenCount]     = useState(0);
  const [open, setOpen]                   = useState(false);
  const [loading, setLoading]             = useState(true);
  const dropdownRef                       = useRef<HTMLDivElement>(null);

  // ── Fetch & compute unseen ──────────────────────────────────────────────────

  const refresh = useCallback(async () => {
    try {
      const data = await getRecentOrderNotifications();
      setNotifications(data);

      const lastSeen = localStorage.getItem(STORAGE_KEY);
      const lastSeenMs = lastSeen ? new Date(lastSeen).getTime() : 0;
      const newCount = data.filter(
        n => new Date(n.created_at).getTime() > lastSeenMs
      ).length;
      setUnseenCount(newCount);
    } catch {
      // Supabase not configured or auth error — silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [refresh]);

  // ── Close on outside click ──────────────────────────────────────────────────

  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [open]);

  // ── Mark all as seen when dropdown opens ───────────────────────────────────

  const handleToggle = () => {
    if (!open) {
      // Mark as seen — store current time
      localStorage.setItem(STORAGE_KEY, new Date().toISOString());
      setUnseenCount(0);
    }
    setOpen(o => !o);
  };

  // ── Navigate to order ────────────────────────────────────────────────────────

  const handleNotificationClick = (id: string) => {
    setOpen(false);
    // Navigate to orders page — the order ID is stored in the URL hash
    // so the OrderTable can optionally highlight it in the future
    router.push(`/admin/dashboard/orders#${id}`);
  };

  // ── Render ───────────────────────────────────────────────────────────────────

  const hasNew = unseenCount > 0;

  return (
    <div ref={dropdownRef} style={wrap}>
      {/* Bell button */}
      <button
        onClick={handleToggle}
        aria-label={`Notifications${hasNew ? ` (${unseenCount} new)` : ''}`}
        aria-expanded={open}
        style={bellBtn}
        className="notif-bell-btn"
        id="admin-notification-bell"
      >
        {/* Bell icon */}
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke={hasNew ? '#B8934A' : '#8A8078'}
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ transition: 'stroke 0.3s' }}
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          {hasNew && (
            <circle cx="18" cy="5" r="3" fill="#B8934A" stroke="#0B0806" strokeWidth="1.5" />
          )}
        </svg>

        {/* Badge count */}
        {hasNew && (
          <span style={badge} aria-hidden="true">
            {unseenCount > 9 ? '9+' : unseenCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          style={{
            ...dropdown,
            ...(align === 'right'
              ? { left: 0, right: 'auto', transformOrigin: 'top left' }
              : { right: 0, left: 'auto', transformOrigin: 'top right' }),
          }}
          role="dialog"
          aria-label="Order notifications"
        >
          {/* Header */}
          <div style={dropdownHeader}>
            <span style={dropdownTitle}>Notifications</span>
            {unseenCount === 0 && notifications.length > 0 && (
              <span style={allReadLabel}>All read</span>
            )}
          </div>

          <div style={dropdownDivider} />

          {/* List */}
          <div style={list}>
            {loading ? (
              <div style={emptyState}>
                <span style={emptyText}>Loading…</span>
              </div>
            ) : notifications.length === 0 ? (
              <div style={emptyState}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3A3028" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
                <span style={emptyText}>No orders yet</span>
              </div>
            ) : (
              notifications.map((n, idx) => {
                const isNew =
                  (() => {
                    const lastSeen = typeof window !== 'undefined'
                      ? localStorage.getItem(STORAGE_KEY)
                      : null;
                    // After toggle we already reset, so base "new" on original load time
                    // We show a visual indicator for orders in the top few if they arrived recently
                    const seenMs = lastSeen ? new Date(lastSeen).getTime() : 0;
                    // since we cleared on open, mark top items as "recent" (last 24h)
                    return Date.now() - new Date(n.created_at).getTime() < 86_400_000 && idx < 5;
                  })();

                return (
                  <button
                    key={n.id}
                    onClick={() => handleNotificationClick(n.id)}
                    style={{
                      ...notifItem,
                      background: isNew
                        ? 'rgba(184,147,74,0.05)'
                        : 'transparent',
                    }}
                    className="notif-item"
                    id={`notif-${n.id}`}
                  >
                    {/* New dot */}
                    <span
                      style={{
                        ...newDot,
                        opacity: isNew ? 1 : 0,
                      }}
                    />

                    <div style={{ flex: 1, minWidth: 0 }}>
                      {/* Row 1: customer + time */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '0.5rem' }}>
                        <span style={customerName}>{n.customer_name}</span>
                        <span style={timeLabel}>{timeAgo(n.created_at)}</span>
                      </div>

                      {/* Row 2: order id + total */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.2rem' }}>
                        <span style={orderId}>#{n.id.slice(0, 8).toUpperCase()}</span>
                        <span style={totalLabel}>{formatPrice(n.total_cents, n.currency)}</span>
                      </div>

                      {/* Row 3: status pill */}
                      <div style={{ marginTop: '0.3rem' }}>
                        <span
                          style={{
                            ...statusPill,
                            color: statusColor(n.status),
                            background: `${statusColor(n.status)}18`,
                          }}
                        >
                          {n.status}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {notifications.length > 0 && (
            <>
              <div style={dropdownDivider} />
              <button
                style={viewAllBtn}
                onClick={() => { setOpen(false); router.push('/admin/dashboard/orders'); }}
              >
                View all orders →
              </button>
            </>
          )}
        </div>
      )}

      <style>{`
        .notif-bell-btn {
          transition: background 0.2s;
        }
        .notif-bell-btn:hover {
          background: rgba(184,147,74,0.08) !important;
        }
        .notif-item:hover {
          background: rgba(184,147,74,0.06) !important;
        }
      `}</style>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const wrap: React.CSSProperties = {
  position: 'relative',
  display: 'inline-flex',
};

const bellBtn: React.CSSProperties = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '36px',
  height: '36px',
  borderRadius: '4px',
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  padding: 0,
};

const badge: React.CSSProperties = {
  position: 'absolute',
  top: '2px',
  right: '2px',
  minWidth: '16px',
  height: '16px',
  borderRadius: '8px',
  background: '#B8934A',
  color: '#0E0A07',
  fontSize: '0.55rem',
  fontWeight: 700,
  letterSpacing: '0.02em',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0 3px',
  border: '1.5px solid #0B0806',
  lineHeight: 1,
  pointerEvents: 'none',
};

const dropdown: React.CSSProperties = {
  position: 'absolute',
  top: 'calc(100% + 8px)',
  width: '320px',
  background: '#0F0B08',
  border: '1px solid rgba(184,147,74,0.18)',
  borderRadius: '6px',
  boxShadow: '0 16px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(184,147,74,0.06)',
  zIndex: 2000,
  overflow: 'hidden',
  animation: 'notif-drop-in 0.2s cubic-bezier(0.16,1,0.3,1)',
};

const dropdownHeader: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0.85rem 1rem 0.75rem',
};

const dropdownTitle: React.CSSProperties = {
  fontFamily: "'Cormorant Garamond', Georgia, serif",
  fontSize: '0.9rem',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: '#EDE8E0',
  fontWeight: 300,
};

const allReadLabel: React.CSSProperties = {
  fontSize: '0.6rem',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: '#5A5048',
};

const dropdownDivider: React.CSSProperties = {
  height: '1px',
  background: 'linear-gradient(90deg, transparent, rgba(184,147,74,0.15), transparent)',
};

const list: React.CSSProperties = {
  maxHeight: '360px',
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
};

const notifItem: React.CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '0.65rem',
  padding: '0.8rem 1rem',
  border: 'none',
  borderBottom: '1px solid rgba(184,147,74,0.04)',
  cursor: 'pointer',
  textAlign: 'left',
  width: '100%',
  transition: 'background 0.15s',
};

const newDot: React.CSSProperties = {
  width: '6px',
  height: '6px',
  borderRadius: '50%',
  background: '#B8934A',
  flexShrink: 0,
  marginTop: '0.35rem',
  transition: 'opacity 0.2s',
};

const customerName: React.CSSProperties = {
  fontSize: '0.8rem',
  color: '#EDE8E0',
  letterSpacing: '0.04em',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  flex: 1,
};

const timeLabel: React.CSSProperties = {
  fontSize: '0.62rem',
  color: '#5A5048',
  letterSpacing: '0.06em',
  whiteSpace: 'nowrap',
  flexShrink: 0,
};

const orderId: React.CSSProperties = {
  fontFamily: 'monospace',
  fontSize: '0.65rem',
  color: '#B8934A',
  letterSpacing: '0.06em',
};

const totalLabel: React.CSSProperties = {
  fontSize: '0.75rem',
  color: '#EDE8E0',
  letterSpacing: '0.04em',
  fontVariantNumeric: 'tabular-nums',
};

const statusPill: React.CSSProperties = {
  display: 'inline-block',
  padding: '0.15rem 0.4rem',
  borderRadius: '2px',
  fontSize: '0.58rem',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
};

const emptyState: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '2rem 1rem',
};

const emptyText: React.CSSProperties = {
  fontSize: '0.75rem',
  color: '#5A5048',
  letterSpacing: '0.08em',
};

const viewAllBtn: React.CSSProperties = {
  display: 'block',
  width: '100%',
  padding: '0.75rem 1rem',
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  fontSize: '0.68rem',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: '#B8934A',
  textAlign: 'center',
  transition: 'background 0.2s',
};
