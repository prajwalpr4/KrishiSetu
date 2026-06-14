import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { Analytics } from '@vercel/analytics/react';
import './globals.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'KrishiSetu — AI-Powered Farming Assistant | कृषि सेतु | ಕೃಷಿ ಸೇತು',
  description:
    'KrishiSetu is a free, AI-powered agricultural super-app for Indian farmers. Features include crop disease detection, government scheme matching, mandi prices, smart irrigation, farm inventory management, and multilingual chatbot support in Hindi, English, and Kannada.',
  keywords: [
    'KrishiSetu',
    'farming app India',
    'crop disease detection',
    'mandi prices',
    'PM-KISAN',
    'agriculture AI',
    'Indian farmer app',
    'irrigation advisory',
    'कृषि सेतु',
    'ಕೃಷಿ ಸೇತು',
  ],
  authors: [{ name: 'KrishiSetu' }],
  openGraph: {
    title: 'KrishiSetu — Your AI Farming Partner',
    description: 'Free AI-powered agricultural super-app for Indian farmers.',
    type: 'website',
    locale: 'en_IN',
  },
};

export const dynamic = 'force-dynamic';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${poppins.variable} scroll-smooth`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#166534" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="font-poppins antialiased">
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#ffffff',
              color: '#1c1917',
              border: '1px solid #bbf7d0',
              borderRadius: '0.75rem',
              padding: '12px 16px',
              fontFamily: 'var(--font-poppins), sans-serif',
              fontSize: '14px',
            },
            success: {
              iconTheme: {
                primary: '#16a34a',
                secondary: '#ffffff',
              },
            },
            error: {
              iconTheme: {
                primary: '#dc2626',
                secondary: '#ffffff',
              },
            },
          }}
        />
        <Analytics />
      </body>
    </html>
  );
}
