import { Metadata } from 'next'

export const baseMetadata: Metadata = {
  metadataBase: new URL('https://kuhmdev.com.ar'),
  title: {
    default: 'KuhmDev - Soluciones Digitales Innovadoras',
    template: '%s | KuhmDev'
  },
  description: 'Transformamos ideas en soluciones digitales innovadoras. Desarrollo web, aplicaciones y servicios tecnológicos de alta calidad.',
  keywords: [
    'desarrollo web', 
    'soluciones digitales', 
    'tecnología', 
    'innovación', 
    'aplicaciones web', 
    'diseño web', 
    'programación'
  ],
  authors: [{ name: 'René Kuhm', url: 'https://kuhmdev.com.ar' }],
  creator: 'René Kuhm',
  publisher: 'KuhmDev',
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
    locale: 'es_AR',
    url: 'https://kuhmdev.com.ar',
    title: 'KuhmDev - Soluciones Digitales Innovadoras',
    description: 'Transformamos ideas en soluciones digitales innovadoras.',
    siteName: 'KuhmDev',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'KuhmDev - Soluciones Digitales'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KuhmDev - Soluciones Digitales Innovadoras',
    description: 'Transformamos ideas en soluciones digitales innovadoras.',
    creator: '@renekuhm',
    images: ['/og-image.png']
  },
  verification: {
    google: 'google-site-verification-code',
    other: {
      'msvalidate.01': 'bing-site-verification-code'
    }
  }
}

export function generatePageMetadata(overrides?: Partial<Metadata>): Metadata {
  return {
    ...baseMetadata,
    ...overrides
  }
}
