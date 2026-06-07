import type { Metadata } from 'next';
import PolicyLayout from '@/components/sections/PolicyLayout';

export const metadata: Metadata = {
  title: 'Terms of Sale',
  description: 'Terms of Sale for Ark Pelle — purchasing guidelines, payment authorizations, shipping conditions, and agreements.',
};

export default function TermsPage() {
  return (
    <PolicyLayout
      title="Terms of Sale"
      subtitle="The conditions, agreements, and procedures governing your purchases with Ark Pelle."
      lastUpdated="June 7, 2026"
    >
      <section className="space-y-6">
        <h2 className="font-display text-xl md:text-2xl font-light text-[var(--color-ink)] uppercase tracking-wider border-b border-[var(--color-gold-dim)]/20 pb-3">
          1. General Scope
        </h2>
        <p className="text-sm md:text-base text-[var(--color-ink-muted)] leading-relaxed">
          These Terms of Sale apply to all purchases of products made from the Ark Pelle website. By confirming an order, you agree to comply with and be bound by these conditions.
        </p>
      </section>

      <section className="space-y-6 pt-6">
        <h2 className="font-display text-xl md:text-2xl font-light text-[var(--color-ink)] uppercase tracking-wider border-b border-[var(--color-gold-dim)]/20 pb-3">
          2. Product Descriptions & Pricing
        </h2>
        <p className="text-sm md:text-base text-[var(--color-ink-muted)] leading-relaxed">
          Ark Pelle goods are handcrafted using natural full-grain vegetable-tanned leather. Because leather is a natural material, slight variations in grain pattern, color shading, or natural markings are characteristic of the artisanal manufacturing process and do not constitute defects.
        </p>
        <p className="text-sm md:text-base text-[var(--color-ink-muted)] leading-relaxed">
          Prices displayed on our site are in the currency specified at checkout. Shipping fees and applicable taxes will be added during the checkout process and displayed prior to payment confirmation. We reserve the right to correct pricing errors or modify rates at any time.
        </p>
      </section>

      <section className="space-y-6 pt-6">
        <h2 className="font-display text-xl md:text-2xl font-light text-[var(--color-ink)] uppercase tracking-wider border-b border-[var(--color-gold-dim)]/20 pb-3">
          3. Order Authorization & Payments
        </h2>
        <p className="text-sm md:text-base text-[var(--color-ink-muted)] leading-relaxed">
          When you place an order, we verify transaction data, item quantities, and stock availability. An order is only accepted and processed once card payment is cleared. Payment processing is facilitated via Stripe, which enforces strict compliance and encryption standards.
        </p>
      </section>

      <section className="space-y-6 pt-6">
        <h2 className="font-display text-xl md:text-2xl font-light text-[var(--color-ink)] uppercase tracking-wider border-b border-[var(--color-gold-dim)]/20 pb-3">
          4. Shipping & Risk of Loss
        </h2>
        <p className="text-sm md:text-base text-[var(--color-ink-muted)] leading-relaxed">
          Ark Pelle products ship from our workshop. Shipments are handed to national and international logistics carriers (such as DHL or FedEx). The risk of loss and title for all products pass to you upon our delivery of the items to the carrier.
        </p>
        <p className="text-sm md:text-base text-[var(--color-ink-muted)] leading-relaxed">
          Customers are responsible for any custom duties, clearance charges, import taxes, or local carrier fees applied by their country of destination.
        </p>
      </section>

      <section className="space-y-6 pt-6">
        <h2 className="font-display text-xl md:text-2xl font-light text-[var(--color-ink)] uppercase tracking-wider border-b border-[var(--color-gold-dim)]/20 pb-3">
          5. Craftsmanship & Care Guarantee
        </h2>
        <p className="text-sm md:text-base text-[var(--color-ink-muted)] leading-relaxed">
          We guarantee our leather items against stitching structure failures for one (1) year from the date of purchase. This warranty does not cover:
        </p>
        <ul className="space-y-3 pl-4 list-none text-sm md:text-base text-[var(--color-ink-muted)]">
          <li className="flex items-start gap-2">
            <span className="text-[var(--color-gold)] mt-1.5 shrink-0 block w-1.5 h-1.5 rounded-full bg-[var(--color-gold)]" />
            <span>Natural patina growth, stretch, or color fading from sun exposure.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[var(--color-gold)] mt-1.5 shrink-0 block w-1.5 h-1.5 rounded-full bg-[var(--color-gold)]" />
            <span>Chemical exposure, dye transfer, water damage, or extreme heat.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[var(--color-gold)] mt-1.5 shrink-0 block w-1.5 h-1.5 rounded-full bg-[var(--color-gold)]" />
            <span>Scratches, gouges, or standard wear and tear from daily carry.</span>
          </li>
        </ul>
      </section>

      <section className="space-y-6 pt-6">
        <h2 className="font-display text-xl md:text-2xl font-light text-[var(--color-ink)] uppercase tracking-wider border-b border-[var(--color-gold-dim)]/20 pb-3">
          6. Contact and Inquiries
        </h2>
        <p className="text-sm md:text-base text-[var(--color-ink-muted)] leading-relaxed">
          For any clarifications regarding the purchase policy, please send a message to:
        </p>
        <div className="text-sm md:text-base text-[var(--color-gold)] font-medium">
          orders@arkpelle.com
        </div>
      </section>
    </PolicyLayout>
  );
}
