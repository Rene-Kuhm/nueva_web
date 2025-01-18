import { createInstance, i18n } from 'i18next';
import { initReactI18next } from 'react-i18next';

// Definir tipos de recursos de idioma
export interface LanguageResources {
  [key: string]: {
    translation: Record<string, string>;
  };
}

// Recursos de idioma
const resources: LanguageResources = {
  es: {
    translation: {
      // Traducciones en español
      welcome: 'Bienvenido',
      home: 'Inicio',
      about: 'Sobre mí',
      projects: 'Proyectos',
      contact: 'Contacto',
      
      // Mensajes de formulario
      form: {
        name: 'Nombre',
        email: 'Correo electrónico',
        subject: 'Asunto',
        message: 'Mensaje',
        send: 'Enviar',
        success: 'Mensaje enviado exitosamente',
        error: 'Hubo un error al enviar el mensaje'
      }
    }
  },
  en: {
    translation: {
      // Traducciones en inglés
      welcome: 'Welcome',
      home: 'Home',
      about: 'About',
      projects: 'Projects',
      contact: 'Contact',
      
      // Form messages
      form: {
        name: 'Name',
        email: 'Email',
        subject: 'Subject',
        message: 'Message',
        send: 'Send',
        success: 'Message sent successfully',
        error: 'There was an error sending the message'
      }
    }
  }
};

// Configuración de i18next
export function initI18next(lng: string = 'es') {
  const i18nInstance = createInstance();
  
  i18nInstance
    .use(initReactI18next)
    .init({
      resources,
      lng,
      fallbackLng: 'es',
      interpolation: {
        escapeValue: false // React ya escapa los valores
      },
      supportedLngs: ['es', 'en'],
      load: 'languageOnly',
      detection: {
        order: ['cookie', 'localStorage', 'navigator'],
        caches: ['cookie', 'localStorage']
      }
    });

  return i18nInstance;
}

// Hook para usar traducciones
export function useTranslation(lng: string = 'es') {
  const i18nInstance = initI18next(lng);
  
  return {
    t: i18nInstance.t,
    i18n: i18nInstance
  };
}

// Función para cambiar idioma
export function changeLanguage(lng: string) {
  const i18nInstance = initI18next();
  i18nInstance.changeLanguage(lng);
}
