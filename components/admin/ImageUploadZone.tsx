'use client';

import { useCallback, useRef, useState } from 'react';
import Image from 'next/image';
import { uploadProductImage } from '@/app/actions/products';

export interface UploadedImage {
  url: string;
  alt: string;
}

interface ImageUploadZoneProps {
  images: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
  productName?: string;
}

export default function ImageUploadZone({ images, onChange, productName = '' }: ImageUploadZoneProps) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Only image files are accepted.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('File must be under 5 MB.');
      return;
    }

    setError('');
    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    const result = await uploadProductImage(formData);
    setUploading(false);

    if (result.error) {
      setError(result.error);
    } else if (result.url) {
      onChange([...images, { url: result.url, alt: productName || file.name }]);
    }
  }, [images, onChange, productName]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const files = Array.from(e.dataTransfer.files);
    files.forEach(uploadFile);
  }, [uploadFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    files.forEach(uploadFile);
    // Reset so same file can be re-selected
    e.target.value = '';
  }, [uploadFile]);

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const updateAlt = (index: number, alt: string) => {
    const next = images.map((img, i) => i === index ? { ...img, alt } : img);
    onChange(next);
  };

  return (
    <div style={styles.root}>
      {/* Drop zone */}
      <div
        role="button"
        tabIndex={0}
        id="image-upload-dropzone"
        aria-label="Upload product images"
        style={{
          ...styles.dropZone,
          borderColor: dragging
            ? 'rgba(184, 147, 74, 0.7)'
            : 'rgba(184, 147, 74, 0.22)',
          background: dragging
            ? 'rgba(184, 147, 74, 0.05)'
            : 'rgba(14, 10, 7, 0.4)',
        }}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        onKeyDown={e => e.key === 'Enter' && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          multiple
          style={{ display: 'none' }}
          onChange={handleFileInput}
          aria-hidden="true"
        />

        {uploading ? (
          <div style={styles.uploadingState}>
            <div style={styles.spinner} aria-hidden="true" />
            <span style={styles.uploadingText}>Uploading…</span>
          </div>
        ) : (
          <div style={styles.idleState}>
            <div style={styles.uploadIcon} aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            </div>
            <span style={styles.dropText}>
              Drag & drop images here<br />
              <span style={styles.dropSubtext}>or click to browse · JPEG, PNG, WebP · max 5 MB</span>
            </span>
          </div>
        )}
      </div>

      {error && <p style={styles.error}>{error}</p>}

      {/* Image thumbnails with alt editor */}
      {images.length > 0 && (
        <div style={styles.thumbGrid}>
          {images.map((img, i) => (
            <div key={i} style={styles.thumbCard}>
              <div style={styles.thumbImgWrap}>
                <Image
                  src={img.url}
                  alt={img.alt}
                  fill
                  sizes="120px"
                  style={{ objectFit: 'cover', borderRadius: '3px' }}
                />
                <button
                  type="button"
                  id={`remove-image-${i}`}
                  onClick={() => removeImage(i)}
                  style={styles.removeBtn}
                  aria-label={`Remove image ${i + 1}`}
                >
                  ×
                </button>
              </div>
              {/* Hidden inputs so alt text ends up in FormData */}
              <input type="hidden" name="image_url" value={img.url} />
              <input
                type="text"
                name="image_alt"
                value={img.alt}
                onChange={e => updateAlt(i, e.target.value)}
                placeholder="Alt text…"
                style={styles.altInput}
                className="admin-upload-alt-input"
                aria-label={`Alt text for image ${i + 1}`}
              />
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 480px) {
          .admin-upload-alt-input {
            font-size: 16px !important;
            padding: 0.5rem 0.65rem !important; /* Larger touch area */
          }
        }
      `}</style>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  dropZone: {
    border: '1px dashed',
    borderRadius: '3px',
    padding: '2.5rem 1.5rem',
    cursor: 'pointer',
    transition: 'border-color 0.3s, background 0.3s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    userSelect: 'none',
    minHeight: '130px',
  },
  idleState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.75rem',
  },
  uploadIcon: {
    color: '#B8934A',
    opacity: 0.7,
  },
  dropText: {
    fontSize: '0.8rem',
    color: '#8A8078',
    textAlign: 'center',
    lineHeight: 1.7,
  },
  dropSubtext: {
    fontSize: '0.7rem',
    color: '#5A5048',
    display: 'block',
  },
  uploadingState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.75rem',
  },
  spinner: {
    width: '28px',
    height: '28px',
    border: '2px solid rgba(184, 147, 74, 0.2)',
    borderTopColor: '#B8934A',
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
  },
  uploadingText: {
    fontSize: '0.75rem',
    letterSpacing: '0.12em',
    color: '#B8934A',
    textTransform: 'uppercase',
  },
  error: {
    fontSize: '0.78rem',
    color: '#E57373',
    margin: 0,
  },
  thumbGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
    gap: '0.75rem',
  },
  thumbCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
  thumbImgWrap: {
    position: 'relative',
    width: '100%',
    paddingTop: '100%',
    background: '#1A1410',
    borderRadius: '3px',
    overflow: 'hidden',
    border: '1px solid rgba(184, 147, 74, 0.15)',
  },
  removeBtn: {
    position: 'absolute',
    top: '4px',
    right: '4px',
    width: '22px',
    height: '22px',
    borderRadius: '50%',
    background: 'rgba(14, 10, 7, 0.85)',
    border: '1px solid rgba(184, 147, 74, 0.4)',
    color: '#EDE8E0',
    fontSize: '1rem',
    lineHeight: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    padding: 0,
  },
  altInput: {
    width: '100%',
    background: 'rgba(14, 10, 7, 0.5)',
    border: '1px solid rgba(184, 147, 74, 0.15)',
    borderRadius: '2px',
    color: '#8A8078',
    fontSize: '0.65rem',
    padding: '0.35rem 0.5rem',
    outline: 'none',
    boxSizing: 'border-box',
  },
};
