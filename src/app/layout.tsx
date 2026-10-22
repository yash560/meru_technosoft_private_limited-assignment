import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://meru-technosoft-assignment-lac.vercel.app'),
  title: 'Meru QA Sentinel — Automated Financial QA Testing Platform | HelloBooks.ai',
  description:
    'Production-grade automated QA verification and financial invariant testing harness for HelloBooks.ai and Meru Technosoft Private Limited. Powered by TheWebVale.',
  keywords: [
    'Meru Technosoft',
    'HelloBooks.ai',
    'Software Testing',
    'QA Engineering',
    'General Ledger Invariance',
    'Plaid Bank Feeds',
    'GST Tax Compliance',
    'Playwright E2E',
    'TheWebVale',
    'Next.js 15',
  ],
  authors: [{ name: 'Meru Technosoft & TheWebVale' }],
  creator: 'TheWebVale',
  publisher: 'Meru Technosoft Private Limited',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://meru-technosoft-assignment-lac.vercel.app',
    siteName: 'Meru QA Sentinel',
    title: 'Meru QA Sentinel — Automated Financial Testing Harness | Powered by TheWebVale',
    description:
      '34 automated financial invariant test cases verifying double-entry bookkeeping, Plaid bank feeds, and GST calculations for HelloBooks.ai.',
    images: [
      {
        url: 'https://meru-technosoft-assignment-lac.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Meru QA Sentinel Financial Invariance Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Meru QA Sentinel — HelloBooks.ai Testing Harness | Powered by TheWebVale',
    description:
      'Mathematical invariant verification for fintech general ledgers and GST filing. Powered by TheWebVale.',
    images: ['https://meru-technosoft-assignment-lac.vercel.app/og-image.png'],
    creator: '@TheWebVale',
  },
  alternates: {
    canonical: 'https://meru-technosoft-assignment-lac.vercel.app',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🛡️</text></svg>" />
      </head>
      <body className="antialiased font-sans selection:bg-sky-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
