import type { Metadata } from 'next';
import PolicyLayout from '@/components/sections/PolicyLayout';

export const metadata: Metadata = {
  title: 'Returns & Exchanges',
  description: 'Returns and Exchanges Policy for Ark Pelle — find out about our 14-day return window, packaging requirements, and processing times.',
};

export default function ReturnsPage() {
  return (
    <PolicyLayout
      title="Returns & Exchanges"
      subtitle="How to return or exchange your Ark Pelle purchase. We stand behind our meticulous craftsmanship."
      lastUpdated="June 7, 2026"
    >
      <section className="space-y-6">
        <h2 className="font-display text-xl md:text-2xl font-light text-[var(--color-ink)] uppercase tracking-wider border-b border-[var(--color-gold-dim)]/20 pb-3">
          1. Return Eligibility
        </h2>
        <p className="text-sm md:text-base text-[var(--color-ink-muted)] leading-relaxed">
          We accept returns within **14 calendar days** from the date your order was delivered. To qualify for a full refund or exchange:
        </p>
        <ul className="space-y-3 pl-4 list-none text-sm md:text-base text-[var(--color-ink-muted)]">
          <li className="flex items-start gap-2">
            <span className="text-[var(--color-gold)] mt-1.5 shrink-0 block w-1.5 h-1.5 rounded-full bg-[var(--color-gold)]" />
            <span>The item must be completely unused, unaltered, and in the same pristine condition as received.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[var(--color-gold)] mt-1.5 shrink-0 block w-1.5 h-1.5 rounded-full bg-[var(--color-gold)]" />
            <span>It must be returned inside its original luxury packaging, including the linen pouch, branded gift box, certificate of authenticity, and protective wrapping.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[var(--color-gold)] mt-1.5 shrink-0 block w-1.5 h-1.5 rounded-full bg-[var(--color-gold)]" />
            <span>Items customized, engraved, or modified to order cannot be returned or exchanged.</span>
          </li>
        </ul>
      </section>

      <section className="space-y-6 pt-6">
        <h2 className="font-display text-xl md:text-2xl font-light text-[var(--color-ink)] uppercase tracking-wider border-b border-[var(--color-gold-dim)]/20 pb-3">
          2. How to Initiate a Return
        </h2>
        <p className="text-sm md:text-base text-[var(--color-ink-muted)] leading-relaxed">
          Please follow these simple steps to ensure a smooth return process:
        </p>
        <ol className="space-y-3 pl-4 list-decimal text-sm md:text-base text-[var(--color-ink-muted)]">
          <li>
            Send an email to <strong className="text-[var(--color-gold)]">returns@arkpelle.com</strong> with your order number and the reason for the return.
          </li>
          <li>
            Our team will review your request and send you a Return Authorization Number (RAN) and a return shipping address.
          </li>
          <li>
            Securely pack the item in its original box and place it inside a outer shipping container. Write your RAN clearly on the outside.
          </li>
          <li>
            Ship the package via a trackable, insured carrier of your choice.
          </li>
        </ol>
      </section>

      <section className="space-y-6 pt-6">
        <h2 className="font-display text-xl md:text-2xl font-light text-[var(--color-ink)] uppercase tracking-wider border-b border-[var(--color-gold-dim)]/20 pb-3">
          3. Return Shipping Fees
        </h2>
        <p className="text-sm md:text-base text-[var(--color-ink-muted)] leading-relaxed">
          Unless the return is due to a craftsmanship defect or error on our part, the client is responsible for all return shipping charges. We highly recommend using a trackable shipping method and purchasing shipping insurance, as we are not liable for packages lost or damaged in transit.
        </p>
      </section>

      <section className="space-y-6 pt-6">
        <h2 className="font-display text-xl md:text-2xl font-light text-[var(--color-ink)] uppercase tracking-wider border-b border-[var(--color-gold-dim)]/20 pb-3">
          4. Inspection & Refunds
        </h2>
        <p className="text-sm md:text-base text-[var(--color-ink-muted)] leading-relaxed">
          Once we receive your return, it will undergo inspection by our leather craftsmen to confirm eligibility. If approved, we will process your refund immediately.
        </p>
        <p className="text-sm md:text-base text-[var(--color-ink-muted)] leading-relaxed">
          Refunds are credited to the original payment method (e.g. your credit card). Most banks and card processors take **5 to 10 business days** to post the credit to your account.
        </p>
      </section>

      <section className="space-y-6 pt-6">
        <h2 className="font-display text-xl md:text-2xl font-light text-[var(--color-ink)] uppercase tracking-wider border-b border-[var(--color-gold-dim)]/20 pb-3">
          5. Exchanges
        </h2>
        <p className="text-sm md:text-base text-[var(--color-ink-muted)] leading-relaxed">
          If you wish to exchange an item for a different color or style, please request an exchange when emailing <strong className="text-[var(--color-gold)]">returns@arkpelle.com</strong>. Standard shipping rates will apply to the exchange shipment.
        </p>
      </section>
    </PolicyLayout>
  );
}
