'use client';

import {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
} from 'react';
import {
  cartReducer,
  initialCartState,
  computeCartTotals,
  makeCartLineId,
  type CartState,
  type CartItem,
} from '@/lib/cart';
import type { Product, OrderItemVariant } from '@/lib/supabase/types';

interface CartContextValue extends CartState {
  addItem: (product: Product, quantity?: number, variant?: OrderItemVariant | null) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotalCents: number;
  currency: string;
}

const CartContext = createContext<CartContextValue | null>(null);

/**
 * CartProvider — wraps the app with cart state.
 * State lives in memory (useReducer); survives page navigation.
 * No persistence for MVP — sessionStorage fallback can be added later.
 */
export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialCartState);
  const { itemCount, subtotalCents, currency } = computeCartTotals(state.items);

  function addItem(
    product: Product,
    quantity: number = 1,
    variant: OrderItemVariant | null = null
  ) {
    const id = makeCartLineId(product.id, variant);
    const hasDiscount = (product.discount_percent ?? 0) > 0;
    const finalPriceCents = hasDiscount
      ? Math.round(product.price_cents * (1 - product.discount_percent / 100))
      : product.price_cents;

    const item: CartItem = {
      id,
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price_cents: finalPriceCents,
      currency: product.currency,
      quantity,
      image: product.images.find(img => img.isMain) || product.images[0] || null,
      variant,
    };
    dispatch({ type: 'ADD_ITEM', payload: item });
  }

  function removeItem(id: string) {
    dispatch({ type: 'REMOVE_ITEM', payload: { id } });
  }

  function updateQuantity(id: string, quantity: number) {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  }

  function clearCart() {
    dispatch({ type: 'CLEAR_CART' });
  }

  return (
    <CartContext.Provider
      value={{
        ...state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        subtotalCents,
        currency,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export { CartContext };
