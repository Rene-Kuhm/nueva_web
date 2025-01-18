// Servicio de Analytics unificado

type AnalyticsEvent = {
  category: string;
  action: string;
  label?: string;
  value?: number;
};

export class AnalyticsService {
  private static instance: AnalyticsService;

  private constructor() {}

  public static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  // Envío de eventos a múltiples servicios
  public trackEvent(event: AnalyticsEvent) {
    this.googleAnalytics(event);
    this.plausibleAnalytics(event);
    this.customAnalytics(event);
  }

  // Integración con Google Analytics
  private googleAnalytics(event: AnalyticsEvent) {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', event.action, {
        'event_category': event.category,
        'event_label': event.label,
        'value': event.value
      });
    }
  }

  // Integración con Plausible Analytics
  private plausibleAnalytics(event: AnalyticsEvent) {
    if (typeof window !== 'undefined' && window.plausible) {
      window.plausible(event.action, { 
        props: {
          category: event.category,
          label: event.label
        }
      });
    }
  }

  // Servicio de analytics personalizado
  private customAnalytics(event: AnalyticsEvent) {
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
  public pageView(path: string) {
    this.trackEvent({
      category: 'Page View',
      action: path
    });
  }

  // Tracking de conversiones
  public trackConversion(conversionName: string, value?: number) {
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
