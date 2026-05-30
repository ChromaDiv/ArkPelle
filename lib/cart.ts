import type { ProductImage, OrderItemVariant } from './supabase/types';

export interface CartItem {
  /** Cart line ID — product slug + variant key */
  id: string;
  productId: string;
  slug: string;
  name: string;
  price_cents: number;
  currency: string;
  quantity: number;
  image: ProductImage | null;
  variant: OrderItemVariant | null;
}

export type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: { id: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' };

export interface CartState {
  items: CartItem[];
}

export const initialCartState: CartState = { items: [] };

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find((i) => i.id === action.payload.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === action.payload.id
              ? { ...i, quantity: i.quantity + action.payload.quantity }
              : i
          ),
        };
      }
      return { ...state, items: [...state.items, action.payload] };
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((i) => i.id !== action.payload.id),
      };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.payload.id
            ? { ...i, quantity: Math.max(1, action.payload.quantity) }
            : i
        ),
      };
    case 'CLEAR_CART':
      return initialCartState;
    default:
      return state;
  }
}

/** Compute cart totals */
export function computeCartTotals(items: CartItem[]): {
  itemCount: number;
  subtotalCents: number;
  currency: string;
} {
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotalCents = items.reduce((sum, i) => sum + i.price_cents * i.quantity, 0);
  const currency = items[0]?.currency ?? 'USD';
  return { itemCount, subtotalCents, currency };
}

/** Generate a stable cart line ID from product + variant */
export function makeCartLineId(productId: string, variant: OrderItemVariant | null): string {
  if (!variant) return productId;
  const variantKey = Object.entries(variant)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}:${v}`)
    .join('|');
  return `${productId}__${variantKey}`;
}
