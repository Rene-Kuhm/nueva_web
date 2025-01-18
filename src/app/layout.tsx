import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import '@/styles/globals.css';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { ScrollToTop } from '@/components/scroll-to-top';
import { ErrorBoundary } from '@/components/error-boundary';
import { SEOService } from '@/lib/seo';
import { optimizeWebVitals } from '@/lib/performance';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://kuhmdev.com.ar'),
  title: {
    template: '%s | René Kuhm',
    default: 'René Kuhm | Desarrollador Web Full Stack',
  },
  description:
    'Desarrollador web full stack especializado en React, Next.js y Node.js. Creando soluciones web modernas y eficientes.',
  keywords: [
    'desarrollador web',
    'full stack',
    'react',
    'next.js',
    'node.js',
    'typescript',
    'javascript',
  ],
  authors: [{ name: 'René Kuhm' }],
  creator: 'René Kuhm',
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    siteName: 'René Kuhm',
    title: 'René Kuhm | Desarrollador Web Full Stack',
    description:
      'Desarrollador web full stack especializado en React, Next.js y Node.js. Creando soluciones web modernas y eficientes.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'René Kuhm - Desarrollador Web Full Stack',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'René Kuhm | Desarrollador Web Full Stack',
    description:
      'Desarrollador web full stack especializado en React, Next.js y Node.js. Creando soluciones web modernas y eficientes.',
    images: ['/og-image.jpg'],
    creator: '@renekuhm',
  },
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
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Ejecutar optimizaciones de rendimiento al montar
  if (typeof window !== 'undefined') {
    optimizeWebVitals();
  }

  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${inter.className} font-sans scroll-smooth antialiased`}
    >
      <head>
        {/* Preconexiones y recursos críticos */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Metadatos de rendimiento y SEO */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />

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
        <ErrorBoundary>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
            <ScrollToTop />
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
