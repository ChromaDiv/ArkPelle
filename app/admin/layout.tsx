import type { ReactNode } from 'react';

export const metadata = {
  title: { default: 'Admin — Ark Pelle', template: '%s | Admin · Ark Pelle' },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  // Pass-through root layout for the /admin area.
  // The actual auth guard and navigation shell reside in app/admin/dashboard/layout.tsx
  // to avoid infinite redirect loops on the /admin/login page.
  return <>{children}</>;
}
