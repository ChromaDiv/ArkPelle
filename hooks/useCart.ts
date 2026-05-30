'use client';

import { useContext } from 'react';
import { CartContext } from '@/components/cart/CartProvider';

/**
 * Hook to access the cart context.
 * Throws if used outside CartProvider.
 */
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return ctx;
}
