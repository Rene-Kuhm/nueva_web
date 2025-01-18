import { useState, useEffect } from 'react';

// Tipos para métricas de rendimiento
interface PerformanceMetrics {
  ttfb: number;
  fcp: number;
  loadTime: number;
  timeToInteractive: number;
}

export function usePerformance() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    ttfb: 0,
    fcp: 0,
    loadTime: 0,
    timeToInteractive: 0,
  });

  useEffect(() => {
    // Verificar soporte de Web Performance API
    if (!('performance' in window)) return;

    const measurePerformance = () => {
      const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paintEntries = performance.getEntriesByType('paint');
      
      const newMetrics: PerformanceMetrics = {
        ttfb: navigationEntry.responseStart - navigationEntry.startTime,
        fcp: paintEntries.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0,
        loadTime: navigationEntry.loadEventEnd - navigationEntry.startTime,
        timeToInteractive: navigationEntry.domInteractive - navigationEntry.startTime,
      };

      setMetrics(newMetrics);

      // Opcional: Enviar métricas a servicio de análisis
      if (process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT) {
        fetch(process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newMetrics),
        });
      }
    };

    // Medir rendimiento después de cargar
    if (document.readyState === 'complete') {
      measurePerformance();
    } else {
      window.addEventListener('load', measurePerformance);
      return () => window.removeEventListener('load', measurePerformance);
    }
  }, []);

  return metrics;
}

// Función de utilidad para medir tiempo de renderizado de componentes
export function measureRenderTime(componentName: string) {
  const start = performance.now();
  
  return () => {
    const end = performance.now();
    const renderTime = end - start;
    
    if (renderTime > 50) {
      console.warn(`Slow render: ${componentName} took ${renderTime.toFixed(2)}ms`);
    }
  };
}
