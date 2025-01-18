// Utilidades de rendimiento

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

export const measurePerformance = () => {
  if (typeof window !== 'undefined' && 'performance' in window) {
    const navigationEntries = performance.getEntriesByType('navigation');
    
    if (navigationEntries.length > 0) {
      const navigationEntry = navigationEntries[0] as PerformanceNavigationTiming;
      
      const metrics = {
        loadTime: navigationEntry.loadEventEnd - navigationEntry.startTime,
        domInteractive: navigationEntry.domInteractive - navigationEntry.startTime,
        firstContentfulPaint: navigationEntry.firstContentfulPaint - navigationEntry.startTime,
        timeToInteractive: navigationEntry.domInteractive - navigationEntry.startTime,
      };

      // Opcional: enviar métricas a un servicio de análisis
      console.log('Performance Metrics:', metrics);
    }
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
  measurePerformance();
  lazyLoadImages();
};
