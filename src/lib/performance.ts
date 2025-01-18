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

export const preloadResources = () => {
  if (typeof window !== 'undefined') {
    // Precargar recursos críticos
    const links = [
      { rel: 'preload', href: '/fonts/inter-latin.woff2', as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
    ];

    links.forEach(link => {
      const preloadLink = document.createElement('link');
      Object.entries(link).forEach(([key, value]) => {
        preloadLink.setAttribute(key, value as string);
      });
      document.head.appendChild(preloadLink);
    });
  }
};

export const lazyLoadImages = () => {
  if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
      img.setAttribute('loading', 'lazy');
    });
  }
};

export const optimizeWebVitals = () => {
  preloadResources();
  performanceMonitor.trackPageLoad();
  lazyLoadImages();
};
