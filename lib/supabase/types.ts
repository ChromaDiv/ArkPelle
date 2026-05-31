// Supabase database type definitions.
// These mirror the SQL schema exactly.
// Regenerate with: npx supabase gen types typescript --local > lib/supabase/types.ts

export interface ProductImage {
  url: string;
  alt: string;
}

export interface ProductDimensions {
  width_mm: number;
  height_mm: number;
  depth_mm: number;
}

export interface ShippingAddress {
  full_name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export interface OrderItemVariant {
  finish?: string;
  color?: string;
}

// ─── Row types (what Supabase returns) ─────────────────────────────────────

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price_cents: number;
  currency: string;
  images: ProductImage[];
  material: string;
  dimensions: ProductDimensions;
  card_capacity: number;
  is_active: boolean;
  is_sold_out: boolean;
  display_order: number;
  discount_percent: number;
  collection_id: string | null;
  created_at: string;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  teaser_copy: string | null;
  release_date: string | null;
  is_visible: boolean;
  created_at: string;
}

export interface Profile {
  id: string;
  full_name: string | null;
  shipping_addresses: ShippingAddress[];
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  total_cents: number;
  currency: string;
  shipping_address: ShippingAddress;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price_cents: number;
  variant: OrderItemVariant | null;
}

export interface WaitlistEntry {
  id: string;
  email: string;
  created_at: string;
}

// ─── Supabase Database schema type ─────────────────────────────────────────
// This must follow the exact structure @supabase/ssr expects.

export type Database = {
  public: {
    Tables: {
      products: {
        Row: Product;
        Insert: {
          id?: string;
          slug: string;
          name: string;
          description: string;
          price_cents: number;
          currency?: string;
          images?: ProductImage[];
          material: string;
          dimensions?: ProductDimensions;
          card_capacity: number;
          is_active?: boolean;
          is_sold_out?: boolean;
          display_order?: number;
          discount_percent?: number;
          collection_id?: string | null;
          created_at?: string;
        };
        Update: Partial<{
          slug: string;
          name: string;
          description: string;
          price_cents: number;
          currency: string;
          images: ProductImage[];
          material: string;
          dimensions: ProductDimensions;
          card_capacity: number;
          is_active: boolean;
          is_sold_out: boolean;
          display_order: number;
          discount_percent: number;
          collection_id: string | null;
        }>;
        Relationships: [];
      };
      collections: {
        Row: Collection;
        Insert: {
          id?: string;
          name: string;
          slug: string;
          teaser_copy?: string | null;
          release_date?: string | null;
          is_visible?: boolean;
          created_at?: string;
        };
        Update: Partial<{
          name: string;
          slug: string;
          teaser_copy: string | null;
          release_date: string | null;
          is_visible: boolean;
        }>;
        Relationships: [];
      };
      profiles: {
        Row: Profile;
        Insert: {
          id: string;
          full_name?: string | null;
          shipping_addresses?: ShippingAddress[];
          created_at?: string;
        };
        Update: Partial<{
          full_name: string | null;
          shipping_addresses: ShippingAddress[];
        }>;
        Relationships: [];
      };
      orders: {
        Row: Order;
        Insert: {
          id?: string;
          user_id: string;
          status?: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
          total_cents: number;
          currency?: string;
          shipping_address: ShippingAddress;
          created_at?: string;
        };
        Update: Partial<{
          status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
          total_cents: number;
          currency: string;
          shipping_address: ShippingAddress;
        }>;
        Relationships: [];
      };
      order_items: {
        Row: OrderItem;
        Insert: {
          id?: string;
          order_id: string;
          product_id: string;
          quantity: number;
          unit_price_cents: number;
          variant?: OrderItemVariant | null;
        };
        Update: Partial<{
          quantity: number;
          unit_price_cents: number;
          variant: OrderItemVariant | null;
        }>;
        Relationships: [];
      };
      waitlist: {
        Row: WaitlistEntry;
        Insert: {
          id?: string;
          email: string;
          created_at?: string;
        };
        Update: never;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
