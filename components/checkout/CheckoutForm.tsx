'use client';

import { useState, useTransition } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useCart } from '@/hooks/useCart';
import { useSupabase } from '@/components/providers/SupabaseProvider';
import { createClient } from '@/lib/supabase/client';
import CartLineItem from '@/components/molecules/CartLineItem';
import Button from '@/components/atoms/Button';
import GoldRule from '@/components/atoms/GoldRule';
import { formatPrice, cn } from '@/lib/utils';
import type { ShippingAddress } from '@/lib/supabase/types';

type CheckoutStep = 'cart' | 'auth' | 'shipping' | 'confirm';

interface OrderResult {
  orderId: string;
  total: string;
}

/**
 * CheckoutForm — single-page checkout flow.
 * Steps: cart review → auth (if not signed in) → shipping → confirmation.
 */
export default function CheckoutForm() {
  const { items, subtotalCents, currency, itemCount, clearCart } = useCart();
  const { user, isLoading: authLoading } = useSupabase();
  const shouldReduce = useReducedMotion();

  const [step, setStep] = useState<CheckoutStep>('cart');
  const [orderResult, setOrderResult] = useState<OrderResult | null>(null);
  const [isPending, startTransition] = useTransition();
  const [authError, setAuthError] = useState('');
  const [email, setEmail] = useState('');
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    full_name: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'Pakistan',
  });

  const displayTotal = formatPrice(subtotalCents, currency);

  // Step: Cart → Auth
  function proceedFromCart() {
    if (user) {
      setStep('shipping');
    } else {
      setStep('auth');
    }
  }

  // Step: Auth — magic link
  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setAuthError('');
    startTransition(async () => {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: { emailRedirectTo: `${window.location.origin}/checkout` },
      });
      if (error) {
        setAuthError(error.message);
      } else {
        setAuthError('Check your email for the sign-in link. Return here after clicking it.');
      }
    });
  }

  // Step: Submit order
  async function handlePlaceOrder(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            variant: i.variant,
          })),
          shippingAddress,
          currency,
        }),
      });

      const data = (await res.json()) as { orderId?: string; error?: string };

      if (!res.ok || !data.orderId) {
        setAuthError(data.error ?? 'Order failed. Please try again.');
        return;
      }

      setOrderResult({ orderId: data.orderId, total: displayTotal });
      clearCart();
      setStep('confirm');
    });
  }

  return (
    <div className="max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {/* ── STEP: CART ── */}
        {step === 'cart' && (
          <StepPanel key="cart" shouldReduce={shouldReduce ?? false}>
            <h2 className="font-display font-light text-3xl text-[var(--color-ink)] mb-8 tracking-[0.02em]">
              Your Bag
            </h2>

            {itemCount === 0 ? (
              <div className="py-16 text-center">
                <p className="font-body text-sm text-[var(--color-ink-muted)] mb-6">Your bag is empty.</p>
                <Button variant="outline" onClick={() => (window.location.href = '/shop')}>
                  Browse the Collection
                </Button>
              </div>
            ) : (
              <>
                <div>
                  {items.map((item) => (
                    <CartLineItem key={item.id} item={item} />
                  ))}
                </div>

                <div className="mt-8 space-y-3">
                  <GoldRule />
                  <div className="flex justify-between pt-3">
                    <span className="font-body text-sm text-[var(--color-ink-muted)] tracking-[0.08em] uppercase">
                      Subtotal
                    </span>
                    <span className="font-body text-base text-[var(--color-gold)]">{displayTotal}</span>
                  </div>
                  <p className="font-body text-2xs text-[var(--color-ink-muted)] tracking-[0.06em]">
                    Shipping calculated at next step
                  </p>
                </div>

                <Button
                  id="checkout-proceed-btn"
                  variant="primary"
                  size="lg"
                  className="w-full mt-8"
                  onClick={proceedFromCart}
                >
                  Proceed to Checkout
                </Button>
              </>
            )}
          </StepPanel>
        )}

        {/* ── STEP: AUTH ── */}
        {step === 'auth' && (
          <StepPanel key="auth" shouldReduce={shouldReduce ?? false}>
            <button
              onClick={() => setStep('cart')}
              className="font-body text-xs tracking-[0.15em] uppercase text-[var(--color-ink-muted)] hover:text-[var(--color-gold)] transition-colors mb-8 flex items-center gap-2"
            >
              ← Back
            </button>
            <h2 className="font-display font-light text-3xl text-[var(--color-ink)] mb-3 tracking-[0.02em]">
              Sign In to Continue
            </h2>
            <p className="font-body text-sm text-[var(--color-ink-muted)] mb-8 leading-relaxed">
              We&apos;ll send you a sign-in link. No password required.
            </p>

            <form onSubmit={handleMagicLink} className="space-y-4" noValidate>
              <div>
                <label htmlFor="auth-email" className="sr-only">Email address</label>
                <input
                  id="auth-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full bg-[var(--color-surface)] border border-gold-dim/50 px-5 py-4 font-body text-base md:text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--color-surface)]"
                />
              </div>
              {authError && (
                <p className="font-body text-xs text-[var(--color-ink-muted)] leading-relaxed" role="status">
                  {authError}
                </p>
              )}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                loading={isPending}
              >
                Send Sign-In Link
              </Button>
            </form>
          </StepPanel>
        )}

        {/* ── STEP: SHIPPING ── */}
        {step === 'shipping' && (
          <StepPanel key="shipping" shouldReduce={shouldReduce ?? false}>
            <button
              onClick={() => setStep('cart')}
              className="font-body text-xs tracking-[0.15em] uppercase text-[var(--color-ink-muted)] hover:text-[var(--color-gold)] transition-colors mb-8 flex items-center gap-2"
            >
              ← Back
            </button>
            <h2 className="font-display font-light text-3xl text-[var(--color-ink)] mb-8 tracking-[0.02em]">
              Shipping Details
            </h2>

            <form onSubmit={handlePlaceOrder} className="space-y-5" noValidate>
              <FormField
                id="shipping-name"
                label="Full Name"
                value={shippingAddress.full_name}
                onChange={(v) => setShippingAddress((s) => ({ ...s, full_name: v }))}
                required
              />
              <FormField
                id="shipping-line1"
                label="Address Line 1"
                value={shippingAddress.line1}
                onChange={(v) => setShippingAddress((s) => ({ ...s, line1: v }))}
                required
              />
              <FormField
                id="shipping-line2"
                label="Address Line 2"
                value={shippingAddress.line2 ?? ''}
                onChange={(v) => setShippingAddress((s) => ({ ...s, line2: v }))}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  id="shipping-city"
                  label="City"
                  value={shippingAddress.city}
                  onChange={(v) => setShippingAddress((s) => ({ ...s, city: v }))}
                  required
                />
                <div>
                  <label
                    htmlFor="shipping-province"
                    className="block font-body text-2xs tracking-[0.15em] uppercase text-[var(--color-ink-muted)] mb-2"
                  >
                    Province *
                  </label>
                  <select
                    id="shipping-province"
                    value={shippingAddress.state}
                    onChange={(e) => setShippingAddress((s) => ({ ...s, state: e.target.value }))}
                    required
                    className={cn(
                      'w-full bg-[var(--color-surface)] border border-gold-dim/50',
                      'px-4 py-3 font-body text-base md:text-sm text-[var(--color-ink)]',
                      'outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--color-surface)]',
                      'transition-colors duration-300'
                    )}
                  >
                    <option value="" disabled style={{ background: '#1A1410', color: '#8A8078' }}>
                      Select Province
                    </option>
                    <option value="Punjab" style={{ background: '#1A1410', color: '#EDE8E0' }}>Punjab</option>
                    <option value="Sindh" style={{ background: '#1A1410', color: '#EDE8E0' }}>Sindh</option>
                    <option value="Khyber Pakhtunkhwa" style={{ background: '#1A1410', color: '#EDE8E0' }}>Khyber Pakhtunkhwa (KPK)</option>
                    <option value="Balochistan" style={{ background: '#1A1410', color: '#EDE8E0' }}>Balochistan</option>
                    <option value="Islamabad Capital Territory" style={{ background: '#1A1410', color: '#EDE8E0' }}>Islamabad Capital Territory</option>
                    <option value="Azad Kashmir" style={{ background: '#1A1410', color: '#EDE8E0' }}>Azad Jammu & Kashmir (AJK)</option>
                    <option value="Gilgit-Baltistan" style={{ background: '#1A1410', color: '#EDE8E0' }}>Gilgit-Baltistan</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  id="shipping-postal"
                  label="Postal Code"
                  value={shippingAddress.postal_code}
                  onChange={(v) => setShippingAddress((s) => ({ ...s, postal_code: v }))}
                  required={false}
                />
                <FormField
                  id="shipping-country"
                  label="Country"
                  value={shippingAddress.country}
                  onChange={(v) => setShippingAddress((s) => ({ ...s, country: v }))}
                  required
                  disabled
                />
              </div>

              <GoldRule className="my-6" />

              {/* Order summary */}
              <div className="flex justify-between">
                <span className="font-body text-sm text-[var(--color-ink-muted)] tracking-[0.08em] uppercase">Total</span>
                <span className="font-body text-base text-[var(--color-gold)]">{displayTotal}</span>
              </div>
              <p className="font-body text-2xs text-[var(--color-ink-muted)]">
                Free standard shipping included.
              </p>

              {authError && (
                <p className="font-body text-xs text-red-400" role="alert">{authError}</p>
              )}

              <Button
                id="place-order-btn"
                type="submit"
                variant="primary"
                size="lg"
                className="w-full mt-2"
                loading={isPending}
              >
                Place Order — {displayTotal}
              </Button>
            </form>
          </StepPanel>
        )}

        {/* ── STEP: CONFIRMATION ── */}
        {step === 'confirm' && orderResult && (
          <StepPanel key="confirm" shouldReduce={shouldReduce ?? false}>
            <div className="text-center py-12">
              {/* Animated checkmark */}
              <motion.div
                initial={{ scale: shouldReduce ? 1 : 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="w-16 h-16 rounded-full border border-[var(--color-gold)] flex items-center justify-center mx-auto mb-8"
              >
                <svg width="24" height="18" viewBox="0 0 24 18" fill="none" aria-hidden="true">
                  <path d="M1 9L8.5 16.5L23 1" stroke="var(--color-gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.div>

              <h2 className="font-display font-light text-3xl text-[var(--color-ink)] mb-4 tracking-[0.02em]">
                Order Confirmed
              </h2>
              <p className="font-body text-sm text-[var(--color-ink-muted)] mb-2 leading-relaxed">
                Thank you. Your No. 1 is on its way.
              </p>
              <p className="font-body text-2xs text-[var(--color-ink-muted)] tracking-[0.1em] mb-2">
                Order ID
              </p>
              <p className="font-body text-xs text-[var(--color-gold)] tracking-[0.08em] mb-2 break-all">
                {orderResult.orderId}
              </p>
              <p className="font-body text-sm text-[var(--color-gold)] mb-12">
                {orderResult.total}
              </p>

              <GoldRule className="max-w-xs mx-auto mb-10" />

              <Button
                variant="outline"
                size="md"
                onClick={() => (window.location.href = '/')}
              >
                Return Home
              </Button>
            </div>
          </StepPanel>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────

function StepPanel({
  children,
  shouldReduce,
}: {
  children: React.ReactNode;
  shouldReduce: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduce ? 0 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: shouldReduce ? 0 : -20 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

function FormField({
  id,
  label,
  value,
  onChange,
  required = false,
  disabled = false,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  disabled?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block font-body text-2xs tracking-[0.15em] uppercase text-[var(--color-ink-muted)] mb-2"
      >
        {label}{required && ' *'}
      </label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        disabled={disabled}
        className={cn(
          'w-full bg-[var(--color-surface)] border border-gold-dim/50',
          'px-4 py-3 font-body text-base md:text-sm text-[var(--color-ink)]',
          'placeholder:text-[var(--color-ink-muted)] outline-none',
          'focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--color-surface)]',
          'transition-colors duration-300',
          disabled && 'opacity-60 cursor-not-allowed border-gold-dim/20'
        )}
      />
    </div>
  );
}
