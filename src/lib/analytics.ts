// Servicio de Analytics unificado

interface AnalyticsEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
}

export class AnalyticsService {
  private static instance: AnalyticsService;

  private constructor() {
    // Inicialización privada
  }

  public static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  // Envío de eventos a múltiples servicios
  public trackEvent(event: AnalyticsEvent): void {
    // Solo ejecutar en el cliente
    if (typeof window === 'undefined') return;

    // Enviar a múltiples servicios de analytics
    this.googleAnalytics(event);
    this.plausibleAnalytics(event);
    this.customAnalytics(event);
  }

  // Integración con Google Analytics
  private googleAnalytics(event: AnalyticsEvent): void {
    if (typeof window !== 'undefined' && 'gtag' in window) {
      window.gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
      });
    }
  }

  // Integración con Plausible Analytics
  private plausibleAnalytics(event: AnalyticsEvent): void {
    if (typeof window !== 'undefined' && window.plausible) {
      const props: Record<string, string | number | boolean> = {
        category: event.category
      };

      if (event.label) {
        props.label = event.label;
      }

      if (event.value !== undefined) {
        props.value = event.value;
      }

      window.plausible(event.action, { props });
    }
  }

  // Servicio de analytics personalizado
  private customAnalytics(event: AnalyticsEvent): void {
    // Implementar lógica de analytics personalizada aquí
    if (process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT) {
      fetch(process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...event,
          timestamp: new Date().toISOString(),
          url: window.location.href
        }),
      }).catch(console.error);
    }
  }

  // Tracking de página
  public pageView(path: string): void {
    this.trackEvent({
      category: 'Page View',
      action: path
    });
  }

  // Tracking de conversiones
  public trackConversion(conversionName: string, value?: number): void {
    this.trackEvent({
      category: 'Conversion',
      action: conversionName,
      value: value
    });
  }
}

// Hook para usar analytics de forma sencilla
export function useAnalytics() {
  const analytics = AnalyticsService.getInstance();
  return {
    trackEvent: (event: AnalyticsEvent) => analytics.trackEvent(event),
    pageView: (path: string) => analytics.pageView(path),
    trackConversion: (conversionName: string, value?: number) => 
      analytics.trackConversion(conversionName, value)
  };
}

export const analytics = AnalyticsService.getInstance();
