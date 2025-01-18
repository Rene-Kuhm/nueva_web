'use client';

import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import '@/styles/globals.css';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { ScrollToTop } from '@/components/scroll-to-top';
import { ErrorBoundary } from '@/components/error-boundary';
import { SEOService } from '@/lib/seo';
import { optimizeWebVitals } from '@/lib/performance';
import type { ReactNode } from 'react';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700']
});

export const metadata = {
  title: process.env.NEXT_PUBLIC_SITE_NAME || 'Nueva Web',
  description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 'Mi nueva web con Next.js',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Ejecutar optimizaciones de rendimiento al montar
  if (typeof window !== 'undefined') {
    optimizeWebVitals();
  }

  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={inter.className}
    >
      <head>
        {/* Preconexiones y recursos críticos */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Metadatos de rendimiento y SEO */}
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <meta name="theme-color" content="#000000" />
        <link rel="icon" href="/favicon.ico" />

        {/* JSON-LD para rich snippets */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              SEOService.generateJsonLd({
                title: 'René Kuhm - Desarrollador Web Full Stack',
                description: 'Transformando ideas en soluciones digitales innovadoras.',
              })
            ),
          }}
        />
      </head>
      <body className="min-h-screen bg-background text-foreground flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main className="flex-grow">
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </main>
          <Footer />
          <ScrollToTop />
        </ThemeProvider>
      </body>
    </html>
  );
}
