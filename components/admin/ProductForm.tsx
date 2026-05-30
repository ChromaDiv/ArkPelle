'use client';

import { useActionState, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createProduct, updateProduct } from '@/app/actions/products';
import { generateSlug } from '@/lib/slug';
import type { Product } from '@/lib/supabase/types';
import ImageUploadZone, { type UploadedImage } from './ImageUploadZone';
import StatusBadge from './StatusBadge';

// ─── Types ────────────────────────────────────────────────────────────────────

type Mode = 'create' | 'edit';

interface ProductFormProps {
  mode: Mode;
  product?: Product;
}

type ActionState = { error: string } | null;

// ─── Top-level action wrappers ────────────────────────────────────────────────
// useActionState requires a stable reference — these top-level functions work.

async function createAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const result = await createProduct(formData);
  return result?.error ? { error: result.error } : null;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ProductForm({ mode, product }: ProductFormProps) {
  const router = useRouter();

  // Slug auto-generation
  const [name, setName] = useState(product?.name ?? '');
  const [slug, setSlug] = useState(product?.slug ?? '');
  const [slugManual, setSlugManual] = useState(false);
  const [isActive, setIsActive] = useState(product?.is_active ?? true);
  const [images, setImages] = useState<UploadedImage[]>(
    (product?.images ?? []).map(img => ({ url: img.url, alt: img.alt }))
  );

  useEffect(() => {
    if (!slugManual && name) {
      setSlug(generateSlug(name));
    }
  }, [name, slugManual]);

  // For edit mode: build a stable action that captures product.id
  const productId = product?.id ?? '';
  async function editAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
    const result = await updateProduct(productId, formData);
    return result?.error ? { error: result.error } : null;
  }

  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    mode === 'create' ? createAction : editAction,
    null
  );

  const price = product ? (product.price_cents / 100).toFixed(2) : '';

  return (
    <form action={formAction} style={styles.form}>
      {/* Error banner */}
      {state?.error && (
        <div style={styles.errorBanner} role="alert">
          <strong>Error:</strong> {state.error}
        </div>
      )}

      {/* ── Two-column grid ── */}
      <div style={styles.grid}>

        {/* LEFT: Core fields */}
        <div style={styles.col}>
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Product Info</h2>

            {/* Name */}
            <FormField label="Product Name" htmlFor="field-name" required>
              <input
                id="field-name"
                name="name"
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. The Rio Symmetrical"
                style={styles.input}
              />
            </FormField>

            {/* Slug */}
            <FormField label="URL Slug" htmlFor="field-slug" hint="Auto-generated from name. Edit to override.">
              <div style={styles.slugRow}>
                <span style={styles.slugPrefix}>/shop/</span>
                <input
                  id="field-slug"
                  name="slug"
                  type="text"
                  required
                  value={slug}
                  onChange={e => { setSlug(e.target.value); setSlugManual(true); }}
                  style={{ ...styles.input, flex: 1 }}
                />
              </div>
            </FormField>

            {/* Description */}
            <FormField label="Description" htmlFor="field-desc" required>
              <textarea
                id="field-desc"
                name="description"
                required
                rows={5}
                defaultValue={product?.description}
                placeholder="Full product description…"
                style={{ ...styles.input, resize: 'vertical', lineHeight: 1.6 }}
              />
            </FormField>

            {/* Material */}
            <FormField label="Material" htmlFor="field-material" required>
              <input
                id="field-material"
                name="material"
                type="text"
                required
                defaultValue={product?.material}
                placeholder="e.g. Full-grain vegetable-tanned leather…"
                style={styles.input}
              />
            </FormField>
          </section>

          {/* ── Pricing & Inventory ── */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Pricing & Inventory</h2>

            <div style={styles.inlineRow}>
              {/* Price */}
              <FormField label="Price (USD)" htmlFor="field-price" required>
                <div style={styles.priceRow}>
                  <span style={styles.priceCurrency}>$</span>
                  <input
                    id="field-price"
                    name="price"
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    defaultValue={price}
                    placeholder="295.00"
                    style={{ ...styles.input, flex: 1 }}
                  />
                </div>
              </FormField>

              {/* Card capacity */}
              <FormField label="Card Capacity" htmlFor="field-capacity" hint="0 = non-wallet">
                <input
                  id="field-capacity"
                  name="card_capacity"
                  type="number"
                  min="0"
                  max="20"
                  defaultValue={product?.card_capacity ?? 6}
                  style={styles.input}
                />
              </FormField>
            </div>

            {/* Status toggle */}
            <FormField label="Status" htmlFor="field-status">
              <div style={styles.statusRow}>
                <button
                  type="button"
                  id="field-status"
                  onClick={() => setIsActive(v => !v)}
                  style={{
                    ...styles.toggleBtn,
                    background: isActive
                      ? 'rgba(76, 175, 80, 0.1)'
                      : 'rgba(138, 128, 120, 0.1)',
                    borderColor: isActive
                      ? 'rgba(76, 175, 80, 0.3)'
                      : 'rgba(138, 128, 120, 0.2)',
                  }}
                  aria-pressed={isActive}
                >
                  <span style={{
                    ...styles.toggleDot,
                    background: isActive ? '#81C784' : '#5A5048',
                    transform: isActive ? 'translateX(18px)' : 'translateX(0)',
                  }} />
                </button>
                <StatusBadge isActive={isActive} size="md" />
                <input type="hidden" name="is_active" value={isActive ? 'true' : 'false'} />
              </div>
            </FormField>
          </section>

          {/* ── Dimensions ── */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Dimensions (mm)</h2>
            <div style={styles.inlineRow}>
              <FormField label="Width" htmlFor="field-width">
                <input
                  id="field-width"
                  name="width_mm"
                  type="number"
                  step="0.1"
                  defaultValue={product?.dimensions?.width_mm ?? ''}
                  placeholder="95"
                  style={styles.input}
                />
              </FormField>
              <FormField label="Height" htmlFor="field-height">
                <input
                  id="field-height"
                  name="height_mm"
                  type="number"
                  step="0.1"
                  defaultValue={product?.dimensions?.height_mm ?? ''}
                  placeholder="72"
                  style={styles.input}
                />
              </FormField>
              <FormField label="Depth" htmlFor="field-depth">
                <input
                  id="field-depth"
                  name="depth_mm"
                  type="number"
                  step="0.1"
                  defaultValue={product?.dimensions?.depth_mm ?? ''}
                  placeholder="6.2"
                  style={styles.input}
                />
              </FormField>
            </div>
          </section>
        </div>

        {/* RIGHT: Image upload */}
        <div style={styles.col}>
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Product Images</h2>
            <p style={styles.sectionHint}>
              First image is used as the shop card thumbnail. Upload up to 6 images.
            </p>
            <ImageUploadZone
              images={images}
              onChange={setImages}
              productName={name}
            />
          </section>
        </div>
      </div>

      {/* ── Submit bar ── */}
      <div style={styles.submitBar}>
        <button
          type="button"
          id="form-cancel-btn"
          onClick={() => router.push('/admin/dashboard')}
          style={styles.cancelBtn}
          disabled={isPending}
        >
          Cancel
        </button>
        <button
          type="submit"
          id="form-submit-btn"
          disabled={isPending}
          style={{
            ...styles.submitBtn,
            opacity: isPending ? 0.6 : 1,
          }}
        >
          {isPending ? (
            <>
              <span style={styles.spinnerSm} aria-hidden="true" />
              Saving…
            </>
          ) : (
            mode === 'create' ? 'Create Product' : 'Save Changes'
          )}
        </button>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input[type="number"]::-webkit-inner-spin-button { opacity: 0.4; }
        #field-slug:focus, textarea:focus, input:focus {
          border-color: rgba(184, 147, 74, 0.5) !important;
          outline: none;
        }
      `}</style>
    </form>
  );
}

// ─── FormField helper ─────────────────────────────────────────────────────────

function FormField({
  label,
  htmlFor,
  hint,
  required,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
      <label htmlFor={htmlFor} style={fieldStyles.label}>
        {label}
        {required && <span style={{ color: '#B8934A', marginLeft: '2px' }}>*</span>}
      </label>
      {children}
      {hint && <span style={fieldStyles.hint}>{hint}</span>}
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },
  errorBanner: {
    background: 'rgba(229, 115, 115, 0.1)',
    border: '1px solid rgba(229, 115, 115, 0.3)',
    borderRadius: '3px',
    padding: '0.75rem 1rem',
    color: '#E57373',
    fontSize: '0.85rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '2rem',
    alignItems: 'start',
  },
  col: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  section: {
    background: 'rgba(26, 20, 16, 0.6)',
    border: '1px solid rgba(184, 147, 74, 0.1)',
    borderRadius: '4px',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  sectionTitle: {
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: '1.1rem',
    fontWeight: 300,
    letterSpacing: '0.1em',
    color: '#EDE8E0',
    margin: 0,
    paddingBottom: '0.75rem',
    borderBottom: '1px solid rgba(184, 147, 74, 0.1)',
    textTransform: 'uppercase',
  },
  sectionHint: {
    fontSize: '0.72rem',
    color: '#8A8078',
    margin: 0,
    lineHeight: 1.5,
  },
  input: {
    width: '100%',
    background: 'rgba(14, 10, 7, 0.6)',
    border: '1px solid rgba(184, 147, 74, 0.2)',
    borderRadius: '2px',
    color: '#EDE8E0',
    fontSize: '0.875rem',
    padding: '0.65rem 0.875rem',
    transition: 'border-color 0.3s',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
  },
  slugRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 0,
  },
  slugPrefix: {
    padding: '0.65rem 0.5rem 0.65rem 0.875rem',
    background: 'rgba(14, 10, 7, 0.8)',
    border: '1px solid rgba(184, 147, 74, 0.2)',
    borderRight: 'none',
    borderRadius: '2px 0 0 2px',
    color: '#5A5048',
    fontSize: '0.8rem',
    whiteSpace: 'nowrap',
  },
  inlineRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
    gap: '0.75rem',
  },
  priceRow: {
    display: 'flex',
    alignItems: 'center',
  },
  priceCurrency: {
    padding: '0.65rem 0.5rem 0.65rem 0.875rem',
    background: 'rgba(14, 10, 7, 0.8)',
    border: '1px solid rgba(184, 147, 74, 0.2)',
    borderRight: 'none',
    borderRadius: '2px 0 0 2px',
    color: '#8A8078',
    fontSize: '0.85rem',
  },
  statusRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  toggleBtn: {
    width: '42px',
    height: '24px',
    borderRadius: '12px',
    border: '1px solid',
    cursor: 'pointer',
    position: 'relative',
    padding: 0,
    transition: 'background 0.3s, border-color 0.3s',
    flexShrink: 0,
  },
  toggleDot: {
    position: 'absolute',
    top: '3px',
    left: '3px',
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    transition: 'transform 0.3s, background 0.3s',
  },
  submitBar: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: '1rem',
    paddingTop: '1.5rem',
    borderTop: '1px solid rgba(184, 147, 74, 0.1)',
  },
  cancelBtn: {
    padding: '0.75rem 1.75rem',
    background: 'transparent',
    border: '1px solid rgba(184, 147, 74, 0.2)',
    borderRadius: '2px',
    color: '#8A8078',
    fontSize: '0.7rem',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    cursor: 'pointer',
    transition: 'border-color 0.3s, color 0.3s',
  },
  submitBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 2rem',
    background: '#B8934A',
    border: 'none',
    borderRadius: '2px',
    color: '#0E0A07',
    fontSize: '0.7rem',
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'opacity 0.3s, background 0.3s',
  },
  spinnerSm: {
    width: '13px',
    height: '13px',
    border: '2px solid rgba(14,10,7,0.3)',
    borderTopColor: '#0E0A07',
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
    display: 'inline-block',
  },
};

const fieldStyles: Record<string, React.CSSProperties> = {
  label: {
    fontSize: '0.65rem',
    letterSpacing: '0.15em',
    color: '#8A8078',
    textTransform: 'uppercase',
    fontWeight: 400,
  },
  hint: {
    fontSize: '0.65rem',
    color: '#5A5048',
    marginTop: '1px',
  },
};
