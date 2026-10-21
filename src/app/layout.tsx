import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Meru QA Sentinel — Automated Financial Testing Harness for HelloBooks.ai',
  description: 'Production-grade automated QA verification and financial invariant testing harness for HelloBooks.ai / Meru Technosoft Private Limited. Built by Yash Jain.',
  keywords: [
    'Meru Technosoft',
    'HelloBooks.ai',
    'Software Testing',
    'QA Engineering',
    'General Ledger Invariance',
    'Plaid Bank Feeds',
    'GST Tax Compliance',
    'Playwright E2E'
  ],
  authors: [{ name: 'Yash Jain' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="antialiased font-sans selection:bg-sky-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
