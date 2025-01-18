interface GTagEvent {
  event_category?: string;
  event_label?: string;
  value?: number;
  [key: string]: string | number | boolean | undefined;
}

interface Window {
  gtag: (
    command: 'event',
    action: string,
    params: GTagEvent
  ) => void;

  plausible?: (
    eventName: string,
    options?: {
      props?: {
        [key: string]: string | number | boolean;
      };
    }
  ) => void;
}
