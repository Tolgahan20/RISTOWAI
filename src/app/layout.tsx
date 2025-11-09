import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Ristowai - Copilota AI per Ristoranti',
  description: 'Gestisci il tuo ristorante con l\'intelligenza artificiale. Ottimizza turni, costi, menu e marketing con Ristowai.',
  icons: {
    icon: [
      { url: '/favicon_16x16_white.svg', sizes: '16x16', type: 'image/svg+xml' },
      { url: '/favicon_32x32_white.svg', sizes: '32x32', type: 'image/svg+xml' },
      { url: '/favicon_48x48_white.svg', sizes: '48x48', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/favicon_48x48_white.svg', sizes: '48x48', type: 'image/svg+xml' },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}