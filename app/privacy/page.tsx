import type { Metadata } from 'next';
import PolicyLayout from '@/components/sections/PolicyLayout';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Ark Pelle Privacy Policy — how we protect, collect, and handle your data with respect and absolute security.',
};

export default function PrivacyPage() {
  return (
    <PolicyLayout
      title="Privacy Policy"
      subtitle="How we collect, use, and safeguard your personal information at Ark Pelle. We respect your absolute privacy."
      lastUpdated="June 7, 2026"
    >
      <section className="space-y-6">
        <h2 className="font-display text-xl md:text-2xl font-light text-[var(--color-ink)] uppercase tracking-wider border-b border-[var(--color-gold-dim)]/20 pb-3">
          1. Information We Collect
        </h2>
        <p className="text-sm md:text-base text-[var(--color-ink-muted)] leading-relaxed">
          At Ark Pelle, we collect information necessary to fulfill your orders, provide a seamless experience, and communicate updates about our collections.
        </p>
        <ul className="space-y-3 pl-4 list-none text-sm md:text-base text-[var(--color-ink-muted)]">
          <li className="flex items-start gap-2">
            <span className="text-[var(--color-gold)] mt-1.5 shrink-0 block w-1.5 h-1.5 rounded-full bg-[var(--color-gold)]" />
            <span><strong>Identity & Contact Data:</strong> Your name, billing address, shipping address, email address, and phone number.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[var(--color-gold)] mt-1.5 shrink-0 block w-1.5 h-1.5 rounded-full bg-[var(--color-gold)]" />
            <span><strong>Transaction Data:</strong> Details about payments, order history, products purchased, and payment method details (fully tokenized and processed securely via Stripe).</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[var(--color-gold)] mt-1.5 shrink-0 block w-1.5 h-1.5 rounded-full bg-[var(--color-gold)]" />
            <span><strong>Technical & Usage Data:</strong> IP address, device types, browser version, page navigation, and search queries within our store.</span>
          </li>
        </ul>
      </section>

      <section className="space-y-6 pt-6">
        <h2 className="font-display text-xl md:text-2xl font-light text-[var(--color-ink)] uppercase tracking-wider border-b border-[var(--color-gold-dim)]/20 pb-3">
          2. How We Use Your Information
        </h2>
        <p className="text-sm md:text-base text-[var(--color-ink-muted)] leading-relaxed">
          All collected information is used solely to enhance our products, fulfill shipments, and maintain secure business operations. Specific applications include:
        </p>
        <ul className="space-y-3 pl-4 list-none text-sm md:text-base text-[var(--color-ink-muted)]">
          <li className="flex items-start gap-2">
            <span className="text-[var(--color-gold)] mt-1.5 shrink-0 block w-1.5 h-1.5 rounded-full bg-[var(--color-gold)]" />
            <span>Processing and executing transactions, shipping tracking, and order notifications.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[var(--color-gold)] mt-1.5 shrink-0 block w-1.5 h-1.5 rounded-full bg-[var(--color-gold)]" />
            <span>Preventing fraudulent transactions and ensuring web app security.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[var(--color-gold)] mt-1.5 shrink-0 block w-1.5 h-1.5 rounded-full bg-[var(--color-gold)]" />
            <span>Responding to customer support inquiries and tailoring assistance.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[var(--color-gold)] mt-1.5 shrink-0 block w-1.5 h-1.5 rounded-full bg-[var(--color-gold)]" />
            <span>Sending occasional emails about new collection releases, brand stories, or private events (you can opt out at any time).</span>
          </li>
        </ul>
      </section>

      <section className="space-y-6 pt-6">
        <h2 className="font-display text-xl md:text-2xl font-light text-[var(--color-ink)] uppercase tracking-wider border-b border-[var(--color-gold-dim)]/20 pb-3">
          3. Sharing Data with Third Parties
        </h2>
        <p className="text-sm md:text-base text-[var(--color-ink-muted)] leading-relaxed">
          We do not sell, rent, or trade your personal data with third-party advertisers. We only share essential data with critical partners to complete your order, namely:
        </p>
        <ul className="space-y-3 pl-4 list-none text-sm md:text-base text-[var(--color-ink-muted)]">
          <li className="flex items-start gap-2">
            <span className="text-[var(--color-gold)] mt-1.5 shrink-0 block w-1.5 h-1.5 rounded-full bg-[var(--color-gold)]" />
            <span><strong>Payment Gateways (Stripe):</strong> To safely verify and capture credit card payments.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[var(--color-gold)] mt-1.5 shrink-0 block w-1.5 h-1.5 rounded-full bg-[var(--color-gold)]" />
            <span><strong>Logistics & Carriers:</strong> DHL, FedEx, or national postal carriers to print shipping labels and deliver products.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[var(--color-gold)] mt-1.5 shrink-0 block w-1.5 h-1.5 rounded-full bg-[var(--color-gold)]" />
            <span><strong>Infrastructure Services:</strong> Supabase for secure data storage.</span>
          </li>
        </ul>
      </section>

      <section className="space-y-6 pt-6">
        <h2 className="font-display text-xl md:text-2xl font-light text-[var(--color-ink)] uppercase tracking-wider border-b border-[var(--color-gold-dim)]/20 pb-3">
          4. Cookies & Custom Sessions
        </h2>
        <p className="text-sm md:text-base text-[var(--color-ink-muted)] leading-relaxed">
          We use secure cookie settings and local storage protocols to facilitate cart updates, track page layout states, and remember active sessions. No cross-site advertisement cookies are generated by our application.
        </p>
      </section>

      <section className="space-y-6 pt-6">
        <h2 className="font-display text-xl md:text-2xl font-light text-[var(--color-ink)] uppercase tracking-wider border-b border-[var(--color-gold-dim)]/20 pb-3">
          5. Data Security
        </h2>
        <p className="text-sm md:text-base text-[var(--color-ink-muted)] leading-relaxed">
          All connection requests are routed securely over HTTPS. Order structures and customer data are fully safeguarded with modern encryption standards. We evaluate database security frequently to assure the highest integrity.
        </p>
      </section>

      <section className="space-y-6 pt-6">
        <h2 className="font-display text-xl md:text-2xl font-light text-[var(--color-ink)] uppercase tracking-wider border-b border-[var(--color-gold-dim)]/20 pb-3">
          6. Your Rights
        </h2>
        <p className="text-sm md:text-base text-[var(--color-ink-muted)] leading-relaxed">
          Depending on your location, you have rights to request access to your personal data, require corrections, request deletion, or restrict processing. Contact our support team to verify or change your settings.
        </p>
      </section>

      <section className="space-y-6 pt-6">
        <h2 className="font-display text-xl md:text-2xl font-light text-[var(--color-ink)] uppercase tracking-wider border-b border-[var(--color-gold-dim)]/20 pb-3">
          7. Contact Information
        </h2>
        <p className="text-sm md:text-base text-[var(--color-ink-muted)] leading-relaxed">
          For inquiries or requests regarding our Privacy Policy, please reach out to us at:
        </p>
        <div className="text-sm md:text-base text-[var(--color-gold)] font-medium">
          privacy@arkpelle.com
        </div>
      </section>
    </PolicyLayout>
  );
}
