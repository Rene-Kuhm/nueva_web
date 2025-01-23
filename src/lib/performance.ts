// Utilidades de rendimiento

interface PerformanceMetrics {
  loadTime: number;
  domInteractive: number;
  firstContentfulPaint: number;
  timeToInteractive: number;
}

class PerformanceMonitor {
  private static instance: PerformanceMonitor;

  private constructor() {
    // Inicialización privada
  }

  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  public getMetrics(): PerformanceMetrics | null {
    if (typeof window === 'undefined' || !window.performance) {
      return null;
    }

    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paintEntries = performance.getEntriesByType('paint');
    const firstContentfulPaint = paintEntries.find(entry => entry.name === 'first-contentful-paint');

    if (!navigationEntry || !firstContentfulPaint) {
      return null;
    }

    return {
      loadTime: navigationEntry.loadEventEnd - navigationEntry.startTime,
      domInteractive: navigationEntry.domInteractive - navigationEntry.startTime,
      firstContentfulPaint: firstContentfulPaint.startTime,
      timeToInteractive: navigationEntry.domInteractive - navigationEntry.startTime,
    };
  }

  public trackPageLoad(): void {
    if (typeof window === 'undefined') return;

    // Esperar a que la página se cargue completamente
    window.addEventListener('load', () => {
      // Dar tiempo para que se registren las métricas de rendimiento
      setTimeout(() => {
        const metrics = this.getMetrics();
        if (metrics) {
          console.log('Performance Metrics:', metrics);
          // Aquí puedes enviar las métricas a tu servicio de analytics
          this.sendMetricsToAnalytics(metrics);
        }
      }, 0);
    });
  }

  private sendMetricsToAnalytics(metrics: PerformanceMetrics): void {
    // Implementar el envío de métricas a tu servicio de analytics
    // Por ejemplo:
    if (typeof window !== 'undefined' && 'gtag' in window) {
      window.gtag('event', 'performance_metrics', {
        event_category: 'Performance',
        event_label: window.location.pathname,
        ...metrics,
      });
    }
  }
}

export const performanceMonitor = PerformanceMonitor.getInstance();

// Funciones de optimización de rendimiento

export function optimizeWebVitals() {
  if (typeof window !== 'undefined') {
    // Configurar métricas web vitales
    const perfEntries = performance.getEntriesByType('navigation');
    
    if (perfEntries.length > 0) {
      const navigationEntry = perfEntries[0] as PerformanceNavigationTiming;
      
      // Métricas de carga
      const loadTime = navigationEntry.loadEventEnd - navigationEntry.startTime;
      const ttfb = navigationEntry.responseStart - navigationEntry.startTime;
      const domInteractive = navigationEntry.domInteractive - navigationEntry.startTime;
      
      // Registro de métricas
      console.log('Performance Metrics:', {
        loadTime: `${loadTime.toFixed(2)}ms`,
        timeToFirstByte: `${ttfb.toFixed(2)}ms`,
        domInteractive: `${domInteractive.toFixed(2)}ms`
      });
    }

    // Optimizar recursos
    if ('requestIdleCallback' in window) {
      (window as Window).requestIdleCallback(() => {
        // Tareas de baja prioridad
        prefetchCriticalResources();
      });
    }
  }
}

function prefetchCriticalResources() {
  const criticalResources = [
    '/fonts/inter.woff2',
    // Añade aquí otros recursos críticos
  ];

  criticalResources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = resource;
    document.head.appendChild(link);
  });
}

// Función para medir el tiempo de carga de componentes
export function measureComponentPerformance(
  componentName: string, 
  renderCallback: () => void
) {
  const start = performance.now();
  renderCallback();
  const end = performance.now();

  console.log(`Render time for ${componentName}: ${(end - start).toFixed(2)}ms`);
}
