import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

// Implementación simple de rate limiting en memoria
const rateLimiter = new Map<string, { count: number; timestamp: number }>();

const RATE_LIMIT = 10; // Número máximo de solicitudes
const WINDOW_MS = 60 * 1000; // Ventana de tiempo: 1 minuto

// Configuración de seguridad y rendimiento
export function middleware(request: NextRequest) {
  // Crear respuesta por defecto
  const response = NextResponse.next();

  // Cabeceras de seguridad
  const securityHeaders = {
    'X-DNS-Prefetch-Control': 'on',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'X-Frame-Options': 'SAMEORIGIN',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'origin-when-cross-origin',
    'X-Permitted-Cross-Domain-Policies': 'none',
    'X-XSS-Protection': '1; mode=block',
    'Cache-Control': 'public, max-age=86400, stale-while-revalidate=3600',
  };

  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Optimización de caché para recursos estáticos
  const staticResourcesRegex = /\.(js|css|png|jpg|jpeg|gif|webp|svg|ico|woff|woff2)$/;
  
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

  // Obtener IP de manera compatible
  const ip = 
    request.headers.get('x-forwarded-for')?.split(',')[0] || 
    request.headers.get('x-real-ip') || 
    '127.0.0.1';

  const now = Date.now();
  const windowStart = now - WINDOW_MS;

  // Limpiar entradas antiguas usando un método más compatible
  Array.from(rateLimiter.entries()).forEach(([key, value]) => {
    if (value.timestamp < windowStart) {
      rateLimiter.delete(key);
    }
  });

  // Verificar límite de tasa
  const entry = rateLimiter.get(ip);
  if (entry) {
    if (entry.count >= RATE_LIMIT) {
      return new NextResponse(
        JSON.stringify({ error: 'Demasiadas solicitudes' }),
        { 
          status: 429, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }
    entry.count++;
    entry.timestamp = now;
  } else {
    rateLimiter.set(ip, { count: 1, timestamp: now });
  }

  return response;
}

// Configurar rutas para middleware
export const config = {
  matcher: [
    // Aplicar middleware a todas las rutas
    '/((?!api/|_next/static|_next/image|favicon.ico).*)',
  ],
};
