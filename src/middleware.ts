import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Configuración de seguridad y rendimiento
export function middleware(request: NextRequest) {
  // Cabeceras de seguridad
  const securityHeaders = {
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Cache-Control': 'public, max-age=86400, stale-while-revalidate=3600',
  };

  // Optimización de caché para recursos estáticos
  const staticResourcesRegex = /\.(js|css|png|jpg|jpeg|gif|webp|svg|ico|woff|woff2)$/;
  
  // Añadir cabeceras de seguridad y caché
  const response = NextResponse.next();
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Caché optimizada para recursos estáticos
  if (staticResourcesRegex.test(request.nextUrl.pathname)) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  }

  // Comprobación de origen
  const allowedOrigins = [
    'https://renekuhm.com',
    'http://localhost:3000',
  ];

  const origin = request.headers.get('origin') ?? '';
  if (origin && !allowedOrigins.includes(origin)) {
    return new NextResponse(null, { 
      status: 403, 
      statusText: 'Forbidden' 
    });
  }

  // Prevención de ataques de fuerza bruta
  const rateLimitKey = `rate_limit:${request.ip}`;
  // TODO: Implementar almacenamiento distribuido de límite de rate (Redis/Upstash)

  return response;
}

// Configurar rutas para middleware
export const config = {
  matcher: [
    // Aplicar middleware a todas las rutas
    '/((?!api/|_next/static|_next/image|favicon.ico).*)',
  ],
};
