'use client';

import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { baseMetadata } from './metadata';
import '@/styles/globals.css';

// Configuración de fuente optimizada
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700']
});

export default function RootLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  // Convertir keywords a string de manera segura
  const keywords = Array.isArray(baseMetadata.keywords) 
    ? baseMetadata.keywords.join(', ') 
    : baseMetadata.keywords || '';

  return (
    <html 
      lang="es" 
      suppressHydrationWarning
      className={`${inter.className} scroll-smooth`}
      style={{ 
        colorScheme: 'light',
        fontFamily: inter.style.fontFamily 
      }}
    >
      <head>
        {/* Precargar recursos críticos */}
        <link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        
        {/* Definición de fuente local */}
        <style jsx global>{`
          @font-face {
            font-family: 'Inter';
            font-style: normal;
            font-weight: 400 700;
            font-display: swap;
            src: url('/fonts/inter.woff2') format('woff2');
          }
        `}</style>
        
        {/* Metadatos críticos */}
        <meta charSet="utf-8" />
        <title>{baseMetadata.title as string}</title>
        <meta name="description" content={baseMetadata.description as string} />
        <meta name="keywords" content={keywords} />
        <meta 
          name="viewport" 
          content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" 
        />
        
        {/* Optimización de recursos */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="/favicon.ico" />

        {/* Estilos críticos en línea */}
        <style jsx global>{`
          :root {
            --font-inter: ${inter.style.fontFamily};
          }
        `}</style>

        {/* Carga diferida de estilos no críticos */}
        <link 
          rel="preload" 
          href="/styles/non-critical.css" 
          as="style" 
          onLoad={() => {
            // Lógica de carga de estilos
            const link = document.querySelector('link[href="/styles/non-critical.css"]') as HTMLLinkElement;
            if (link) {
              link.rel = 'stylesheet';
            }
          }}
        />
        <noscript>
          <link rel="stylesheet" href="/styles/non-critical.css" />
        </noscript>
      </head>
      <body 
        className="min-h-screen bg-background text-foreground flex flex-col scroll-smooth"
        aria-label="Contenido principal de KuhmDev"
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
