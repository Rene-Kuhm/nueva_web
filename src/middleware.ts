import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Implementación simple de rate limiting en memoria
const rateLimiter = new Map<string, { count: number; timestamp: number }>();

const RATE_LIMIT = {
  MAX_REQUESTS: 100,
  WINDOW_MS: 60000, // 1 minuto
};

const checkRateLimit = (ip: string): boolean => {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT.WINDOW_MS;

  // Limpiar entradas antiguas
  for (const [key, value] of rateLimiter.entries()) {
    if (value.timestamp < windowStart) {
      rateLimiter.delete(key);
    }
  }

  const current = rateLimiter.get(ip) || { count: 0, timestamp: now };
  
  if (current.timestamp < windowStart) {
    current.count = 0;
    current.timestamp = now;
  }

  if (current.count >= RATE_LIMIT.MAX_REQUESTS) {
    return false;
  }

  current.count++;
  rateLimiter.set(ip, current);
  return true;
};

// Configuración de seguridad y rendimiento
export async function middleware(request: NextRequest) {
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

  // Rate limiting
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : '127.0.0.1';

  if (!checkRateLimit(ip)) {
    return new NextResponse('Too Many Requests', {
      status: 429,
      headers: {
        'Retry-After': '60',
      },
    });
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
