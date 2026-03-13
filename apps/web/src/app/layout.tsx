import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'depaneurIA',
  description: 'Commander simplement, livrer clairement.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body
        style={{
          margin: 0,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          background: '#f0f2f5',
          minHeight: '100vh',
        }}
      >
        {children}
      </body>
    </html>
  );
}
