import { Metadata } from 'next';

// Tipos para configuración de SEO
export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
}

// Interfaz para JSON-LD
export interface JsonLdProps {
  title: string;
  description: string;
  canonicalUrl?: string;
}

export class SEOService {
  // Generar metadatos dinámicos
  public static generateMetadata(props: SEOProps): Metadata {
    const {
      title = 'René Kuhm - Desarrollador Web Full Stack',
      description = 'Transformando ideas en soluciones digitales innovadoras. Desarrollo de aplicaciones web y móviles que impulsan tu negocio.',
      keywords = ['desarrollo web', 'aplicaciones móviles', 'full stack', 'innovación tecnológica'],
      canonicalUrl = 'https://renekuhm.com',
      ogImage = '/images/og-image.jpg'
    } = props;

    return {
      title: {
        default: title,
        template: `%s | René Kuhm`
      },
      description,
      keywords,
      openGraph: {
        title,
        description,
        type: 'website',
        locale: 'es_CL',
        url: canonicalUrl,
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: title
          }
        ]
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [ogImage]
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
      verification: {
        google: 'googleSiteVerification',
      },
      alternates: {
        canonical: canonicalUrl,
      },
    };
  }

  // Generar JSON-LD para rich snippets
  public static generateJsonLd(props: JsonLdProps) {
    const { 
      title, 
      description, 
      canonicalUrl = 'https://renekuhm.com' 
    } = props;

    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: title,
      description: description,
      url: canonicalUrl,
      publisher: {
        '@type': 'Organization',
        name: 'René Kuhm',
        logo: {
          '@type': 'ImageObject',
          url: 'https://renekuhm.com/logo.png'
        }
      }
    };
  }
}
